import fs from "fs";
import path from "path";

const contentDir = path.join(process.cwd(), "content", "subscribers");

interface Subscriber {
  email: string;
  createdAt: string;
  source?: string;
}

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

function yamlQuote(value: string): string {
  return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

function toYaml(sub: Subscriber): string {
  const lines = [
    `email: ${yamlQuote(sub.email)}`,
    `createdAt: ${yamlQuote(sub.createdAt)}`,
    `source: ${yamlQuote(sub.source ?? "")}`,
  ];
  return lines.join("\n") + "\n";
}

const GH_OWNER = "eriksyvertsen";
const GH_REPO = "eriksyvertsen.com";
const GH_BRANCH = "main";

async function persistToGitHub(
  slug: string,
  yaml: string,
  email: string
): Promise<"created" | "exists" | "skipped" | "error"> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return "skipped";

  const url = `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/content/subscribers/${slug}.yaml`;
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "eriksyvertsen.com-subscribe",
    },
    body: JSON.stringify({
      message: `Add subscriber ${email}`,
      content: Buffer.from(yaml, "utf-8").toString("base64"),
      branch: GH_BRANCH,
    }),
  });

  if (res.ok) return "created";
  if (res.status === 422) return "exists";

  const text = await res.text().catch(() => "");
  console.error(`[subscribe] GitHub commit failed: ${res.status} ${text}`);
  return "error";
}

function persistToDisk(slug: string, yaml: string): "created" | "exists" | "error" {
  try {
    if (!fs.existsSync(contentDir)) fs.mkdirSync(contentDir, { recursive: true });
    const filePath = path.join(contentDir, `${slug}.yaml`);
    if (fs.existsSync(filePath)) return "exists";
    fs.writeFileSync(filePath, yaml, "utf-8");
    return "created";
  } catch (err) {
    console.error("[subscribe] disk write failed:", err);
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
  const subscriber: Subscriber = { email, createdAt, source };
  const slug = emailToSlug(email);
  const yaml = toYaml(subscriber);

  const useGitHub = !!process.env.GITHUB_TOKEN;
  const result = useGitHub
    ? await persistToGitHub(slug, yaml, email)
    : persistToDisk(slug, yaml);

  console.log(
    `[subscribe] email=${email} slug=${slug} via=${useGitHub ? "github" : "disk"} result=${result} ip=${ip}`
  );

  if (result === "error") {
    return Response.json(
      { error: "Could not save right now. Please try again." },
      { status: 500 }
    );
  }

  return Response.json({ ok: true, alreadySubscribed: result === "exists" });
}
