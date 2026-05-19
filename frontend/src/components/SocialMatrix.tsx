"use client";

import { Facebook, MessageCircle, Github, Linkedin, Youtube, Music2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Channel = {
  name: string;
  href: string;
  Icon: LucideIcon;
  hover: string;
};

const CHANNELS: Channel[] = [
  {
    name: "Facebook",
    href: "https://facebook.com/AbrahamPoseSenteu",
    Icon: Facebook,
    hover: "hover:text-[#1877F2]",
  },
  {
    name: "WhatsApp Community",
    href: "https://wa.me/254700000000",
    Icon: MessageCircle,
    hover: "hover:text-[#25D366]",
  },
  {
    name: "GitHub",
    href: "https://github.com/senteujoshua",
    Icon: Github,
    hover: "hover:text-white",
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/abraham-senteu",
    Icon: Linkedin,
    hover: "hover:text-[#0A66C2]",
  },
  {
    name: "YouTube",
    href: "https://youtube.com/@abrahamposesenteu",
    Icon: Youtube,
    hover: "hover:text-[#FF0000]",
  },
  {
    name: "TikTok",
    href: "https://tiktok.com/@abrahamposesenteu",
    Icon: Music2,
    hover: "hover:text-[#00F2EA]",
  },
];

export default function SocialMatrix() {
  return (
    <aside
      aria-label="Social channels"
      className="pointer-events-none fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 lg:block"
    >
      <ul className="glass pointer-events-auto flex flex-col gap-1 rounded-2xl p-2 shadow-panel">
        {CHANNELS.map(({ name, href, Icon, hover }) => (
          <li key={name}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              title={name}
              className={`group relative grid h-10 w-10 place-items-center rounded-xl text-ink-dim transition-all ${hover} hover:bg-white/5`}
            >
              <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
              <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-md bg-canvas px-2.5 py-1 text-[11px] font-medium text-ink shadow-lg ring-1 ring-white/10 group-hover:block">
                {name}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
