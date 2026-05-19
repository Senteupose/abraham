"use client";

import { useEffect, useState } from "react";
import { Menu, X, ShieldCheck } from "lucide-react";

const LINKS = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#agenda", label: "Agenda" },
  { href: "#supporter-hub", label: "Supporter Hub" },
  { href: "#verify-voter", label: "Verify Voter" },
  { href: "#blog", label: "Blog" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
      <nav
        className={`glass w-full max-w-6xl rounded-2xl px-4 py-3 transition-shadow duration-300 ${
          scrolled ? "shadow-panel" : ""
        }`}
        aria-label="Primary"
      >
        <div className="flex items-center justify-between gap-4">
          <a href="#home" className="group flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand/10 text-brand ring-1 ring-brand/30">
              <ShieldCheck className="h-5 w-5" strokeWidth={2.25} />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-sm font-semibold tracking-wide text-white">Abraham Pose Senteu</span>
              <span className="text-[10px] uppercase tracking-[0.22em] text-ink-dim">Magadi Ward · MCA 2027</span>
            </span>
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="rounded-md px-3 py-2 text-sm text-ink/90 transition-colors hover:bg-white/5 hover:text-white"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href="#supporter-hub"
              className="hidden rounded-lg bg-brand px-4 py-2 text-xs font-semibold uppercase tracking-wider text-canvas transition-transform hover:-translate-y-0.5 sm:inline-flex"
            >
              Join the Movement
            </a>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 text-ink lg:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open && (
          <ul className="mt-3 grid grid-cols-2 gap-1 border-t border-white/10 pt-3 lg:hidden">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-2.5 text-sm text-ink hover:bg-white/5"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </nav>
    </header>
  );
}
