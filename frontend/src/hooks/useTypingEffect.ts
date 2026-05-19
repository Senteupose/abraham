import { useEffect, useState } from "react";

export function useTypingEffect(text: string, speed = 55, startDelay = 400): string {
  const [output, setOutput] = useState("");

  useEffect(() => {
    setOutput("");
    let cancelled = false;
    let i = 0;

    const start = window.setTimeout(() => {
      const tick = () => {
        if (cancelled) return;
        i += 1;
        setOutput(text.slice(0, i));
        if (i < text.length) {
          window.setTimeout(tick, speed);
        }
      };
      tick();
    }, startDelay);

    return () => {
      cancelled = true;
      window.clearTimeout(start);
    };
  }, [text, speed, startDelay]);

  return output;
}
