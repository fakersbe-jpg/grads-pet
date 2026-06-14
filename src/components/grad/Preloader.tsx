import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export function Preloader({ onDone }: { onDone: () => void }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const botRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const hasRun = useRef(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    // React Strict Mode mounts twice in dev — only run once
    if (hasRun.current) return;
    hasRun.current = true;

    const obj = { value: 0 };
    const mm = gsap.matchMedia();

    const runSplit = () => {
      const splitTl = gsap.timeline({ onComplete: () => onDoneRef.current() });
      splitTl
        .to([counterRef.current, labelRef.current], { opacity: 0, duration: 0.35, ease: "power2.in" }, 0)
        .to(topRef.current, { yPercent: -100, duration: 0.9, ease: "power3.inOut" }, 0.2)
        .to(botRef.current, { yPercent: 100, duration: 0.9, ease: "power3.inOut" }, 0.2);
    };

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({ onComplete: runSplit });
      tl.to(obj, {
        value: 100,
        duration: 2.2,
        ease: "power2.inOut",
        onUpdate() {
          const v = Math.round(obj.value);
          if (counterRef.current) counterRef.current.textContent = String(v).padStart(3, "0");
          if (lineRef.current) lineRef.current.style.width = `${obj.value}%`;
        },
      });
      return () => tl.kill();
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      if (counterRef.current) counterRef.current.textContent = "100";
      if (lineRef.current) lineRef.current.style.width = "100%";
      gsap.to(wrapRef.current, { opacity: 0, duration: 0.5, delay: 0.4, onComplete: () => onDoneRef.current() });
      return () => {};
    });

    return () => mm.revert();
  }, []);

  return (
    <div ref={wrapRef} className="fixed inset-0 z-[100]" aria-hidden>
      <div ref={topRef} className="absolute inset-x-0 top-0 h-1/2 bg-background" />
      <div ref={botRef} className="absolute inset-x-0 bottom-0 h-1/2 bg-background" />
      <div className="pointer-events-none absolute inset-0 aurora opacity-40" />
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div
          ref={counterRef}
          className="font-display select-none tabular-nums text-foreground"
          style={{
            fontSize: "clamp(5rem,14vw,11rem)",
            letterSpacing: "-0.04em",
            lineHeight: 1,
          }}
        >
          000
        </div>
        <div className="relative mt-8 w-48">
          <div className="h-px w-full bg-white/10" />
          <div
            ref={lineRef}
            className="absolute inset-y-0 left-0 h-px bg-gradient-to-r from-rose via-peach to-plum"
            style={{ width: "0%" }}
          />
        </div>
        <div
          ref={labelRef}
          className="mt-4 font-sans text-[0.65rem] uppercase tracking-[0.5em] text-white/35"
        >
          loading the story
        </div>
      </div>
    </div>
  );
}
