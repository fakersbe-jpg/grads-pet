import { motion } from "framer-motion";

export function RevealText({
  text,
  className = "",
  delay = 0,
  stagger = 0.04,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const words = text.split(" ");
  return (
    <span className={className} aria-label={text}>
      {words.map((w, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap mr-[0.25em]">
          {Array.from(w).map((ch, ci) => (
            <motion.span
              key={ci}
              className="inline-block"
              initial={{ y: "1.1em", opacity: 0, filter: "blur(12px)" }}
              whileInView={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{
                duration: 0.9,
                delay: delay + (wi * 0.06 + ci * stagger),
                ease: [0.2, 0.8, 0.2, 1],
              }}
            >
              {ch}
            </motion.span>
          ))}
        </span>
      ))}
    </span>
  );
}
