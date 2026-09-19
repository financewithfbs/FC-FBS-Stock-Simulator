// src/components/ThemeToggle.tsx
import React, { useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const [hovered, setHovered] = useState(false);

  const isLight = theme === "light";

  return (
    <div className="relative z-[100]">
      {/* Outer ambient glow */}
      <motion.div
        className={`absolute -inset-2 rounded-full blur-xl transition-colors duration-500 pointer-events-none ${
          isLight
            ? hovered
              ? "bg-amber-400/50"
              : "bg-amber-400/30"
            : hovered
              ? "bg-[#9303C5]/50"
              : "bg-[#9303C5]/30"
        }`}
        animate={{ scale: hovered ? 1.15 : 1 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Pulsing ring */}
      <motion.div
        className={`absolute inset-0 rounded-full border pointer-events-none ${
          isLight ? "border-amber-300/40" : "border-[#d8b4fe]/30"
        }`}
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.4, 0.15, 0.4],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* The button */}
      <motion.button
        type="button"
        onClick={toggleTheme}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        aria-label={`Switch to ${isLight ? "dark" : "light"} mode`}
        whileTap={{ scale: 0.92 }}
        whileHover={{ scale: 1.06 }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          opacity: { duration: 0.3 },
          scale: { duration: 0.4, type: "spring", stiffness: 220 },
        }}
        className={`
          relative w-12 h-12 rounded-full
          overflow-hidden cursor-pointer
          border border-white/20
          transition-all duration-500 ease-in-out
          flex items-center justify-center
          focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
          ${
            isLight
              ? "focus-visible:ring-amber-400 focus-visible:ring-offset-[var(--bg-primary)]"
              : "focus-visible:ring-[#9303C5] focus-visible:ring-offset-[var(--bg-primary)]"
          }
        `}
        style={{
          background: isLight
            ? "linear-gradient(135deg, #fbbf24 0%, #f97316 55%, #ea580c 100%)"
            : "linear-gradient(135deg, #9303C5 0%, #6b02b3 55%, #4a0163 100%)",
          boxShadow: isLight
            ? "0 8px 24px -8px rgba(251, 191, 36, 0.6), inset 0 1px 0 rgba(255,255,255,0.4)"
            : "0 8px 24px -8px rgba(147, 3, 197, 0.7), inset 0 1px 0 rgba(255,255,255,0.15)",
        }}
      >
        {/* Top glass highlight */}
        <span className="absolute inset-x-2 top-0 h-px bg-white/50" />

        {/* Inner ambient blob */}
        <span
          className={`absolute -top-2 -right-2 w-8 h-8 rounded-full blur-md transition-colors duration-500 ${
            isLight ? "bg-amber-200/50" : "bg-[#d8b4fe]/40"
          }`}
        />

        {/* Shine sweep */}
        <span
          className={`
            absolute inset-0 pointer-events-none
            bg-gradient-to-r from-transparent via-white/30 to-transparent
            -translate-x-full
            transition-transform duration-1000 ease-out
            ${hovered ? "translate-x-full" : ""}
          `}
        />

        {/* Icon */}
        <span className="relative z-10 flex items-center justify-center w-full h-full">
          <AnimatePresence mode="wait" initial={false}>
            {isLight ? (
              <motion.span
                key="moon"
                initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                transition={{
                  duration: 0.35,
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                }}
                className="absolute"
              >
                <Moon
                  className="h-5 w-5 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
                  strokeWidth={2.4}
                />
              </motion.span>
            ) : (
              <motion.span
                key="sun"
                initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                transition={{
                  duration: 0.35,
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                }}
                className="absolute"
              >
                <Sun
                  className="h-5 w-5 text-yellow-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
                  strokeWidth={2.4}
                />
              </motion.span>
            )}
          </AnimatePresence>
        </span>
      </motion.button>

      {/* Tooltip — positioned to the LEFT, solid bg, pure contrast */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, x: 6, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 6, scale: 0.95 }}
            transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-1/2 right-full mr-3 -translate-y-1/2 z-[9999] pointer-events-none"
          >
            <div
              className="relative px-3 py-2 rounded-lg flex items-center gap-1.5"
              style={{
                // Always dark bg with white text — universal high contrast
                backgroundColor: "#0f172a",
                color: "#ffffff",
                border: "1px solid rgba(255,255,255,0.15)",
                boxShadow: "0 10px 30px -8px rgba(0, 0, 0, 0.5)",
                fontSize: "12px",
                fontWeight: 700,
                lineHeight: 1.2,
                whiteSpace: "nowrap",
              }}
            >
              {/* Arrow pointing right, toward the button */}
              <span
                className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 rotate-45"
                style={{
                  backgroundColor: "#0f172a",
                  borderRight: "1px solid rgba(255,255,255,0.15)",
                  borderTop: "1px solid rgba(255,255,255,0.15)",
                }}
              />

              {isLight ? (
                <>
                  <Moon
                    className="h-3 w-3"
                    strokeWidth={2.6}
                    style={{ color: "#ffffff" }}
                  />
                  <span style={{ color: "#ffffff", fontWeight: 700 }}>
                    Switch to Dark
                  </span>
                </>
              ) : (
                <>
                  <Sun
                    className="h-3 w-3"
                    strokeWidth={2.6}
                    style={{ color: "#ffffff" }}
                  />
                  <span style={{ color: "#ffffff", fontWeight: 700 }}>
                    Switch to Light
                  </span>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};