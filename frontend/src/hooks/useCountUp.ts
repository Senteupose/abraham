import { useEffect, useRef, useState } from "react";

export function useCountUp(target: number, durationMs = 1800): { value: number; ref: (node: HTMLElement | null) => void } {
  const [value, setValue] = useState(0);
  const started = useRef(false);
  const observer = useRef<IntersectionObserver | null>(null);

  const ref = (node: HTMLElement | null) => {
    if (!node || started.current) return;
    observer.current?.disconnect();
    observer.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            started.current = true;
            animate();
            observer.current?.disconnect();
            break;
          }
        }
      },
      { threshold: 0.25 },
    );
    observer.current.observe(node);
  };

  const animate = () => {
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  useEffect(() => () => observer.current?.disconnect(), []);

  return { value, ref };
}
