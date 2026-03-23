"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function LibrarianChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const messagesEnd = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function sendMessage() {
    if (!input.trim() || streaming) return;

    const userMsg: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setStreaming(true);

    const assistantMsg: Message = { role: "assistant", content: "" };
    setMessages([...newMessages, assistantMsg]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (res.status === 429) {
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: "Rate limit reached. Try again tomorrow.",
          };
          return updated;
        });
        setStreaming(false);
        return;
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") break;
            try {
              const parsed = JSON.parse(data);
              accumulated += parsed.text;
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  role: "assistant",
                  content: accumulated,
                };
                return updated;
              });
            } catch {
              // skip malformed chunks
            }
          }
        }
      }
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "Something went wrong. Try again.",
        };
        return updated;
      });
    }

    setStreaming(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div style={containerStyle}>
      <div style={messagesStyle}>
        {messages.length === 0 && (
          <div style={{ textAlign: "center", padding: "calc(var(--unit) * 8) 0" }}>
            <p style={{ color: "var(--muted)", fontSize: 15 }}>
              Ask me anything about the knowledge graph.
            </p>
            <p className="meta" style={{ marginTop: 8 }}>
              51 themes &middot; 583 insights &middot; 28 connections
            </p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} style={msg.role === "user" ? userMsgStyle : assistantMsgStyle}>
            <div style={{ whiteSpace: "pre-wrap" }}>{msg.content}</div>
          </div>
        ))}
        <div ref={messagesEnd} />
      </div>

      <div style={inputAreaStyle}>
        <textarea
          ref={inputRef}
          style={textareaStyle}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask The Librarian..."
          rows={1}
          disabled={streaming}
        />
        <button
          style={sendBtnStyle}
          onClick={sendMessage}
          disabled={streaming || !input.trim()}
        >
          {streaming ? "..." : "\u2192"}
        </button>
      </div>
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  height: "calc(100vh - calc(var(--unit) * 10))",
  maxHeight: "80vh",
};

const messagesStyle: React.CSSProperties = {
  flex: 1,
  overflowY: "auto",
  paddingBottom: "calc(var(--unit) * 2)",
};

const userMsgStyle: React.CSSProperties = {
  padding: "calc(var(--unit) * 2) calc(var(--unit) * 3)",
  marginBottom: "calc(var(--unit) * 2)",
  background: "var(--surface)",
  fontSize: 15,
  lineHeight: 1.6,
};

const assistantMsgStyle: React.CSSProperties = {
  padding: "calc(var(--unit) * 2) 0",
  marginBottom: "calc(var(--unit) * 2)",
  fontSize: 15,
  lineHeight: 1.7,
};

const inputAreaStyle: React.CSSProperties = {
  display: "flex",
  gap: "calc(var(--unit) * 1)",
  borderTop: "1px solid var(--border)",
  paddingTop: "calc(var(--unit) * 2)",
};

const textareaStyle: React.CSSProperties = {
  flex: 1,
  background: "transparent",
  border: "1px solid var(--border)",
  padding: "calc(var(--unit) * 1.5) calc(var(--unit) * 2)",
  fontFamily: "var(--font-body)",
  fontSize: 15,
  color: "var(--text)",
  resize: "none",
  outline: "none",
};

const sendBtnStyle: React.CSSProperties = {
  background: "var(--text)",
  color: "var(--bg)",
  border: "none",
  padding: "0 calc(var(--unit) * 2)",
  fontFamily: "var(--font-body)",
  fontSize: 16,
  cursor: "pointer",
};
