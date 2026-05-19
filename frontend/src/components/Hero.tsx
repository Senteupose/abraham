import { ArrowRight, Code2, Sparkles, MapPin, Users } from "lucide-react";
import { useTypingEffect } from "../hooks/useTypingEffect";

export default function Hero() {
  const typed = useTypingEffect(
    "FinTech Engineer, Tech Professional, and MCA Aspirant for Magadi Ward.",
    45,
    600,
  );

  return (
    <section id="home" className="relative pt-32 lg:pt-36">
      <div className="container-tight">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <div className="relative order-2 lg:order-1">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-edge to-canvas shadow-panel">
              <div className="aspect-[4/5] w-full">
                <img
                  src="/hero-magadi.jpg"
                  alt="Abraham Pose Senteu consulting with Magadi Ward elders and the Ilmeguaraa age-set"
                  className="h-full w-full object-cover"
                  loading="eager"
                  decoding="async"
                  onError={(e) => {
                    const t = e.currentTarget;
                    t.style.display = "none";
                    const parent = t.parentElement;
                    if (parent) parent.dataset.fallback = "true";
                  }}
                />
                <div
                  className="absolute inset-0 grid place-items-center bg-[radial-gradient(120%_80%_at_30%_20%,rgba(245,158,11,0.25)_0%,transparent_55%),linear-gradient(180deg,#1E293B_0%,#0F172A_100%)] data-[fallback=true]:flex"
                  data-fallback-target
                >
                  <div className="flex flex-col items-center gap-3 text-center px-6">
                    <div className="grid h-16 w-16 place-items-center rounded-full bg-brand/15 ring-1 ring-brand/40">
                      <Users className="h-7 w-7 text-brand" />
                    </div>
                    <p className="text-sm font-medium text-ink">
                      Add <code className="rounded bg-white/5 px-1.5 py-0.5 text-brand">/public/hero-magadi.jpg</code>
                    </p>
                    <p className="max-w-xs text-xs text-ink-dim">
                      Photo of Abraham consulting with Magadi village elders and the Ilmeguaraa age-set.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-canvas via-canvas/70 to-transparent" />

              <div className="absolute bottom-5 left-5 right-5 flex flex-wrap items-center justify-between gap-3">
                <span className="flex items-center gap-2 rounded-full border border-white/10 bg-canvas/70 px-3 py-1.5 text-xs font-medium text-ink backdrop-blur">
                  <MapPin className="h-3.5 w-3.5 text-brand" /> Magadi Ward · Kajiado County
                </span>
                <span className="flex items-center gap-2 rounded-full border border-brand/30 bg-brand/15 px-3 py-1.5 text-xs font-semibold text-brand-soft">
                  <Sparkles className="h-3.5 w-3.5" /> Ilmeguaraa Age-Set
                </span>
              </div>
            </div>

            <div className="pointer-events-none absolute -inset-2 -z-10 rounded-3xl bg-gradient-to-br from-brand/20 via-transparent to-transparent blur-2xl" />
          </div>

          <div className="order-1 lg:order-2">
            <span className="section-eyebrow">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" /> Magadi Ward MCA · 2027 General Election
            </span>

            <h1 className="mt-4 text-4xl font-extrabold leading-[1.05] tracking-tight text-balance text-white sm:text-5xl lg:text-6xl">
              Abraham <span className="brand-gradient-text">Pose Senteu</span>
            </h1>

            <p className="mt-5 min-h-[3.25rem] text-lg font-medium text-ink/90 sm:text-xl">
              {typed}
              <span className="ml-0.5 inline-block h-5 w-0.5 -translate-y-0.5 bg-brand align-middle animate-blink" aria-hidden />
            </p>

            <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-ink-dim">
              Deploying high-level data science, corporate financial accountability, and advanced technological
              frameworks to secure, digitize, and transform the economy of Magadi Ward from the grassroots up.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#supporter-hub"
                className="group inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-canvas transition-transform hover:-translate-y-0.5 animate-pulse-brand"
              >
                Register as a Supporter
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a
                href="#agenda"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.02] px-5 py-3 text-sm font-semibold text-ink hover:bg-white/5"
              >
                <Code2 className="h-4 w-4 text-brand" /> Explore Technical Projects
              </a>
            </div>

            <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
              <Stat label="Years at Equity Bank" value="5+" />
              <Stat label="Monthly Activations" value="1,000+" />
              <Stat label="Daily Transactions" value="600+" />
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-widest text-ink-mute">{label}</dt>
      <dd className="mt-1 text-2xl font-bold text-white">{value}</dd>
    </div>
  );
}
