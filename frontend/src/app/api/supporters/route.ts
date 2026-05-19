import { NextResponse } from "next/server";

export const runtime = "edge";

const KENYAN_PHONE = /^(?:\+254|0)(7|1)\d{8}$/;
const NAME_RX = /^[A-Za-z][A-Za-z\s'.-]{1,79}$/;
const POLLING_CENTERS = new Set([
  "Shompole",
  "Olkiramatian",
  "Magadi Town",
  "Pakase",
  "Entasopia",
  "Oldorko",
  "Lenderut",
  "Kamukuru",
  "Musenke",
]);

const MAX_BODY_BYTES = 4_096;

function jsonError(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

export async function POST(req: Request) {
  const contentLength = Number(req.headers.get("content-length") ?? "0");
  if (contentLength > MAX_BODY_BYTES) return jsonError("Payload too large", 413);

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return jsonError("Malformed JSON");
  }

  if (!payload || typeof payload !== "object") return jsonError("Invalid payload");
  const { name, phone, village } = payload as Record<string, unknown>;

  if (typeof name !== "string" || !NAME_RX.test(name.trim())) return jsonError("Invalid name");
  if (typeof phone !== "string" || !KENYAN_PHONE.test(phone.trim())) return jsonError("Invalid Kenyan phone");
  if (typeof village !== "string" || !POLLING_CENTERS.has(village)) return jsonError("Invalid polling centre");

  return NextResponse.json({
    ok: true,
    message: "Supporter registration acknowledged.",
    next: "OTP verification will be wired in once a persistence backend is connected (Vercel KV / Supabase / Postgres).",
  });
}

export function GET() {
  return jsonError("Method Not Allowed", 405);
}
