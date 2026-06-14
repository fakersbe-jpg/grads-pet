import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { RevealText } from "./RevealText";
import { useIsMobile } from "@/hooks/use-mobile";
// Animated car — <object> fully supports SVG internal animations and <use> references
function CarSVG() {
  return (
    <object
      type="image/svg+xml"
      data="/aanimated-car.svg"
      aria-hidden
      width={200}
      height={150}
      style={{ display: "block", pointerEvents: "none" , transform: "scaleX(-1)"}}
    />
  );
}

gsap.registerPlugin(ScrollTrigger);

const photos = ["/img1.jpeg", "/img2.jpeg", "/img3.jpeg", "/img4.jpeg", "/img5.jpeg", "/img5.jpeg"];

const panels = [
  {
    title: "Where it began",
    subtitle: "Two paths quietly converging — a campus, late nights, shared dreams, and the soft beginnings of everything.",
  },
  {
    title: "Side by side",
    subtitle: "Every lecture, every deadline, every small victory — held a little easier with someone walking beside you.",
  },
  {
    title: "Becoming",
    subtitle: "The work that nobody saw. The growth that quietly bloomed. This is what becoming looks like.",
  },
  {
    title: "Moments held",
    subtitle: "Pieces of a story you'll never want to forget — a wall of memories suspended in light.",
  },
  {
    title: "A keepsake",
    subtitle: "Some moments deserve to be printed, pinned, and remembered the old way.",
  },
  {
    title: "Today",
    subtitle: "Caps tossed, tassels turned. Today is the photograph the future will keep.",
  },
];

function HorizontalScroll() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const imgRefs = useRef<HTMLDivElement[]>([]);
  const dividerRefs = useRef<HTMLDivElement[]>([]);
  const planeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sticky = stickyRef.current!;
    const track = trackRef.current!;

    // Car: chapter 1 (p=0) → chapter 4 (p=4/6), purely horizontal at 68vh
    const CAR_END = 4 / panels.length;
    const moveCar = (progress: number) => {
      const car = planeRef.current;
      if (!car) return;
      const t = Math.max(0, Math.min(1, progress / CAR_END));
      const x = (window.innerWidth + 60) - t * (window.innerWidth + 60 + 180);
      car.style.transform = `translate(${x}px, ${window.innerHeight * 0.68}px)`;
    };

    // Set initial position off-screen right
    moveCar(0);

    const ctx = gsap.context(() => {
      const tween = gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
          trigger: sticky,
          start: "top top",
          end: () => `+=${track.scrollWidth - window.innerWidth}`,
          scrub: 1.2,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate(self) { moveCar(self.progress); },
          onRefresh() { moveCar(0); },
        },
      });

      // Per-panel photo scale
      imgRefs.current.forEach((img) => {
        if (!img) return;
        gsap.fromTo(
          img,
          { scale: 0.88 },
          {
            scale: 1.0,
            ease: "none",
            scrollTrigger: {
              trigger: img,
              containerAnimation: tween,
              start: "left right",
              end: "right left",
              scrub: true,
            },
          }
        );
      });

      // Dividers
      dividerRefs.current.forEach((div) => {
        if (!div) return;
        gsap.fromTo(
          div,
          { scaleY: 0, transformOrigin: "top center" },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: div,
              containerAnimation: tween,
              start: "left right",
              end: "left center",
              scrub: true,
            },
          }
        );
      });
    }, sectionRef.current!);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} style={{ height: "600vh" }}>
      <div
        ref={stickyRef}
        style={{ position: "sticky", top: 0, height: "100vh", overflow: "clip" }}
      >
        {/* Car driving by — GSAP moves it via style.transform */}
        <div
          ref={planeRef}
          className="pointer-events-none absolute z-30"
          style={{ top: 0, left: 0, filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.6))" }}
        >
          <CarSVG />
        </div>

        <div
          ref={trackRef}
          className="flex h-full"
          style={{ width: `${panels.length * 100}vw` }}
        >
          {panels.map((panel, i) => (
            <div
              key={i}
              className="relative flex h-full shrink-0 items-center"
              style={{ width: "100vw" }}
              data-cursor="drag"
            >
              {i > 0 && (
                <div
                  ref={(el) => { if (el) dividerRefs.current[i] = el; }}
                  className="absolute left-0 top-0 h-full w-px bg-white/10"
                />
              )}

              <div className="mx-auto grid h-full w-full max-w-7xl grid-cols-2 items-center gap-16 px-16 py-20">
                {/* Photo */}
                <div className={i % 2 === 0 ? "order-1" : "order-2"}>
                  <div
                    ref={(el) => { if (el) imgRefs.current[i] = el; }}
                    className="relative mx-auto aspect-[3/4] w-full max-w-sm overflow-hidden rounded-[2rem] shadow-2xl"
                  >
                    <img
                      src={photos[i]}
                      alt={panel.title}
                      className="h-full w-full object-cover"
                      loading={i === 0 ? "eager" : "lazy"}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent" />
                  </div>
                </div>

                {/* Text */}
                <div className={`flex flex-col justify-center ${i % 2 === 0 ? "order-2" : "order-1"}`}>
                  <div className="font-script text-3xl text-gradient-rose">
                    Chapter {String(i + 1).padStart(2, "0")}
                  </div>
                  <h2 className="font-display mt-3 text-[clamp(2.5rem,4.5vw,5rem)] leading-[1.0]">
                    <RevealText text={panel.title} />
                  </h2>
                  <p className="mt-6 max-w-md text-base text-white/70 md:text-lg">{panel.subtitle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function VerticalScroll() {
  return (
    <div className="relative z-10">
      {panels.map((panel, i) => (
        <section key={i} className="relative flex min-h-screen items-center px-6 py-32 md:px-16">
          <div className="mx-auto grid w-full max-w-7xl items-center gap-12 md:grid-cols-2">
            <div className={i % 2 === 0 ? "order-2 md:order-1" : "order-2"}>
              <div className="font-script text-3xl text-gradient-rose">
                Chapter {String(i + 1).padStart(2, "0")}
              </div>
              <h2 className="font-display mt-3 text-5xl leading-[1.02] md:text-7xl">
                <RevealText text={panel.title} className="block" />
              </h2>
              <p className="mt-6 max-w-md text-base text-white/70 md:text-lg">{panel.subtitle}</p>
            </div>
            <div className={i % 2 === 0 ? "order-1 md:order-2" : "order-1"}>
              <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.94 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-15%" }}
                transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
                className="relative mx-auto aspect-[3/4] w-full max-w-md overflow-hidden rounded-[2rem] shadow-2xl"
              >
                <img
                  src={photos[i]}
                  alt={panel.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </motion.div>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}

export function PhotoScenes() {
  const isMobile = useIsMobile();
  if (isMobile) return <VerticalScroll />;
  return <HorizontalScroll />;
}
