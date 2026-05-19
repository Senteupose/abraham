import { NextResponse } from "next/server";

export const runtime = "edge";

const KENYAN_PHONE = /^(?:\+254|0)(7|1)\d{8}$/;
const MIN_AMOUNT = 10;
const MAX_AMOUNT = 1_000_000;
const MAX_BODY_BYTES = 1_024;

function jsonError(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

function normalisePhone(input: string): string {
  const trimmed = input.trim();
  if (trimmed.startsWith("+254")) return "254" + trimmed.slice(4);
  if (trimmed.startsWith("0")) return "254" + trimmed.slice(1);
  return trimmed;
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
  const { phone, amount } = payload as Record<string, unknown>;

  if (typeof phone !== "string" || !KENYAN_PHONE.test(phone.trim())) {
    return jsonError("Invalid Kenyan phone");
  }

  const numericAmount = typeof amount === "number" ? amount : Number(amount);
  if (!Number.isFinite(numericAmount) || numericAmount < MIN_AMOUNT || numericAmount > MAX_AMOUNT) {
    return jsonError(`Amount must be between KES ${MIN_AMOUNT} and KES ${MAX_AMOUNT}`);
  }

  const msisdn = normalisePhone(phone);
  const checkoutRequestId = `STK-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

  return NextResponse.json({
    ok: true,
    checkoutRequestId,
    msisdnHash: msisdn.slice(0, 6) + "****" + msisdn.slice(-2),
    amount: Math.round(numericAmount),
    message: "STK push acknowledged. Wire Safaricom Daraja v2 credentials to deliver the prompt.",
  });
}

export function GET() {
  return jsonError("Method Not Allowed", 405);
}
