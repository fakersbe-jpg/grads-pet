import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RevealText } from "./RevealText";

gsap.registerPlugin(ScrollTrigger);

export function Finale() {
  const sectionRef = useRef<HTMLElement>(null);
  const photoWrapRef = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const section = sectionRef.current!;
    const ctx = gsap.context(() => {
      // Photo zoom scrub
      gsap.fromTo(
        photoWrapRef.current,
        { scale: 1.0 },
        {
          scale: 1.14,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        }
      );

      // Clip-path wipe on script text
      gsap.fromTo(
        scriptRef.current,
        { clipPath: "inset(0 100% 0 0)" },
        {
          clipPath: "inset(0 0% 0 0)",
          ease: "power2.out",
          scrollTrigger: {
            trigger: scriptRef.current,
            start: "top 85%",
            end: "top 45%",
            scrub: 1,
          },
        }
      );

      // Heading fade up
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: { trigger: headingRef.current, start: "top 85%", once: true },
        }
      );

      // Body fade up
      gsap.fromTo(
        bodyRef.current,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 1.0,
          ease: "power3.out",
          scrollTrigger: { trigger: bodyRef.current, start: "top 88%", once: true },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative z-10 flex min-h-[120vh] items-center justify-center px-6 py-32"
    >
      <div className="absolute inset-0 aurora opacity-90" />
      <div className="relative mx-auto grid w-full max-w-6xl gap-12 md:grid-cols-[1.1fr_1fr] md:items-center">
        {/* Photo with scroll zoom */}
        <div
          ref={photoWrapRef}
          className="relative mx-auto aspect-[3/4] w-full max-w-lg"
          style={{ transformOrigin: "center center" }}
        >
          <div className="absolute -inset-12 rounded-[3rem] bg-gradient-to-tr from-rose/40 via-plum/40 to-peach/40 blur-3xl" />
          <div className="relative h-full w-full overflow-hidden rounded-[2rem] glow-rose">
            <img
              src="/img5.jpeg"
              alt="The couple celebrating their graduation"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
          </div>
        </div>

        {/* Text */}
        <div className="text-center md:text-left">
          <div
            ref={scriptRef}
            className="font-script text-4xl text-gradient-rose"
            style={{ clipPath: "inset(0 100% 0 0)" }}
          >
            forever forward
          </div>
          <h2
            ref={headingRef}
            className="font-display mt-4 text-[clamp(2.5rem,7vw,6rem)] leading-[0.95] shimmer-text"
            style={{ opacity: 0 }}
          >
            <RevealText text="The Future Begins Today" />
          </h2>
          <p
            ref={bodyRef}
            className="font-display mt-8 text-2xl text-white/85 md:text-3xl"
            style={{ opacity: 0 }}
          >
            Happy Graduation <span className="text-rose">❤</span>
          </p>
          <p className="mt-10 text-xs uppercase tracking-[0.45em] text-white/40">
            class of 2026 · together
          </p>
        </div>
      </div>
    </section>
  );
}
