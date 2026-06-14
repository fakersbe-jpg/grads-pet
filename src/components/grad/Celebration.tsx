import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCelebration } from "@/context/CelebrationContext";

gsap.registerPlugin(ScrollTrigger);

export function Celebration() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const bursedRef = useRef(false);
  const { triggerBurst } = useCelebration();

  useEffect(() => {
    const section = sectionRef.current!;
    const heading = headingRef.current!;
    const body = bodyRef.current!;
    const eyebrow = eyebrowRef.current!;

    // Split heading into per-char spans with clip wrappers using safe DOM methods
    const raw = heading.textContent ?? "";
    heading.setAttribute("aria-label", raw);
    heading.textContent = "";
    raw.split("").forEach((ch) => {
      if (ch === " ") {
        const space = document.createElement("span");
        space.style.cssText = "display:inline-block;width:0.28em";
        space.textContent = " ";
        heading.appendChild(space);
      } else {
        const outer = document.createElement("span");
        outer.style.cssText = "display:inline-block;overflow:hidden;vertical-align:bottom";
        const inner = document.createElement("span");
        inner.style.cssText = "display:inline-block;will-change:transform";
        inner.textContent = ch;
        outer.appendChild(inner);
        heading.appendChild(outer);
      }
    });
    const chars = heading.querySelectorAll("span > span");

    const ctx = gsap.context(() => {
      gsap.set(eyebrow, { opacity: 0, y: 14 });
      gsap.set(body, { opacity: 0, y: 20 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          once: true,
          onEnter: () => {
            if (!bursedRef.current) {
              bursedRef.current = true;
              triggerBurst();
            }
          },
        },
      });

      tl.to(eyebrow, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, 0)
        .to(chars, { y: "0%", duration: 1.0, stagger: 0.022, ease: "power4.out" }, 0.2)
        .to(body, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 0.8);
    }, section);

    return () => ctx.revert();
  }, [triggerBurst]);

  return (
    <section
      ref={sectionRef}
      className="relative z-10 flex min-h-screen items-center justify-center overflow-hidden px-6 py-32 text-center"
    >
      <div className="absolute inset-0 aurora opacity-70" />
      <div className="relative max-w-4xl">
        <div ref={eyebrowRef} className="font-script text-3xl text-gradient-rose">
          a toast
        </div>
        <h2
          ref={headingRef}
          className="font-display mt-4 text-[clamp(2.5rem,7vw,6rem)] leading-[1]"
        >
          Congratulations on your Graduation
        </h2>
        <p
          ref={bodyRef}
          className="font-display mx-auto mt-10 max-w-2xl text-balance text-lg leading-relaxed text-white/80 md:text-2xl"
        >
          Today you celebrate a remarkable achievement.
          <br />
          May this new chapter bring endless success,
          <br />
          joy, love, and{" "}
          <em className="text-gradient-rose not-italic">beautiful memories together</em>.
        </p>
      </div>
    </section>
  );
}
