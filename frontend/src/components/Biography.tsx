import { GraduationCap, Briefcase, Compass, Award, ShieldCheck, LineChart } from "lucide-react";

export default function Biography() {
  return (
    <section id="about" className="relative py-24">
      <div className="container-tight">
        <header className="mx-auto max-w-2xl text-center">
          <span className="section-eyebrow justify-center">
            <Compass className="h-3.5 w-3.5" /> The Long Road Home
          </span>
          <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
            From Pwani to Equity to <span className="brand-gradient-text">Magadi.</span>
          </h2>
          <p className="mt-3 text-ink-dim">
            Every assignment was preparation. Every promotion was training. The destination has always been home.
          </p>
        </header>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          <Chapter
            stepLabel="01 · Technical Foundation"
            icon={<GraduationCap className="h-5 w-5" />}
            title="Trained where the bar is highest."
            accent="text-sky-300"
            ringClass="ring-sky-400/30 bg-sky-500/15"
          >
            <p>
              Pursued a Bachelor's in Computer Science at <strong className="text-white">Pwani University</strong>,
              specialising in Full-Stack Engineering, Network Security, and AI System Architectures. Kilifi was not
              a detour — it was a deliberate, multi-year deep dive into the disciplines a modern county leader
              cannot afford to outsource.
            </p>
            <Tags items={["Full-Stack Eng.", "Network Security", "AI Systems"]} />
          </Chapter>

          <Chapter
            stepLabel="02 · Financial Excellence"
            icon={<Briefcase className="h-5 w-5" />}
            title="Five years inside the engine room of Kenyan FinTech."
            accent="text-brand-soft"
            ringClass="ring-brand/30 bg-brand/15"
          >
            <p>
              5+ years at <strong className="text-white">Equity Bank Kenya</strong>, recognised as the
              <span className="font-semibold text-brand"> Best Equitel Onboarding Officer across the entire Coastal Region</span>.
              Processed 1,000+ monthly customer activations and managed 600+ high-volume daily transactions —
              with zero reconciliation breaches across a five-year window.
            </p>
            <Tags items={["KYC at scale", "Equitel MNO", "Risk Ops"]} />
            <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-brand/15 px-3 py-2 text-xs font-semibold text-brand-soft ring-1 ring-brand/30">
              <Award className="h-3.5 w-3.5" /> Regional Awardee · Coast Region
            </div>
          </Chapter>

          <Chapter
            stepLabel="03 · Leadership Alignment"
            icon={<ShieldCheck className="h-5 w-5" />}
            title="Bringing the corporate playbook back to Magadi."
            accent="text-emerald-300"
            ringClass="ring-emerald-400/30 bg-emerald-500/15"
          >
            <p>
              "I am bringing this elite fintech and data management experience back home. Magadi Ward does not need
              more empty political rhetoric; it deserves a technologically skilled leader who knows how to audit
              <strong className="text-white"> multi-billion corporate land rates</strong>, protect
              <strong className="text-white"> carbon credit allocations</strong>, and cleanly distribute
              <strong className="text-white"> county bursary funds</strong>."
            </p>
            <Tags items={["Land Rates Audit", "Carbon Credits", "Bursary Disbursement"]} />
            <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-200 ring-1 ring-emerald-400/30">
              <LineChart className="h-3.5 w-3.5" /> Outcomes-first, paper-free governance
            </div>
          </Chapter>
        </div>
      </div>
    </section>
  );
}

function Chapter({
  stepLabel,
  icon,
  title,
  children,
  accent,
  ringClass,
}: {
  stepLabel: string;
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  accent: string;
  ringClass: string;
}) {
  return (
    <article className="panel relative overflow-hidden p-7">
      <div className="flex items-center gap-3">
        <span className={`grid h-10 w-10 place-items-center rounded-xl ring-1 ${ringClass} ${accent}`}>
          {icon}
        </span>
        <p className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${accent}`}>{stepLabel}</p>
      </div>
      <h3 className="mt-5 text-xl font-bold leading-snug text-white text-balance">{title}</h3>
      <div className="mt-3 space-y-3 text-[14.5px] leading-relaxed text-ink-dim">{children}</div>
    </article>
  );
}

function Tags({ items }: { items: string[] }) {
  return (
    <div className="mt-4 flex flex-wrap gap-1.5">
      {items.map((t) => (
        <span
          key={t}
          className="rounded-md border border-white/10 bg-white/[0.02] px-2 py-1 text-[11px] font-medium text-ink"
        >
          {t}
        </span>
      ))}
    </div>
  );
}
