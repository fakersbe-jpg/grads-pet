import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function Sticker({
  children,
  rotate = -8,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  rotate?: number;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.span
      initial={{ scale: 0, rotate: 0, opacity: 0 }}
      whileInView={{ scale: 1, rotate, opacity: 1 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ type: "spring", stiffness: 220, damping: 14, delay }}
      whileHover={{ rotate: rotate + 6, scale: 1.06 }}
      className={`sticker ${className}`}
    >
      {children}
    </motion.span>
  );
}
