import { Play, Youtube, Clock, Radio } from "lucide-react";

type Video = {
  id: string;
  title: string;
  channel: "YouTube" | "Reel" | "TikTok";
  duration: string;
  href: string;
  thumb: string;
  accent: string;
};

const VIDEOS: Video[] = [
  {
    id: "v1",
    title: "The 4:00 AM Leadership Check-In — Episode 01",
    channel: "YouTube",
    duration: "12:18",
    href: "https://youtube.com/@abrahamposesenteu",
    thumb: "/vlog/checkin-01.jpg",
    accent: "from-rose-500/30 to-amber-500/10",
  },
  {
    id: "v2",
    title: "Walking Shompole: what residents told me at sunrise",
    channel: "Reel",
    duration: "0:58",
    href: "https://facebook.com/AbrahamPoseSenteu",
    thumb: "/vlog/shompole-walk.jpg",
    accent: "from-sky-500/30 to-emerald-500/10",
  },
  {
    id: "v3",
    title: "Carbon credits explained — who really owns Magadi's air?",
    channel: "YouTube",
    duration: "08:42",
    href: "https://youtube.com/@abrahamposesenteu",
    thumb: "/vlog/carbon-credits.jpg",
    accent: "from-emerald-500/30 to-sky-500/10",
  },
  {
    id: "v4",
    title: "Equity Bank lessons — how I will audit county finance in 90 days",
    channel: "YouTube",
    duration: "14:01",
    href: "https://youtube.com/@abrahamposesenteu",
    thumb: "/vlog/equity-lessons.jpg",
    accent: "from-fuchsia-500/30 to-rose-500/10",
  },
  {
    id: "v5",
    title: "Ilmeguaraa speaks — age-set elders on community governance",
    channel: "TikTok",
    duration: "1:12",
    href: "https://tiktok.com/@abrahamposesenteu",
    thumb: "/vlog/ilmeguaraa.jpg",
    accent: "from-indigo-500/30 to-fuchsia-500/10",
  },
  {
    id: "v6",
    title: "Why I quit a corporate banking career to run for MCA",
    channel: "YouTube",
    duration: "06:55",
    href: "https://youtube.com/@abrahamposesenteu",
    thumb: "/vlog/why-mca.jpg",
    accent: "from-amber-500/30 to-rose-500/10",
  },
];

export default function VlogEngine() {
  return (
    <section id="vlog" className="relative py-24">
      <div className="container-tight">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-xl">
            <span className="section-eyebrow">
              <Radio className="h-3.5 w-3.5" /> Vlog · Video Broadcast Engine
            </span>
            <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
              Watch <span className="brand-gradient-text">the ground game.</span>
            </h2>
            <p className="mt-3 text-ink-dim">
              Reels, long-form explainers, and the 4 AM Leadership Check-In — all in one place.
            </p>
          </div>
          <a
            href="https://youtube.com/@abrahamposesenteu"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2.5 text-sm font-semibold text-ink hover:bg-white/5"
          >
            <Youtube className="h-4 w-4 text-[#FF0000]" /> Subscribe on YouTube
          </a>
        </header>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {VIDEOS.map((v) => (
            <VideoCard key={v.id} video={v} />
          ))}
        </div>
      </div>
    </section>
  );
}

function VideoCard({ video }: { video: Video }) {
  return (
    <a
      href={video.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group block overflow-hidden rounded-2xl border border-white/10 bg-edge transition-transform hover:-translate-y-1 hover:shadow-glow"
    >
      <div className="relative aspect-video w-full overflow-hidden">
        <img
          src={video.thumb}
          alt={video.title}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
        <div className={`absolute inset-0 bg-gradient-to-br ${video.accent}`} />
        <div className="absolute inset-0 grid place-items-center">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-canvas/80 ring-1 ring-white/10 backdrop-blur transition-transform group-hover:scale-110">
            <Play className="h-5 w-5 translate-x-0.5 fill-brand text-brand" />
          </span>
        </div>
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-md bg-canvas/80 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-ink ring-1 ring-white/10 backdrop-blur">
          {video.channel === "YouTube" && <Youtube className="h-3 w-3 text-[#FF0000]" />}
          {video.channel === "Reel" && <Radio className="h-3 w-3 text-sky-300" />}
          {video.channel === "TikTok" && <Radio className="h-3 w-3 text-fuchsia-300" />}
          {video.channel}
        </span>
        <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-md bg-canvas/80 px-2 py-1 text-[10px] font-semibold text-ink ring-1 ring-white/10 backdrop-blur">
          <Clock className="h-3 w-3" /> {video.duration}
        </span>
      </div>
      <div className="p-4">
        <h3 className="text-sm font-semibold leading-snug text-white text-balance group-hover:text-brand-soft">
          {video.title}
        </h3>
      </div>
    </a>
  );
}
