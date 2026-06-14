import { useEffect, useRef } from "react";

type CursorState = "default" | "view" | "drag" | "link";

export function Cursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (matchMedia("(pointer: coarse)").matches) return;

    const ring = ringRef.current!;
    const dot = dotRef.current!;
    const trails = trailRefs.current;

    const TRAIL_COUNT = 8;
    const history: { x: number; y: number }[] = Array.from({ length: TRAIL_COUNT }, () => ({ x: 0, y: 0 }));

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    let prevX = 0, prevY = 0;
    let raf = 0;
    let visible = false;

    const show = () => {
      if (visible) return;
      visible = true;
      ring.style.opacity = "1";
      dot.style.opacity = "1";
    };

    const hide = () => {
      visible = false;
      ring.style.opacity = "0";
      dot.style.opacity = "0";
      trails.forEach((t) => { t.style.opacity = "0"; });
    };

    const getState = (e: MouseEvent): CursorState => {
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const attr = el?.closest("[data-cursor]")?.getAttribute("data-cursor");
      if (attr === "view") return "view";
      if (attr === "drag") return "drag";
      if (el?.closest("a, button, [role='button']")) return "link";
      return "default";
    };

    let currentState: CursorState = "default";

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      show();

      currentState = getState(e);

      // Magnetic: pull element toward cursor
      const magnet = document.elementFromPoint(e.clientX, e.clientY)?.closest("[data-magnet]") as HTMLElement | null;
      if (magnet) {
        const r = magnet.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 80) {
          magnet.style.transform = `translate(${dx * 0.35}px,${dy * 0.35}px)`;
          magnet.style.transition = "transform 0.1s ease-out";
        }
      }
    };

    const onLeaveEl = (e: MouseEvent) => {
      const magnet = (e.target as HTMLElement)?.closest?.("[data-magnet]") as HTMLElement | null;
      if (magnet) {
        magnet.style.transform = "translate(0,0)";
        magnet.style.transition = "transform 0.4s cubic-bezier(0.23,1,0.32,1)";
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseout", onLeaveEl);
    document.addEventListener("mouseleave", hide);
    document.addEventListener("mouseenter", show);

    const loop = () => {
      // Velocity
      const vx = mouseX - prevX;
      const vy = mouseY - prevY;
      const speed = Math.sqrt(vx * vx + vy * vy);
      const angle = Math.atan2(vy, vx);
      prevX = mouseX;
      prevY = mouseY;

      // Dot: instant
      dot.style.transform = `translate3d(${mouseX - 3}px,${mouseY - 3}px,0)`;

      // Trail
      history.unshift({ x: mouseX, y: mouseY });
      history.pop();
      trails.forEach((t, i) => {
        const pos = history[Math.min(i, history.length - 1)];
        t.style.transform = `translate3d(${pos.x - 3}px,${pos.y - 3}px,0)`;
        t.style.opacity = visible ? String(((TRAIL_COUNT - i) / TRAIL_COUNT) * 0.4) : "0";
      });

      // Ring: lerp
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;

      // Stretch
      const stretch = 1 + speed * 0.04;
      const squish = 1 / stretch;

      // State-based ring shape
      let w = 36, h = 36, br = "50%", bg = "transparent";
      let bColor = `oklch(${Math.min(0.88, 0.78 + speed * 0.003)} ${Math.max(0.09, 0.16 - speed * 0.002)} 12)`;
      let label = "";
      let blend = "normal";

      if (currentState === "view") {
        w = 56; h = 56;
        bg = "oklch(0.78 0.16 12)";
        bColor = "transparent";
        label = "VIEW";
        blend = "difference";
      } else if (currentState === "drag") {
        w = 56; h = 24; br = "9999px";
        label = "DRAG →";
      } else if (currentState === "link") {
        w = 20; h = 20;
      }

      const applyStretch = currentState === "default" || currentState === "link";
      const rotStr = applyStretch ? `rotate(${angle}rad) scaleX(${stretch}) scaleY(${squish})` : "";
      ring.style.transform = `translate3d(${ringX - w / 2}px,${ringY - h / 2}px,0) ${rotStr}`;
      ring.style.width = `${w}px`;
      ring.style.height = `${h}px`;
      ring.style.borderRadius = br;
      ring.style.background = bg;
      ring.style.borderColor = bColor;
      ring.style.mixBlendMode = blend as any;

      const labelEl = ring.querySelector("span") as HTMLElement | null;
      if (labelEl) {
        labelEl.textContent = label;
        labelEl.style.opacity = label ? "1" : "0";
      }

      raf = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeaveEl);
      document.removeEventListener("mouseleave", hide);
      document.removeEventListener("mouseenter", show);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          ref={(el) => { if (el) trailRefs.current[i] = el; }}
          className="pointer-events-none fixed left-0 top-0 z-[88] hidden h-[6px] w-[6px] rounded-full bg-rose md:block"
          style={{ mixBlendMode: "screen", opacity: 0, willChange: "transform" }}
        />
      ))}
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[89] hidden items-center justify-center border border-rose/60 md:flex"
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          opacity: 0,
          willChange: "transform",
          transition: "width 0.25s cubic-bezier(0.23,1,0.32,1), height 0.25s cubic-bezier(0.23,1,0.32,1), background 0.25s ease, border-radius 0.25s ease",
        }}
      >
        <span
          className="pointer-events-none select-none font-sans text-[0.5rem] font-bold uppercase tracking-widest text-white"
          style={{ opacity: 0, transition: "opacity 0.2s ease" }}
        />
      </div>
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[90] hidden h-[6px] w-[6px] rounded-full bg-rose md:block"
        style={{
          boxShadow: "0 0 14px oklch(0.78 0.16 12 / 0.9)",
          opacity: 0,
          willChange: "transform",
        }}
      />
    </>
  );
}
