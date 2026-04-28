"use client";

import { motion } from "framer-motion";

export default function Button({
  children,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`w-full py-2 rounded-lg font-semibold transition ${className}`}
    >
      {children}
    </motion.button>
  );
}