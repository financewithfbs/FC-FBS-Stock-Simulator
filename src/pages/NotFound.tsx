import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Home,
  ArrowLeft,
  AlertCircle,
  Search,
  Compass,
  Sparkles,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const NotFound = () => {
  const location = useLocation();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  /* Floating dot parallax to keep the page feeling alive */
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setMouse({
        x: e.clientX / window.innerWidth - 0.5,
        y: e.clientY / window.innerHeight - 0.5,
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div
      className={`relative min-h-screen flex items-center justify-center overflow-hidden transition-all duration-500 ${
        isDark
          ? "bg-gradient-to-br from-[#02060E] via-[#2a0140] to-[#9303C5]"
          : "bg-gradient-to-br from-gray-50 to-gray-100"
      }`}
    >
      {/* ───────── Ambient background decoration ───────── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Floating blobs with pointer parallax */}
        <motion.div
          className={`absolute -top-32 -left-32 w-[28rem] h-[28rem] rounded-full blur-3xl ${
            isDark ? "bg-[#9303C5]/30" : "bg-purple-300/30"
          }`}
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          style={{
            transform: `translate3d(${mouse.x * 24}px, ${mouse.y * 24}px, 0)`,
          }}
        />
        <motion.div
          className={`absolute -bottom-40 -right-32 w-[32rem] h-[32rem] rounded-full blur-3xl ${
            isDark ? "bg-[#6b02b3]/25" : "bg-indigo-300/30"
          }`}
          animate={{
            x: [0, -25, 0],
            y: [0, 20, 0],
          }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          style={{
            transform: `translate3d(${mouse.x * -24}px, ${mouse.y * -24}px, 0)`,
          }}
        />

        {/* Fine grid overlay */}
        <div
          className={`absolute inset-0 ${
            isDark ? "opacity-[0.05]" : "opacity-[0.03]"
          }`}
          style={{
            backgroundImage:
              "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
            backgroundSize: "42px 42px",
            maskImage:
              "radial-gradient(ellipse at center, black 25%, transparent 70%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, black 25%, transparent 70%)",
          }}
        />

        {/* Floating particles with cursor parallax */}
        {[
          { top: "18%", left: "12%", size: 4, delay: 0, depth: 12 },
          { top: "32%", left: "82%", size: 6, delay: 1, depth: -18 },
          { top: "72%", left: "18%", size: 3, delay: 2, depth: 22 },
          { top: "84%", left: "78%", size: 5, delay: 1.5, depth: -14 },
          { top: "48%", left: "48%", size: 3, delay: 2.5, depth: 8 },
        ].map((dot, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${
              isDark ? "bg-[#d8b4fe]/60" : "bg-purple-400/50"
            }`}
            style={{
              top: dot.top,
              left: dot.left,
              width: dot.size,
              height: dot.size,
              boxShadow: isDark
                ? "0 0 12px rgba(216, 180, 254, 0.8)"
                : "0 0 12px rgba(168, 85, 247, 0.6)",
              transform: `translate3d(${mouse.x * dot.depth}px, ${
                mouse.y * dot.depth
              }px, 0)`,
            }}
            animate={{
              y: [0, -18, 0],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 6 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: dot.delay,
            }}
          />
        ))}
      </div>

      {/* ───────── Main card ───────── */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`relative text-center p-8 sm:p-10 rounded-3xl max-w-lg mx-4 backdrop-blur-xl transition-all duration-500 overflow-hidden ${
          isDark
            ? "bg-[#02060E]/80 border border-[#9303C5]/30 shadow-[0_20px_60px_-20px_rgba(147,3,197,0.5)]"
            : "bg-white border border-gray-100 shadow-[0_20px_60px_-20px_rgba(99,86,215,0.25)]"
        }`}
      >
        {/* Top gradient hairline */}
        <div
          className={`absolute inset-x-12 -top-px h-px ${
            isDark
              ? "bg-gradient-to-r from-transparent via-[#9303C5] to-transparent"
              : "bg-gradient-to-r from-transparent via-purple-300 to-transparent"
          }`}
        />

        {/* Ambient corner glows */}
        <div
          className={`absolute -top-16 -right-16 w-40 h-40 rounded-full blur-3xl pointer-events-none ${
            isDark ? "bg-[#9303C5]/20" : "bg-purple-200/40"
          }`}
        />
        <div
          className={`absolute -bottom-16 -left-16 w-40 h-40 rounded-full blur-3xl pointer-events-none ${
            isDark ? "bg-[#6b02b3]/15" : "bg-indigo-200/30"
          }`}
        />

        {/* ───────── 404 Hero Number ───────── */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="relative inline-block"
        >
          <h1
            className={`text-[7rem] sm:text-[9rem] leading-none font-black tracking-tighter mb-4 relative ${
              isDark
                ? "bg-gradient-to-br from-[#9303C5] via-[#d8b4fe] to-[#9303C5] bg-clip-text text-transparent"
                : "bg-gradient-to-br from-purple-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent"
            }`}
            style={{
              backgroundSize: "200% 100%",
            }}
          >
            404
          </h1>

          {/* Glow ring behind the number */}
          <div
            className={`absolute inset-0 -z-10 rounded-full blur-3xl ${
              isDark ? "bg-[#9303C5]/40" : "bg-purple-300/40"
            }`}
          />

          {/* Alert icon — animated wiggle */}
          <motion.div
            animate={{
              rotate: [0, 12, -12, 0],
              scale: [1, 1.15, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: 3,
              repeatDelay: 2,
              ease: "easeInOut",
            }}
            className="absolute top-2 -right-2 sm:top-4 sm:right-2"
          >
            <div
              className={`relative p-2 rounded-full backdrop-blur-sm ${
                isDark
                  ? "bg-gradient-to-br from-[#9303C5]/30 to-[#6b02b3]/20 border border-[#d8b4fe]/40"
                  : "bg-gradient-to-br from-red-50 to-rose-100 border border-red-200"
              }`}
            >
              <AlertCircle
                className={`h-6 w-6 ${isDark ? "text-[#f0e6ff]" : "text-red-500"}`}
                strokeWidth={2.4}
              />
            </div>
          </motion.div>
        </motion.div>

        {/* ───────── Message ───────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          {/* Icon badge */}
          <div className="flex justify-center mb-4">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
              className={`relative w-14 h-14 rounded-2xl flex items-center justify-center border overflow-hidden ${
                isDark
                  ? "bg-gradient-to-br from-[#9303C5]/40 to-[#2a0140]/60 border-[#d8b4fe]/30"
                  : "bg-gradient-to-br from-purple-100 to-indigo-100 border-purple-200"
              }`}
            >
              {/* Top glass highlight */}
              <span className="absolute inset-x-2 top-0 h-px bg-white/40" />
              <Compass
                className={`relative h-6 w-6 ${
                  isDark ? "text-[#f0e6ff]" : "text-purple-600"
                }`}
                strokeWidth={2.4}
              />
            </motion.div>
          </div>

          <h2
            className={`text-2xl sm:text-3xl font-bold mb-2 tracking-tight ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Page Not Found
          </h2>
          <p
            className={`mb-6 text-sm sm:text-base max-w-sm mx-auto leading-relaxed ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            The page you're looking for doesn't exist or has been moved to a
            different location.
          </p>

          {/* Path info (debug helper) */}
          <div
            className={`mb-6 p-3 rounded-xl text-xs sm:text-sm font-mono flex items-center gap-2 justify-center overflow-hidden ${
              isDark
                ? "bg-[#2a0140]/40 text-gray-400 border border-[#9303C5]/20"
                : "bg-gray-50 text-gray-600 border border-gray-200"
            }`}
          >
            <Search
              className={`h-3.5 w-3.5 shrink-0 ${
                isDark ? "text-[#d8b4fe]" : "text-purple-500"
              }`}
              strokeWidth={2.4}
            />
            <span className="opacity-70 shrink-0">Attempted path:</span>
            <span
              className={`truncate font-semibold ${
                isDark ? "text-[#d8b4fe]" : "text-gray-800"
              }`}
            >
              {location.pathname}
            </span>
          </div>
        </motion.div>

        {/* ───────── Action buttons ───────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          {/* Primary — Go to Dashboard */}
          <motion.a
            href="/"
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className={`group relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold overflow-hidden transition-all duration-300 ${
              isDark
                ? "bg-gradient-to-r from-[#9303C5] to-[#6b02b3] text-white shadow-lg shadow-[#9303C5]/30"
                : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30"
            }`}
          >
            {/* Shine sweep */}
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            {/* Inner highlight */}
            <span className="absolute inset-x-0 top-0 h-px bg-white/40" />
            <Home className="relative h-4 w-4" strokeWidth={2.4} />
            <span className="relative">Go to Dashboard</span>
          </motion.a>

          {/* Secondary — Go Back */}
          <motion.button
            onClick={() => window.history.back()}
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className={`group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 border ${
              isDark
                ? "border-[#9303C5]/40 text-[#d8b4fe] bg-[#02060E]/40 hover:bg-[#2a0140]/60 hover:border-[#9303C5]/70"
                : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400"
            }`}
          >
            <ArrowLeft
              className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
              strokeWidth={2.4}
            />
            Go Back
          </motion.button>
        </motion.div>

        {/* ───────── Help footer ───────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className={`mt-8 pt-5 border-t text-xs flex items-center justify-center gap-2 ${
            isDark
              ? "border-[#9303C5]/20 text-gray-500"
              : "border-gray-200 text-gray-500"
          }`}
        >
          <span className="relative flex w-1.5 h-1.5">
            <span
              className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${
                isDark ? "bg-[#d8b4fe]" : "bg-purple-400"
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-1.5 w-1.5 ${
                isDark ? "bg-[#d8b4fe]" : "bg-purple-400"
              }`}
            />
          </span>
          Need help? Contact your administrator
        </motion.div>
      </motion.div>

      {/* ───────── Decorative sparkles ───────── */}
      <motion.div
        className="pointer-events-none absolute top-[18%] left-[12%] opacity-40"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <Sparkles
          className={`h-4 w-4 ${isDark ? "text-[#d8b4fe]" : "text-purple-400"}`}
          strokeWidth={2}
        />
      </motion.div>
      <motion.div
        className="pointer-events-none absolute bottom-[15%] right-[10%] opacity-40"
        animate={{ rotate: -360 }}
        transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
      >
        <Sparkles
          className={`h-5 w-5 ${isDark ? "text-[#d8b4fe]" : "text-purple-400"}`}
          strokeWidth={2}
        />
      </motion.div>
    </div>
  );
};

export default NotFound;