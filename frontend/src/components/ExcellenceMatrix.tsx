"use client";

import { useState } from "react";
import {
  Code2,
  Cpu,
  Building2,
  Sparkles,
  GraduationCap,
  ShieldCheck,
  Globe2,
  HandCoins,
  Users,
  ArrowUpRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Tab = "tech" | "manifesto";

type TechProject = {
  title: string;
  stack: string[];
  description: string;
  Icon: LucideIcon;
};

type Pillar = {
  title: string;
  body: string;
  bullets: string[];
  Icon: LucideIcon;
};

const TECH_PROJECTS: TechProject[] = [
  {
    title: "Househelp Smart Management System",
    stack: ["React", "Node.js", "PostgreSQL", "Twilio"],
    description:
      "Vetted-worker marketplace with biometric KYC, employer-side performance ledger, and SMS-based attendance — built to formalise Kenya's largest informal workforce.",
    Icon: Users,
  },
  {
    title: "AI-Based Smart Study Assistant",
    stack: ["Python", "FastAPI", "LangChain", "Vector DB"],
    description:
      "Curriculum-aware tutor that ingests KCSE past papers and generates spaced-repetition revision plans tailored to a learner's weak topics, in English and Kiswahili.",
    Icon: Cpu,
  },
  {
    title: "University Registration & Enrollment Portal",
    stack: ["Next.js", "Prisma", "M-Pesa Daraja", "Role-Based Access"],
    description:
      "End-to-end student onboarding system with fee STK push, programme switching workflow, and finance / registrar dashboards — designed for sub-3-second latency on 3G.",
    Icon: GraduationCap,
  },
];

const PILLARS: Pillar[] = [
  {
    title: "Corporate Asset & Resource Oversight",
    Icon: ShieldCheck,
    body:
      "Open the books on Magadi's mining concessions, land rates and conservancy revenue. Every shilling earned from Magadi's soil should be traceable to a public ledger.",
    bullets: [
      "Public quarterly rate audits",
      "Open contract register for mining & carbon deals",
      "Community royalty trust with on-chain attestation",
    ],
  },
  {
    title: "Digital Economy Hubs",
    Icon: Globe2,
    body:
      "Solar-powered digital hubs in Shompole, Olkiramatian and Entasopia. KRA services, M-Pesa float, free study Wi-Fi, and a co-working bench for online-gig youth.",
    bullets: [
      "3 community-owned hubs in 18 months",
      "Free KCSE revision Wi-Fi zones",
      "Online-work onboarding cohorts",
    ],
  },
  {
    title: "Affirmative Action Optimisation",
    Icon: HandCoins,
    body:
      "NGAAF, Women & Youth funds re-engineered: identity-bound disbursement, public beneficiary lists, and a 30-day grievance window before any new round is approved.",
    bullets: [
      "Zero ghost beneficiaries",
      "Public beneficiary dashboard",
      "Mandatory 30% disability inclusion",
    ],
  },
];

export default function ExcellenceMatrix() {
  const [tab, setTab] = useState<Tab>("tech");

  return (
    <section id="agenda" className="relative py-24">
      <div className="container-tight">
        <header className="mx-auto max-w-2xl text-center">
          <span className="section-eyebrow justify-center">
            <Sparkles className="h-3.5 w-3.5" /> The Excellence Matrix
          </span>
          <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
            Two portfolios. <span className="brand-gradient-text">One discipline.</span>
          </h2>
          <p className="mt-3 text-ink-dim">
            Toggle between the systems I've shipped as an engineer and the systems I will ship as your MCA.
          </p>
        </header>

        <div className="mt-10 flex justify-center">
          <div className="glass inline-flex rounded-2xl p-1.5">
            <TabBtn active={tab === "tech"} onClick={() => setTab("tech")} icon={<Code2 className="h-4 w-4" />}>
              Software & AI Innovation
            </TabBtn>
            <TabBtn
              active={tab === "manifesto"}
              onClick={() => setTab("manifesto")}
              icon={<Building2 className="h-4 w-4" />}
            >
              Magadi Ward Blueprint
            </TabBtn>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {tab === "tech"
            ? TECH_PROJECTS.map((p) => <TechCard key={p.title} project={p} />)
            : PILLARS.map((p) => <PillarCard key={p.title} pillar={p} />)}
        </div>
      </div>
    </section>
  );
}

function TabBtn({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
        active
          ? "bg-brand text-canvas shadow-glow"
          : "text-ink hover:bg-white/5"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

function TechCard({ project }: { project: TechProject }) {
  const { title, stack, description, Icon } = project;
  return (
    <article className="panel group flex flex-col p-6 transition-transform hover:-translate-y-1 hover:shadow-glow">
      <div className="flex items-center justify-between">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-sky-500/15 text-sky-300 ring-1 ring-sky-400/30">
          <Icon className="h-5 w-5" />
        </span>
        <ArrowUpRight className="h-4 w-4 text-ink-mute transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </div>
      <h3 className="mt-5 text-lg font-bold text-white text-balance">{title}</h3>
      <p className="mt-3 flex-1 text-sm text-ink-dim">{description}</p>
      <div className="mt-5 flex flex-wrap gap-1.5">
        {stack.map((s) => (
          <span
            key={s}
            className="rounded-md border border-white/10 bg-white/[0.02] px-2 py-1 text-[11px] font-medium text-ink"
          >
            {s}
          </span>
        ))}
      </div>
    </article>
  );
}

function PillarCard({ pillar }: { pillar: Pillar }) {
  const { title, body, bullets, Icon } = pillar;
  return (
    <article className="panel relative flex flex-col overflow-hidden p-6 transition-transform hover:-translate-y-1 hover:shadow-glow">
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand/15 blur-3xl" />
      <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand/15 text-brand ring-1 ring-brand/30">
        <Icon className="h-5 w-5" />
      </span>
      <h3 className="mt-5 text-lg font-bold text-white text-balance">{title}</h3>
      <p className="mt-3 text-sm text-ink-dim">{body}</p>
      <ul className="mt-5 grid gap-2">
        {bullets.map((b) => (
          <li key={b} className="flex items-start gap-2 text-[13px] text-ink">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
            {b}
          </li>
        ))}
      </ul>
    </article>
  );
}
