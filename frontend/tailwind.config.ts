import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#0F172A",
        panel: "#111C32",
        edge: "#1E293B",
        brand: {
          DEFAULT: "#F59E0B",
          soft: "#FBBF24",
          deep: "#B45309",
        },
        ink: {
          DEFAULT: "#E2E8F0",
          dim: "#94A3B8",
          mute: "#64748B",
        },
      },
      fontFamily: {
        display: ['"Inter"', '"Segoe UI"', "system-ui", "sans-serif"],
        body: ['"Inter"', '"Segoe UI"', "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(245,158,11,0.35), 0 12px 40px -12px rgba(245,158,11,0.45)",
        panel: "0 1px 0 rgba(255,255,255,0.04) inset, 0 30px 60px -30px rgba(0,0,0,0.6)",
      },
      animation: {
        "pulse-brand": "pulseBrand 2.2s ease-in-out infinite",
        "fade-up": "fadeUp 0.6s ease-out both",
        "blink": "blink 1s steps(2,start) infinite",
      },
      keyframes: {
        pulseBrand: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(245,158,11,0.55)" },
          "50%": { boxShadow: "0 0 0 14px rgba(245,158,11,0)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
