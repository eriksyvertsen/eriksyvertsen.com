"use client";

import { useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("submitting");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Something went wrong.");
        return;
      }
      setStatus("success");
      setMessage("Thanks — you're on the list.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Network error. Try again.");
    }
  }

  return (
    <div className="signup-form">
      <div className="signup-form-label">Get updates on new essays</div>
      <form onSubmit={handleSubmit} className="signup-form-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          aria-label="Email address"
          className="signup-form-input"
          disabled={status === "submitting" || status === "success"}
        />
        <button
          type="submit"
          className="signup-form-button"
          disabled={status === "submitting" || status === "success"}
        >
          {status === "submitting" ? "…" : "Subscribe"}
        </button>
      </form>
      {message && (
        <div
          className="signup-form-message"
          data-status={status}
          role="status"
        >
          {message}
        </div>
      )}
    </div>
  );
}
