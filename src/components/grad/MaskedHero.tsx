import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Sticker } from "./Sticker";

export function MaskedHero({ ready = false }: { ready?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const congratsRef = useRef<HTMLHeadingElement>(null);
  const gradsRef = useRef<HTMLHeadingElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const subheadRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yPhoto = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const scalePhoto = useTransform(scrollYProgress, [0, 1], [1, 1.25]);
  const yText = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const opacity = useTransform(scrollYProgress, [0, 0.9], [1, 0]);

  useEffect(() => {
    if (!ready) return;
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.fromTo(subheadRef.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.8 }, 0)
        .fromTo(congratsRef.current, { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 1.4 }, 0.1)
        .fromTo(gradsRef.current, { y: -80, opacity: 0 }, { y: 0, opacity: 1, duration: 1.4 }, 0.25)
        .fromTo(
          photoRef.current,
          { y: 120, scale: 0.85, opacity: 0 },
          { y: 0, scale: 1, opacity: 1, duration: 1.6 },
          0.3
        )
        .fromTo(
          taglineRef.current,
          { opacity: 0, y: 24, filter: "blur(8px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.2 },
          1.0
        );
      return () => tl.kill();
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(
        [subheadRef.current, congratsRef.current, gradsRef.current, photoRef.current, taglineRef.current],
        { opacity: 1, y: 0, scale: 1, filter: "none" }
      );
      return () => {};
    });

    return () => mm.revert();
  }, [ready]);

  return (
    <section
      ref={ref}
      className="relative z-10 flex min-h-[110vh] items-center justify-center overflow-hidden px-4 pt-24"
    >
      <motion.div style={{ opacity }} className="relative mx-auto w-full max-w-[1400px]">
        {/* Subhead */}
        <div
          ref={subheadRef}
          style={{ opacity: 0 }}
          className="mx-auto mb-6 flex items-center justify-center gap-4 text-[0.7rem] uppercase tracking-[0.5em] text-white/55"
        >
          <span className="h-px w-10 bg-white/30" />
          a cinematic love letter
          <span className="h-px w-10 bg-white/30" />
        </div>

        <div className="relative">
          {/* CONGRATS — real photo fills the letters */}
          <motion.h1
            ref={congratsRef}
            style={{ y: yText, opacity: 0 }}
            className="font-display text-mask-photo relative text-center text-[clamp(5rem,22vw,22rem)] font-bold leading-[0.85]"
            aria-label="CONGRATS"
          >
            CONGRATS
          </motion.h1>

          {/* Center punch-through photo */}
          <motion.div
            ref={photoRef}
            style={{ y: yPhoto, scale: scalePhoto, opacity: 0 }}
            className="pointer-events-none absolute left-1/2 top-1/2 z-10 w-[42vw] max-w-[520px] -translate-x-1/2 -translate-y-[40%]"
            data-cursor="view"
          >
            <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] shadow-[0_60px_120px_-30px_rgba(0,0,0,0.7)] ring-1 ring-white/15">
              <img src="/img1.jpeg" alt="The graduates" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
            </div>
          </motion.div>

          {/* GRADS — outline stroke */}
          <motion.h1
            ref={gradsRef}
            style={{ y: yText, opacity: 0 }}
            className="font-display text-stroke relative -mt-[8vw] text-center text-[clamp(5rem,22vw,22rem)] font-bold leading-[0.85] text-transparent"
          >
            GRADS
          </motion.h1>

          {/* Stickers */}
          <Sticker rotate={-12} delay={1.0} className="sticker-rose absolute left-[6%] top-[8%]">
            class of 2026
          </Sticker>
          <Sticker rotate={9} delay={1.2} className="sticker-peach absolute right-[6%] top-[18%]">
            together · forever
          </Sticker>
          <Sticker rotate={-6} delay={1.4} className="sticker-plum absolute bottom-[14%] right-[12%]">
            with love ✦
          </Sticker>
        </div>

        {/* Tagline */}
        <p
          ref={taglineRef}
          style={{ opacity: 0 }}
          className="font-display mx-auto mt-12 max-w-2xl text-balance text-center text-lg leading-relaxed text-white/80 md:text-2xl"
        >
          Two graduates. One story.{" "}
          <em className="text-gradient-rose not-italic">A beautiful journey shared.</em>
        </p>

        {/* Corner photo */}
        <div
          className="pointer-events-none absolute -right-2 top-10 hidden w-40 overflow-hidden rounded-2xl ring-1 ring-white/15 shadow-2xl md:block"
          data-cursor="view"
        >
          <img src="/img3.jpeg" alt="" className="aspect-[3/4] w-full object-cover" />
        </div>
      </motion.div>

      <motion.div
        aria-hidden
        className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 text-[0.65rem] uppercase tracking-[0.5em] text-white/45"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      >
        scroll the story ↓
      </motion.div>
    </section>
  );
}
