import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

export function Marquee({
  text,
  speed = 40,
  className = "",
  reverse = false,
}: {
  text: string;
  speed?: number;
  className?: string;
  reverse?: boolean;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const items = Array.from({ length: 8 });

  useEffect(() => {
    let lastY = window.scrollY;
    let lastT = performance.now();
    let raf = 0;

    const poll = () => {
      const now = performance.now();
      const dt = now - lastT;
      if (dt > 0 && wrapRef.current) {
        const vel = Math.abs((window.scrollY - lastY) / dt) * 16;
        const squish = Math.max(0.82, 1 - vel * 0.003);
        wrapRef.current.style.transform = `scaleY(${squish})`;
      }
      lastY = window.scrollY;
      lastT = now;
      raf = requestAnimationFrame(poll);
    };

    raf = requestAnimationFrame(poll);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      ref={wrapRef}
      className={`relative z-10 overflow-hidden py-6 ${className}`}
      style={{
        willChange: "transform",
        transition: "transform 0.18s cubic-bezier(0.23,1,0.32,1)",
      }}
    >
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration: speed, ease: "linear", repeat: Infinity }}
      >
        {items.concat(items).map((_, i) => (
          <span
            key={i}
            className="font-display mx-8 inline-flex items-center gap-8 text-[clamp(3rem,9vw,9rem)] leading-none tracking-tight"
          >
            <span className="text-gradient-rose">{text}</span>
            <span className="text-glow/40">✦</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
