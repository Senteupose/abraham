import { ExternalLink, Download, Vote, ShieldCheck, FileText } from "lucide-react";

export default function VoterPortal() {
  return (
    <section id="verify-voter" className="relative py-24">
      <div className="container-tight">
        <header className="mx-auto max-w-2xl text-center">
          <span className="section-eyebrow justify-center">
            <Vote className="h-3.5 w-3.5" /> Civic Action · IEBC Integration
          </span>
          <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
            Verify Your Vote: <span className="brand-gradient-text">Secure Your Voice in Magadi</span>
          </h2>
          <p className="mt-3 text-ink-dim">
            Don't take rumours for an answer. Confirm your polling station, transfer your registration to
            Magadi Ward, and lock in your right to choose.
          </p>
        </header>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <article className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#0B3D2E] via-[#0F3D2E] to-canvas p-8 shadow-panel">
            <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-emerald-500/15 blur-3xl" />
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-500/15 ring-1 ring-emerald-400/30">
                <ShieldCheck className="h-6 w-6 text-emerald-300" />
              </span>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-300">
                  Official IEBC Lookup
                </p>
                <p className="text-sm text-ink-dim">Independent Electoral and Boundaries Commission · Kenya</p>
              </div>
            </div>

            <h3 className="mt-6 text-2xl font-bold text-white">Is your name on the register?</h3>
            <p className="mt-2 text-sm text-ink-dim">
              The official IEBC voter status portal will confirm your registration details, your assigned polling
              centre and your constituency. Have your National ID number ready.
            </p>

            <a
              href="https://iebc.or.ke"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex w-full items-center justify-between gap-3 rounded-xl bg-emerald-500 px-5 py-4 text-sm font-bold text-emerald-950 transition-transform hover:-translate-y-0.5"
            >
              <span className="inline-flex items-center gap-2">
                <Vote className="h-4 w-4" />
                Verify Your IEBC Registration Status Now
              </span>
              <ExternalLink className="h-4 w-4" />
            </a>

            <ul className="mt-6 grid gap-2 text-xs text-emerald-100/80">
              <li>• Hosted on the official iebc.or.ke domain — opens in a new tab.</li>
              <li>• We never see or store your ID. The check happens directly with IEBC.</li>
              <li>• Latest register reflected within the published IEBC update cycle.</li>
            </ul>
          </article>

          <article className="panel relative overflow-hidden p-8">
            <div className="pointer-events-none absolute -right-10 -bottom-10 h-44 w-44 rounded-full bg-brand/15 blur-3xl" />
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand/15 ring-1 ring-brand/30">
                <FileText className="h-6 w-6 text-brand" />
              </span>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand">
                  Transfer to Magadi Ward
                </p>
                <p className="text-sm text-ink-dim">IEBC Form C · Voter Transfer Application</p>
              </div>
            </div>

            <h3 className="mt-6 text-2xl font-bold text-white">Move your vote home to Magadi.</h3>
            <p className="mt-2 text-sm text-ink-dim">
              Registered in Kilifi, Nairobi or another constituency? Download IEBC Form C, fill it in, and submit
              at the nearest IEBC office. Our volunteers can help you complete it — just bring your ID.
            </p>

            <a
              href="/forms/IEBC-Form-C-Voter-Transfer.pdf"
              download
              className="mt-6 inline-flex w-full items-center justify-between gap-3 rounded-xl border border-brand/40 bg-brand/15 px-5 py-4 text-sm font-bold text-brand-soft transition-transform hover:-translate-y-0.5"
            >
              <span className="inline-flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download IEBC Voter Transfer Form C (PDF)
              </span>
              <span className="rounded-md bg-brand/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                PDF
              </span>
            </a>

            <ol className="mt-6 grid gap-2 text-xs text-ink/80">
              <li>
                <span className="font-semibold text-brand">1.</span> Print Form C and complete sections A & B.
              </li>
              <li>
                <span className="font-semibold text-brand">2.</span> Carry your original National ID to the IEBC
                Magadi constituency office.
              </li>
              <li>
                <span className="font-semibold text-brand">3.</span> Confirm your new polling centre and re-verify
                on iebc.or.ke after 72 hours.
              </li>
            </ol>
          </article>
        </div>
      </div>
    </section>
  );
}
