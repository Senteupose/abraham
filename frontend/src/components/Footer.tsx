import {
  MapPin,
  Mail,
  Phone,
  Facebook,
  MessageCircle,
  Github,
  Linkedin,
  Youtube,
  Music2,
  ShieldCheck,
  Quote,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Channel = { name: string; href: string; Icon: LucideIcon };

const CHANNELS: Channel[] = [
  { name: "Facebook", href: "https://facebook.com/AbrahamPoseSenteu", Icon: Facebook },
  { name: "WhatsApp", href: "https://wa.me/254700000000", Icon: MessageCircle },
  { name: "GitHub", href: "https://github.com/senteujoshua", Icon: Github },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/abraham-senteu", Icon: Linkedin },
  { name: "YouTube", href: "https://youtube.com/@abrahamposesenteu", Icon: Youtube },
  { name: "TikTok", href: "https://tiktok.com/@abrahamposesenteu", Icon: Music2 },
];

const REFERENCES = [
  {
    name: "Mr. Isaac Maina Mwangi",
    role: "Regional Manager",
    org: "Equity Bank Kenya",
    blurb:
      "“Abraham is one of the most disciplined operations professionals to come through the Coast region — a rare combination of technical fluency and customer-first instinct.”",
  },
  {
    name: "Dr. Msagha J. Mbogholi, PhD",
    role: "Chair of Department, Mathematics & Computer Science",
    org: "Pwani University",
    blurb:
      "“A standout student whose work bridged rigorous computer science with practical, locally-grounded systems. He builds for the people he comes from.”",
  },
];

export default function Footer() {
  return (
    <footer id="contact" className="relative border-t border-white/5 pt-24">
      <div className="container-tight">
        <header className="mx-auto max-w-2xl text-center">
          <span className="section-eyebrow justify-center">
            <ShieldCheck className="h-3.5 w-3.5" /> Executive References · Trust Proofs
          </span>
          <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
            Vouched for by <span className="brand-gradient-text">the institutions that trained me.</span>
          </h2>
        </header>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {REFERENCES.map((r) => (
            <article key={r.name} className="panel relative overflow-hidden p-7">
              <Quote className="absolute right-5 top-5 h-8 w-8 text-brand/20" />
              <p className="text-[15px] leading-relaxed text-ink/90">{r.blurb}</p>
              <div className="hairline my-5" />
              <div>
                <p className="font-semibold text-white">{r.name}</p>
                <p className="text-sm text-ink-dim">{r.role}</p>
                <p className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-brand-soft">{r.org}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-20 grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="text-lg font-bold text-white">Abraham Pose Senteu</p>
            <p className="mt-1 text-sm text-ink-dim">
              FinTech Engineer · AI Developer · MCA Aspirant, Magadi Ward
            </p>

            <div className="mt-5 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
              <MapPin className="h-4 w-4 text-brand" />
              <p className="text-sm font-semibold text-white">
                Magadi Ward, Kajiado County <span className="text-ink-mute">/</span> Nairobi, Kenya
              </p>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              {CHANNELS.map(({ name, href, Icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={name}
                  className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.02] text-ink-dim hover:bg-white/5 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand">Get in touch</p>
            <ul className="mt-4 space-y-3 text-sm text-ink">
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-ink-mute" />
                <a className="hover:text-white" href="mailto:senteujoshua@gmail.com">
                  senteujoshua@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-ink-mute" />
                <a className="hover:text-white" href="tel:+254700000000">
                  +254 700 000 000
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MessageCircle className="h-4 w-4 text-ink-mute" />
                <a
                  className="hover:text-white"
                  href="https://wa.me/254700000000"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp Community
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand">Navigate</p>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-ink">
              <li><a href="#home" className="hover:text-white">Home</a></li>
              <li><a href="#about" className="hover:text-white">About</a></li>
              <li><a href="#agenda" className="hover:text-white">Agenda</a></li>
              <li><a href="#supporter-hub" className="hover:text-white">Supporter Hub</a></li>
              <li><a href="#verify-voter" className="hover:text-white">Verify Voter</a></li>
              <li><a href="#fuel-the-vision" className="hover:text-white">Donate</a></li>
              <li><a href="#blog" className="hover:text-white">Blog</a></li>
              <li><a href="#vlog" className="hover:text-white">Vlog</a></li>
            </ul>
          </div>
        </div>

        <div className="hairline mt-16" />

        <div className="flex flex-col items-start justify-between gap-3 py-6 text-xs text-ink-mute sm:flex-row sm:items-center">
          <p>© 2026 Abraham Pose Senteu. Built securely with React & Tailwind CSS. All Rights Reserved.</p>
          <p className="inline-flex items-center gap-2">
            <ShieldCheck className="h-3.5 w-3.5 text-brand" />
            Compliant with the Kenyan Data Protection Act (2019) · Election Offences Act (2016)
          </p>
        </div>
      </div>
    </footer>
  );
}
