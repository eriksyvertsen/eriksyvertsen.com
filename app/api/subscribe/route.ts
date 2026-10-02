import { put, BlobError } from "@vercel/blob";

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

function emailToSlug(email: string): string {
  return email
    .toLowerCase()
    .replace(/@/g, "-at-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function persist(
  email: string,
  createdAt: string,
  source?: string
): Promise<"created" | "exists" | "error"> {
  try {
    await put(
      `subscribers/${emailToSlug(email)}.json`,
      JSON.stringify({ email, createdAt, source: source ?? "" }),
      {
        access: "private",
        contentType: "application/json",
        addRandomSuffix: false,
        allowOverwrite: false,
      }
    );
    return "created";
  } catch (err) {
    if (err instanceof BlobError && /already exists/i.test(err.message)) return "exists";
    console.error("[subscribe] blob write failed:", err);
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
  const result = await persist(email, createdAt, source);

  console.log(`[subscribe] email=${email} result=${result} ip=${ip}`);

  if (result === "error") {
    return Response.json(
      { error: "Could not save right now. Please try again." },
      { status: 500 }
    );
  }

  return Response.json({ ok: true, alreadySubscribed: result === "exists" });
}
