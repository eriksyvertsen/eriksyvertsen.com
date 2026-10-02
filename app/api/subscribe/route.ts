const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const rateLimits = new Map<string, { count: number; resetAt: number }>();
const MAX_PER_HOUR = 5;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimits.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimits.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 });
    return true;
  }
  if (entry.count >= MAX_PER_HOUR) return false;
  entry.count++;
  return true;
}

async function persistToSheet(
  email: string,
  createdAt: string,
  source?: string
): Promise<"created" | "exists" | "error"> {
  const url = process.env.SUBSCRIBE_WEBHOOK_URL;
  const secret = process.env.SUBSCRIBE_WEBHOOK_SECRET;
  if (!url || !secret) {
    console.error("[subscribe] SUBSCRIBE_WEBHOOK_URL / SUBSCRIBE_WEBHOOK_SECRET not set");
    return "error";
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ secret, email, createdAt, source: source ?? "" }),
      redirect: "follow",
    });
    const data = await res.json().catch(() => null);
    if (res.ok && data?.ok) return data.exists ? "exists" : "created";
    console.error(`[subscribe] sheet write failed: ${res.status} ${JSON.stringify(data)}`);
    return "error";
  } catch (err) {
    console.error("[subscribe] sheet write threw:", err);
    return "error";
  }
}

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  if (!checkRateLimit(ip)) {
    return Response.json(
      { error: "Too many requests. Try again later." },
      { status: 429 }
    );
  }

  let body: { email?: string; source?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  const source = body.source?.toString().slice(0, 200);

  if (!email || !EMAIL_RE.test(email) || email.length > 254) {
    return Response.json({ error: "Please enter a valid email." }, { status: 400 });
  }

  const createdAt = new Date().toISOString();
  const result = await persistToSheet(email, createdAt, source);

  console.log(`[subscribe] email=${email} result=${result} ip=${ip}`);

  if (result === "error") {
    return Response.json(
      { error: "Could not save right now. Please try again." },
      { status: 500 }
    );
  }

  return Response.json({ ok: true, alreadySubscribed: result === "exists" });
}
