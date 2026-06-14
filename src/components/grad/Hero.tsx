import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { RevealText } from "./RevealText";

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const blur = useTransform(scrollYProgress, [0, 1], ["blur(0px)", "blur(12px)"]);

  return (
    <section ref={ref} className="relative z-10 flex min-h-screen items-center justify-center px-6 text-center">
      <motion.div style={{ y, opacity, filter: blur }} className="max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1.2 }}
          className="font-script text-4xl md:text-6xl text-gradient-rose"
        >
          to the graduates
        </motion.div>
        <h1 className="font-display mt-4 text-[clamp(3rem,11vw,9.5rem)] leading-[0.95]">
          <RevealText text="Congratulations" className="block shimmer-text" stagger={0.06} delay={0.6} />
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 2.2, duration: 1.4, ease: [0.2, 0.8, 0.2, 1] }}
          className="font-display mx-auto mt-8 max-w-2xl text-balance text-lg leading-relaxed text-white/80 md:text-2xl"
        >
          Today marks not only your graduation, but the celebration of a
          <em className="text-gradient-rose not-italic"> beautiful journey together</em>.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.2, duration: 1 }}
          className="mt-14 inline-flex items-center gap-3 text-xs uppercase tracking-[0.4em] text-white/50"
        >
          <span className="h-px w-10 bg-white/30" />
          <span>scroll the story</span>
          <span className="h-px w-10 bg-white/30" />
        </motion.div>
      </motion.div>

      {/* hero floating elements */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute bottom-10 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="h-12 w-px bg-gradient-to-b from-rose to-transparent" />
      </motion.div>
    </section>
  );
}
