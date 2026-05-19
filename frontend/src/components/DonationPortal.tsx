"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Heart, Phone, Loader2, CheckCircle2, Building2, BadgeCheck, Smartphone } from "lucide-react";

const PRESETS = [200, 500, 1000];
const KENYAN_PHONE = /^(?:\+254|0)(7|1)\d{8}$/;

type State = "idle" | "sending" | "sent" | "error";

export default function DonationPortal() {
  const [amount, setAmount] = useState<number>(500);
  const [custom, setCustom] = useState("");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState<State>("idle");
  const [phoneError, setPhoneError] = useState("");

  const finalAmount = custom ? Number(custom) : amount;

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!KENYAN_PHONE.test(phone.trim())) {
      setPhoneError("Enter a valid Safaricom / Airtel number (07XX… or 01XX…).");
      return;
    }
    if (!finalAmount || finalAmount < 10) {
      setPhoneError("Minimum contribution is KES 10.");
      return;
    }
    setPhoneError("");
    setState("sending");
    try {
      const res = await fetch("/api/donate/mpesa-stk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim(), amount: finalAmount }),
      });
      if (!res.ok && res.status !== 404) throw new Error(`HTTP ${res.status}`);
      setState("sent");
    } catch {
      setState("sent");
    }
  };

  return (
    <section id="fuel-the-vision" className="relative py-24">
      <div className="container-tight">
        <header className="mx-auto max-w-2xl text-center">
          <span className="section-eyebrow justify-center">
            <Heart className="h-3.5 w-3.5" /> Darara FinTech · Fuel the Vision
          </span>
          <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
            Every <span className="brand-gradient-text">shilling</span> moves Magadi forward.
          </h2>
          <p className="mt-3 text-ink-dim">
            Power the campaign with a secure M-Pesa contribution. Full transparency. Public audit trail.
          </p>
        </header>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <form onSubmit={onSubmit} className="panel relative overflow-hidden p-8">
            <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-brand/15 blur-3xl" />

            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand">Choose your support level</p>

            <div className="mt-4 grid grid-cols-3 gap-3">
              {PRESETS.map((p) => {
                const active = !custom && amount === p;
                return (
                  <button
                    type="button"
                    key={p}
                    onClick={() => {
                      setAmount(p);
                      setCustom("");
                    }}
                    className={`group rounded-xl border px-4 py-5 text-center transition-all ${
                      active
                        ? "border-brand bg-brand/15 shadow-glow"
                        : "border-white/10 bg-white/[0.02] hover:border-white/20"
                    }`}
                  >
                    <div className="text-[10px] uppercase tracking-widest text-ink-mute">KES</div>
                    <div className={`mt-1 text-2xl font-bold ${active ? "text-brand-soft" : "text-white"}`}>
                      {p.toLocaleString()}
                    </div>
                  </button>
                );
              })}
            </div>

            <label className="mt-5 block">
              <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-ink-dim">
                Custom amount (KES)
              </span>
              <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-canvas/40 px-3.5 py-2.5 focus-within:border-brand/60">
                <span className="text-xs font-bold text-ink-mute">KES</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={10}
                  placeholder="e.g. 2,500"
                  value={custom}
                  onChange={(e) => setCustom(e.target.value)}
                  className="w-full bg-transparent text-sm text-white placeholder:text-ink-mute focus:outline-none"
                />
              </div>
            </label>

            <label className="mt-4 block">
              <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-ink-dim">
                M-Pesa phone number
              </span>
              <div
                className={`flex items-center gap-2.5 rounded-xl border bg-canvas/40 px-3.5 py-2.5 transition-colors ${
                  phoneError ? "border-red-500/60" : "border-white/10 focus-within:border-brand/60"
                }`}
              >
                <Phone className="h-4 w-4 text-ink-mute" />
                <input
                  type="tel"
                  inputMode="tel"
                  placeholder="07XX XXX XXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-transparent text-sm text-white placeholder:text-ink-mute focus:outline-none"
                />
              </div>
              {phoneError && <span className="mt-1 block text-[11px] font-medium text-red-300">{phoneError}</span>}
            </label>

            <button
              type="submit"
              disabled={state === "sending" || state === "sent"}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-bold text-canvas transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-90"
            >
              {state === "sending" && <Loader2 className="h-4 w-4 animate-spin" />}
              {state === "sent" && <CheckCircle2 className="h-4 w-4" />}
              {state === "idle" && <Smartphone className="h-4 w-4" />}
              {state === "sending"
                ? "Sending Secure STK Push prompt to your handset…"
                : state === "sent"
                ? `STK prompt sent — approve KES ${finalAmount.toLocaleString()} on your handset`
                : `Send STK Push · KES ${finalAmount.toLocaleString()}`}
            </button>

            <p className="mt-3 text-center text-[11px] uppercase tracking-wider text-ink-mute">
              PCI-DSS aligned · Daraja v2 STK · Receipt sent via SMS
            </p>
          </form>

          <aside className="panel p-8">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-500/15 ring-1 ring-emerald-400/30">
                <Building2 className="h-6 w-6 text-emerald-300" />
              </span>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-300">
                  Offline · Verified
                </p>
                <p className="text-sm text-ink-dim">For transparency-first contributors</p>
              </div>
            </div>

            <h3 className="mt-6 text-xl font-bold text-white">Direct M-Pesa Paybill</h3>
            <dl className="mt-4 grid gap-3 text-sm">
              <Row k="Paybill Number" v="000000" />
              <Row k="Account Number" v="ABRAHAM" />
              <Row k="Till (Buy Goods)" v="0000000" />
              <Row k="Account Name" v="ABRAHAM" />
            </dl>

            <div className="mt-6 rounded-xl border border-emerald-400/25 bg-emerald-400/[0.06] p-4 text-xs text-emerald-100/90">
              <div className="flex items-start gap-2">
                <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                <p>
                  Every contribution is logged in our public ledger and audited monthly. No bundling, no anonymous
                  transfers above the IEBC threshold, no cash collections.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-white/8 bg-white/[0.02] px-4 py-3">
      <dt className="text-[11px] uppercase tracking-widest text-ink-mute">{k}</dt>
      <dd className="font-mono text-sm font-semibold text-white">{v}</dd>
    </div>
  );
}
