import Anthropic from "@anthropic-ai/sdk";
import { buildSystemPrompt } from "@/lib/system-prompt";

const client = new Anthropic();

// Simple in-memory rate limiter
const rateLimits = new Map<string, { count: number; resetAt: number }>();
const MAX_REQUESTS_PER_DAY = 20;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimits.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimits.set(ip, {
      count: 1,
      resetAt: now + 24 * 60 * 60 * 1000,
    });
    return true;
  }

  if (entry.count >= MAX_REQUESTS_PER_DAY) {
    return false;
  }

  entry.count++;
  return true;
}

export async function POST(req: Request) {
  // Rate limit by IP
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  if (!checkRateLimit(ip)) {
    return new Response(
      JSON.stringify({ error: "Rate limit exceeded. Try again tomorrow." }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    );
  }

  const { messages } = await req.json();

  if (!messages || !Array.isArray(messages)) {
    return new Response("Missing messages", { status: 400 });
  }

  const systemPrompt = buildSystemPrompt();

  const stream = await client.messages.stream({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: systemPrompt,
    messages: messages.map((m: { role: string; content: string }) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
  });

  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      for await (const event of stream) {
        if (
          event.type === "content_block_delta" &&
          event.delta.type === "text_delta"
        ) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ text: event.delta.text })}\n\n`
            )
          );
        }
      }
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
