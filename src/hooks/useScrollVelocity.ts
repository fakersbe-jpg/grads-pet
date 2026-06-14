import { useEffect } from "react";

export function useScrollVelocity(onChange: (velocity: number) => void) {
  useEffect(() => {
    let lastY = window.scrollY;
    let lastT = performance.now();
    let raf = 0;
    const poll = () => {
      const now = performance.now();
      const dt = now - lastT;
      if (dt > 0) {
        const dy = window.scrollY - lastY;
        onChange((dy / dt) * 16);
      }
      lastY = window.scrollY;
      lastT = now;
      raf = requestAnimationFrame(poll);
    };
    raf = requestAnimationFrame(poll);
    return () => cancelAnimationFrame(raf);
  }, [onChange]);
}
