import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const images = [
  "/celebration/WhatsApp%20Image%202026-06-12%20at%203.17.18%20PM.jpeg",
  "/celebration/WhatsApp%20Image%202026-06-12%20at%203.17.22%20PM.jpeg",
  "/celebration/WhatsApp%20Image%202026-06-12%20at%203.17.24%20PM.jpeg",
  "/celebration/WhatsApp%20Image%202026-06-12%20at%203.17.29%20PM.jpeg",
  "/celebration/WhatsApp%20Image%202026-06-12%20at%203.17.30%20PM.jpeg",
  "/celebration/WhatsApp%20Image%202026-06-12%20at%203.17.32%20PM.jpeg",
  "/celebration/WhatsApp%20Image%202026-06-12%20at%206.07.55%20PM%20(1).jpeg",
  "/celebration/WhatsApp%20Image%202026-06-12%20at%206.07.55%20PM.jpeg",
  "/celebration/WhatsApp%20Image%202026-06-12%20at%206.07.56%20PM.jpeg",
  "/celebration/WhatsApp%20Image%202026-06-12%20at%206.07.58%20PM.jpeg",
  "/celebration/WhatsApp%20Image%202026-06-12%20at%206.07.59%20PM.jpeg",
  "/celebration/WhatsApp%20Image%202026-06-12%20at%206.08.00%20PM.jpeg",
  "/celebration/WhatsApp%20Image%202026-06-12%20at%206.08.03%20PM.jpeg",
  "/celebration/WhatsApp%20Image%202026-06-12%20at%206.08.04%20PM.jpeg",
  "/celebration/WhatsApp%20Image%202026-06-12%20at%206.08.05%20PM.jpeg",
  "/celebration/WhatsApp%20Image%202026-06-12%20at%209.54.46%20PM.jpeg",
  "/celebration/WhatsApp%20Image%202026-06-13%20at%2012.00.02%20AM.jpeg",
  "/celebration/WhatsApp%20Image%202026-06-13%20at%2012.00.04%20AM.jpeg",
  "/celebration/WhatsApp%20Image%202026-06-13%20at%2012.00.07%20AM.jpeg",
];

// Distribute images across 3 rows
const rows = [
  images.slice(0, 7),
  images.slice(7, 13),
  images.slice(13, 19),
];

function MarqueeRow({
  imgs,
  reverse = false,
  speed = 40,
}: {
  imgs: string[];
  reverse?: boolean;
  speed?: number;
}) {
  // Triple so the loop is seamless
  const repeated = [...imgs, ...imgs, ...imgs];

  return (
    <div className="overflow-hidden">
      <motion.div
        className="flex gap-3 will-change-transform"
        animate={{ x: reverse ? ["0%", "33.333%"] : ["0%", "-33.333%"] }}
        transition={{ duration: speed, ease: "linear", repeat: Infinity }}
        style={{ width: "max-content" }}
      >
        {repeated.map((src, i) => (
          <motion.div
            key={i}
            className="relative h-52 w-72 shrink-0 overflow-hidden rounded-2xl md:h-64 md:w-80"
            whileHover={{ scale: 1.04, zIndex: 10 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          >
            <img
              src={src}
              alt=""
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
              loading="lazy"
            />
            {/* Subtle vignette on each photo */}
            <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

export function CelebrationGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const rowsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title reveal on scroll
      gsap.fromTo(
        eyebrowRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: eyebrowRef.current, start: "top 88%", once: true },
        }
      );

      // Heading: split chars with clip reveal
      const heading = headingRef.current!;
      const raw = heading.textContent ?? "";
      heading.setAttribute("aria-label", raw);
      heading.textContent = "";
      raw.split("").forEach((ch) => {
        if (ch === " ") {
          const sp = document.createElement("span");
          sp.style.cssText = "display:inline-block;width:0.28em";
          sp.textContent = " ";
          heading.appendChild(sp);
        } else {
          const outer = document.createElement("span");
          outer.style.cssText = "display:inline-block;overflow:hidden;vertical-align:bottom";
          const inner = document.createElement("span");
          inner.style.cssText = "display:inline-block;will-change:transform;transform:translateY(110%)";
          inner.textContent = ch;
          outer.appendChild(inner);
          heading.appendChild(outer);
        }
      });
      const chars = heading.querySelectorAll("span > span");
      gsap.to(chars, {
        y: "0%", duration: 1.1, stagger: 0.02, ease: "power4.out",
        scrollTrigger: { trigger: heading, start: "top 85%", once: true },
      });

      gsap.fromTo(
        subRef.current,
        { opacity: 0, y: 16 },
        {
          opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: subRef.current, start: "top 88%", once: true },
        }
      );

      // Rows slide up into view
      gsap.fromTo(
        rowsRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1, y: 0, duration: 1.1, ease: "power3.out",
          scrollTrigger: { trigger: rowsRef.current, start: "top 90%", once: true },
        }
      );
    }, sectionRef.current!);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative z-10 overflow-hidden py-32">
      {/* Background aurora */}
      <div className="pointer-events-none absolute inset-0 aurora opacity-40" />

      {/* Top fade */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background to-transparent" />

      {/* Section header */}
      <div className="relative mx-auto mb-16 max-w-4xl px-6 text-center">
        <div
          ref={eyebrowRef}
          className="font-script text-4xl text-gradient-rose"
          style={{ opacity: 0 }}
        >
          the night we celebrated
        </div>
        <h2
          ref={headingRef}
          className="font-display mt-3 text-[clamp(2.8rem,8vw,7rem)] leading-[0.95]"
        >
          Party Memories
        </h2>
        <p
          ref={subRef}
          className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/60 md:text-lg"
          style={{ opacity: 0 }}
        >
          Every laugh, every dance, every moment captured — the celebration you both deserved.
        </p>
      </div>

      {/* Three marquee rows */}
      <div ref={rowsRef} className="flex flex-col gap-3" style={{ opacity: 0 }}>
        <MarqueeRow imgs={rows[0]} speed={38} />
        <MarqueeRow imgs={rows[1]} speed={30} reverse />
        <MarqueeRow imgs={rows[2]} speed={44} />
      </div>

      {/* Bottom fade */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
