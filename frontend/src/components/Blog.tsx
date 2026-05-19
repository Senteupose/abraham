"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  Clock,
  Tag,
  ArrowRight,
  ArrowLeft,
  Share2,
  Facebook,
  MessageCircle,
  Linkedin,
  Twitter,
} from "lucide-react";
import { BLOG_POSTS, type BlogPost } from "../data/blogPosts";

const CATEGORY_STYLES: Record<string, string> = {
  Tech: "bg-sky-500/15 text-sky-300 ring-sky-400/30",
  "Campaign Update": "bg-brand/15 text-brand-soft ring-brand/30",
  Oversight: "bg-emerald-500/15 text-emerald-300 ring-emerald-400/30",
  Strategy: "bg-fuchsia-500/15 text-fuchsia-300 ring-fuchsia-400/30",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function Blog() {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  const sorted = useMemo(
    () => [...BLOG_POSTS].sort((a, b) => (a.date < b.date ? 1 : -1)),
    [],
  );

  const active = activeSlug ? sorted.find((p) => p.slug === activeSlug) ?? null : null;

  useEffect(() => {
    if (active) window.scrollTo({ top: document.getElementById("blog")?.offsetTop ?? 0, behavior: "smooth" });
  }, [active]);

  return (
    <section id="blog" className="relative py-24">
      <div className="container-tight">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="section-eyebrow">
              <Tag className="h-3.5 w-3.5" /> The Magadi Ledger · Notes from the Field
            </span>
            <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
              Strategy notes, <span className="brand-gradient-text">policy pieces, and morning updates</span>
            </h2>
          </div>
          {active && (
            <button
              onClick={() => setActiveSlug(null)}
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-xs font-medium text-ink hover:bg-white/5"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to all articles
            </button>
          )}
        </header>

        {!active && (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((post) => (
              <ArticleCard key={post.slug} post={post} onOpen={() => setActiveSlug(post.slug)} />
            ))}
          </div>
        )}

        {active && <ArticleView post={active} />}
      </div>
    </section>
  );
}

function ArticleCard({ post, onOpen }: { post: BlogPost; onOpen: () => void }) {
  const style = CATEGORY_STYLES[post.category] ?? "bg-white/5 text-ink ring-white/10";
  return (
    <article className="panel group flex flex-col p-6 transition-transform hover:-translate-y-1 hover:shadow-glow">
      <div className="flex items-center justify-between text-[11px] text-ink-mute">
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-semibold ring-1 ${style}`}>
          {post.category}
        </span>
        <span className="inline-flex items-center gap-3">
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3 w-3" /> {formatDate(post.date)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" /> {post.readMinutes} min
          </span>
        </span>
      </div>

      <h3 className="mt-4 text-lg font-bold leading-snug text-white text-balance group-hover:text-brand-soft">
        {post.title}
      </h3>
      <p className="mt-3 flex-1 text-sm text-ink-dim">{post.excerpt}</p>

      <button
        onClick={onOpen}
        className="mt-5 inline-flex items-center gap-1.5 self-start text-sm font-semibold text-brand"
      >
        Read Full Article <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </button>
    </article>
  );
}

function ArticleView({ post }: { post: BlogPost }) {
  const postUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/blog/${post.slug}`
      : `https://abrahamposesenteu.ke/blog/${post.slug}`;
  const title = encodeURIComponent(post.title);
  const url = encodeURIComponent(postUrl);

  const SHARE = [
    {
      name: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      Icon: Facebook,
      color: "hover:bg-[#1877F2]/15 hover:text-[#1877F2] hover:ring-[#1877F2]/40",
    },
    {
      name: "WhatsApp",
      href: `https://api.whatsapp.com/send?text=${title}%20${url}`,
      Icon: MessageCircle,
      color: "hover:bg-[#25D366]/15 hover:text-[#25D366] hover:ring-[#25D366]/40",
    },
    {
      name: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      Icon: Linkedin,
      color: "hover:bg-[#0A66C2]/15 hover:text-[#0A66C2] hover:ring-[#0A66C2]/40",
    },
    {
      name: "X / Twitter",
      href: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
      Icon: Twitter,
      color: "hover:bg-white/15 hover:text-white hover:ring-white/40",
    },
  ];

  const onNativeShare = async () => {
    if (typeof navigator === "undefined") return;
    const nav = navigator as Navigator & { share?: (data: ShareData) => Promise<void> };
    if (typeof nav.share === "function") {
      try {
        await nav.share({ title: post.title, text: post.excerpt, url: postUrl });
        return;
      } catch {
        /* user cancelled */
      }
    }
    if (nav.clipboard?.writeText) {
      await nav.clipboard.writeText(postUrl);
    }
  };

  const style = CATEGORY_STYLES[post.category] ?? "bg-white/5 text-ink ring-white/10";

  return (
    <article className="panel mt-8 p-8 sm:p-10">
      <div className="flex items-center gap-3 text-[11px] text-ink-mute">
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-semibold ring-1 ${style}`}>
          {post.category}
        </span>
        <span className="inline-flex items-center gap-1">
          <Calendar className="h-3 w-3" /> {formatDate(post.date)}
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3 w-3" /> {post.readMinutes} min read
        </span>
      </div>

      <h3 className="mt-4 text-3xl font-extrabold leading-tight text-white text-balance sm:text-4xl">
        {post.title}
      </h3>
      <p className="mt-4 text-base text-ink-dim">{post.excerpt}</p>

      <div className="hairline my-8" />

      <div className="prose prose-invert max-w-none text-[15px] leading-relaxed text-ink/90">
        {post.body.split("\n\n").map((para, i) => (
          <p key={i} className="mb-4">
            {para}
          </p>
        ))}
      </div>

      <div className="hairline my-8" />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand">
          <Share2 className="mr-1.5 inline h-3.5 w-3.5" /> Cross-Post to Social Media
        </p>
        <div className="flex items-center gap-2">
          {SHARE.map(({ name, href, Icon, color }) => (
            <a
              key={name}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              title={`Share on ${name}`}
              className={`grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.02] text-ink-dim ring-1 ring-white/0 transition-all ${color}`}
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
          <button
            type="button"
            onClick={onNativeShare}
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-3.5 py-2.5 text-xs font-semibold text-canvas hover:-translate-y-0.5 transition-transform"
          >
            <Share2 className="h-3.5 w-3.5" /> Share / Copy Link
          </button>
        </div>
      </div>
    </article>
  );
}
