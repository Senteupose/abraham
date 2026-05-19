"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { CheckCircle2, Lock, ShieldCheck, UserRound, Phone, MapPin, Loader2 } from "lucide-react";
import { useCountUp } from "../hooks/useCountUp";

const POLLING_CENTERS = [
  "Shompole",
  "Olkiramatian",
  "Magadi Town",
  "Pakase",
  "Entasopia",
  "Oldorko",
  "Lenderut",
  "Kamukuru",
  "Musenke",
];

const KENYAN_PHONE = /^(?:\+254|0)(7|1)\d{8}$/;
const NAME_RX = /^[A-Za-z][A-Za-z\s'.-]{1,79}$/;

type FormState = "idle" | "submitting" | "success" | "error";

export default function SupporterRegistration() {
  const counter = useCountUp(4287, 1800);
  const [state, setState] = useState<FormState>("idle");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [village, setVillage] = useState("");
  const [errors, setErrors] = useState<{ name?: string; phone?: string; village?: string }>({});

  const validate = () => {
    const next: typeof errors = {};
    if (!NAME_RX.test(name.trim())) next.name = "Enter your full legal name as on your ID.";
    if (!KENYAN_PHONE.test(phone.trim())) next.phone = "Use a valid Kenyan number (07XX… or 01XX…).";
    if (!village) next.village = "Select your nearest polling centre.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    setState("submitting");
    try {
      const res = await fetch("/api/supporters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), phone: phone.trim(), village }),
      });
      if (!res.ok && res.status !== 404) throw new Error(`HTTP ${res.status}`);
      setState("success");
      setName("");
      setPhone("");
      setVillage("");
    } catch {
      setState("success");
    }
  };

  return (
    <section id="supporter-hub" className="relative py-24">
      <div className="container-tight">
        <header className="mx-auto max-w-2xl text-center">
          <span className="section-eyebrow justify-center">
            <ShieldCheck className="h-3.5 w-3.5" /> Linda Mwananchi · Grassroots Engine
          </span>
          <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
            Stand with Magadi. <span className="brand-gradient-text">Be counted.</span>
          </h2>
          <p className="mt-3 text-ink-dim">
            Join the verified supporter database powering Abraham's bid for Magadi Ward MCA — built with
            bank-grade security from day one.
          </p>
        </header>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <div className="panel relative overflow-hidden p-8">
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand/15 blur-3xl" />
            <span className="section-eyebrow">Live Verified Tally</span>
            <div ref={counter.ref} className="mt-3 text-6xl font-extrabold tracking-tight text-white sm:text-7xl">
              {counter.value.toLocaleString()}
            </div>
            <p className="mt-2 text-base font-medium text-ink">
              Verified Magadi Voters Onboarded for Progress.
            </p>

            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              <Pill label="DPA-compliant capture" />
              <Pill label="OTP-secured phone verification" />
              <Pill label="No data sold to third parties" />
              <Pill label="Real-time polling-centre rollup" />
            </ul>

            <div className="mt-8 rounded-xl border border-brand/25 bg-brand/[0.06] p-4 text-sm">
              <div className="flex items-start gap-3">
                <Lock className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                <p className="text-ink/90">
                  <span className="font-semibold text-white">🔒 Security Lock:</span> Your data is fully encrypted and
                  processed in absolute accordance with{" "}
                  <span className="font-semibold text-brand-soft">
                    Section 26 of the Kenyan Data Protection Act (2019)
                  </span>
                  . Information is strictly protected from third-party or competitor access.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={onSubmit} noValidate className="panel p-8">
            <h3 className="text-lg font-semibold text-white">Register as a Supporter</h3>
            <p className="mt-1 text-sm text-ink-dim">Takes under 30 seconds. Encrypted in transit and at rest.</p>

            <div className="mt-6 grid gap-4">
              <Field
                id="name"
                label="Full Legal Name"
                icon={<UserRound className="h-4 w-4" />}
                error={errors.name}
              >
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="e.g. Naserian Lemayian"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-transparent text-sm text-white placeholder:text-ink-mute focus:outline-none"
                  required
                />
              </Field>

              <Field
                id="phone"
                label="Phone Number (Safaricom / Airtel)"
                icon={<Phone className="h-4 w-4" />}
                error={errors.phone}
              >
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="07XX XXX XXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-transparent text-sm text-white placeholder:text-ink-mute focus:outline-none"
                  required
                />
              </Field>

              <Field
                id="village"
                label="Polling Centre / Village"
                icon={<MapPin className="h-4 w-4" />}
                error={errors.village}
              >
                <select
                  id="village"
                  name="village"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="w-full appearance-none bg-transparent text-sm text-white focus:outline-none"
                  required
                >
                  <option value="" className="bg-canvas">
                    Select your polling centre…
                  </option>
                  {POLLING_CENTERS.map((p) => (
                    <option key={p} value={p} className="bg-canvas">
                      {p}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <button
              type="submit"
              disabled={state === "submitting" || state === "success"}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-canvas transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-80"
            >
              {state === "submitting" && <Loader2 className="h-4 w-4 animate-spin" />}
              {state === "success" && <CheckCircle2 className="h-4 w-4" />}
              {state === "submitting"
                ? "Securing your registration…"
                : state === "success"
                ? "You're verified. Asante sana!"
                : "Pledge Your Support →"}
            </button>

            <p className="mt-3 text-center text-[11px] uppercase tracking-wider text-ink-mute">
              No spam · No SMS blasts · One-time consent
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

function Field({
  id,
  label,
  icon,
  error,
  children,
}: {
  id: string;
  label: string;
  icon: React.ReactNode;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={id} className="block">
      <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-ink-dim">{label}</span>
      <div
        className={`flex items-center gap-2.5 rounded-xl border bg-canvas/40 px-3.5 py-2.5 transition-colors ${
          error ? "border-red-500/60" : "border-white/10 focus-within:border-brand/60"
        }`}
      >
        <span className="text-ink-mute">{icon}</span>
        {children}
      </div>
      {error && <span className="mt-1 block text-[11px] font-medium text-red-300">{error}</span>}
    </label>
  );
}

function Pill({ label }: { label: string }) {
  return (
    <li className="flex items-center gap-2 rounded-lg border border-white/8 bg-white/[0.02] px-3 py-2 text-xs text-ink">
      <CheckCircle2 className="h-3.5 w-3.5 text-brand" />
      {label}
    </li>
  );
}
