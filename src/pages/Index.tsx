// src/pages/Index.tsx - Elevated visuals, same theme
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import LoginForm from "@/components/LoginForm";
import ParticipantDashboard from "@/components/ParticipantDashboard";
import EmployeeDashboard from "@/components/EmployeeDashboard";
import AdminDashboard from "@/components/AdminDashboard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "@/contexts/ThemeContext";
import {
  LogOut,
  User,
  Briefcase,
  Shield,
  Sparkles,
  Activity,
  Zap,
} from "lucide-react";

const Index = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [showLogin, setShowLogin] = useState(true);
  const { theme } = useTheme();
  const { toast } = useToast();

  const isDark = theme === "dark";

  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      setShowLogin(false);

      toast({
        title: "Welcome Back!",
        description: `Logged in as ${JSON.parse(savedUser).name}`,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setShowLogin(false);
    localStorage.setItem("currentUser", JSON.stringify(user));

    toast({
      title: "Login Successful",
      description: `Welcome, ${user.name}!`,
    });
  };

  const handleLogout = () => {
    const userName = currentUser?.name;
    setCurrentUser(null);
    setShowLogin(true);
    localStorage.removeItem("currentUser");

    toast({
      title: "Logged Out",
      description: `Goodbye, ${userName}!`,
    });
  };

  const getRoleIcon = (role, size = "h-3 w-3") => {
    switch (role) {
      case "admin":
        return <Shield className={`${size} mr-1`} strokeWidth={2.4} />;
      case "employee":
        return <Briefcase className={`${size} mr-1`} strokeWidth={2.4} />;
      default:
        return <User className={`${size} mr-1`} strokeWidth={2.4} />;
    }
  };

  const getRoleAccent = (role) => {
    switch (role) {
      case "admin":
        return "from-red-500/30 to-orange-500/30";
      case "employee":
        return "from-blue-500/30 to-indigo-500/30";
      default:
        return "from-purple-500/30 to-pink-500/30";
    }
  };

  const getRoleLabelColor = (role) => {
    switch (role) {
      case "admin":
        return isDark ? "text-orange-300" : "text-orange-600";
      case "employee":
        return isDark ? "text-indigo-300" : "text-indigo-600";
      default:
        return isDark ? "text-[#d8b4fe]" : "text-purple-600";
    }
  };

  /* ───────────── AUTH VIEW ───────────── */
  if (showLogin) {
    return (
      <div className={`min-h-screen w-full ${isDark ? "dark" : ""}`}>
        <LoginForm onLogin={handleLogin} />
      </div>
    );
  }

  /* ───────────── DASHBOARD VIEW ───────────── */
  return (
    <div className={`min-h-screen ${isDark ? "dark" : ""}`}>
      <div
        className={`min-h-screen relative transition-all duration-500 ${
          isDark
            ? "bg-gradient-to-br from-[#02060E] via-[#2a0140] to-[#9303C5]"
            : "bg-gradient-to-br from-slate-50 via-white to-slate-100"
        }`}
      >
        {/* ───────── Ambient background decoration ───────── */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <motion.div
            className={`absolute -top-40 -left-40 w-[32rem] h-[32rem] rounded-full blur-3xl ${
              isDark ? "bg-[#9303C5]/20" : "bg-purple-200/30"
            }`}
            animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className={`absolute -bottom-40 -right-40 w-[36rem] h-[36rem] rounded-full blur-3xl ${
              isDark ? "bg-[#6b02b3]/20" : "bg-indigo-200/30"
            }`}
            animate={{ x: [0, -20, 0], y: [0, 15, 0] }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          />
          <div
            className={`absolute inset-0 ${
              isDark ? "opacity-[0.04]" : "opacity-[0.03]"
            }`}
            style={{
              backgroundImage:
                "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
              backgroundSize: "42px 42px",
              maskImage:
                "radial-gradient(ellipse at center, black 30%, transparent 75%)",
              WebkitMaskImage:
                "radial-gradient(ellipse at center, black 30%, transparent 75%)",
            }}
          />
        </div>

        {/* ───────── Header ───────── */}
        <motion.header
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className={`sticky top-0 z-50 backdrop-blur-xl shadow-lg border-b relative overflow-hidden transition-colors duration-300 ${
            isDark
              ? "bg-[#02060E]/85 border-[#9303C5]/30 text-white"
              : "bg-white/85 border-purple-200/60 text-slate-900"
          }`}
        >
          <div
            className={`absolute top-0 left-0 right-0 h-px ${
              isDark
                ? "bg-gradient-to-r from-transparent via-[#9303C5] to-transparent"
                : "bg-gradient-to-r from-transparent via-purple-400 to-transparent"
            }`}
          />

          <div
            className={`absolute -top-16 -left-16 w-40 h-40 rounded-full blur-3xl ${
              isDark ? "bg-[#9303C5]/30" : "bg-purple-300/40"
            }`}
          />
          <div
            className={`absolute -top-16 -right-16 w-40 h-40 rounded-full blur-3xl ${
              isDark ? "bg-pink-500/20" : "bg-indigo-300/40"
            }`}
          />

          <div className="relative max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            {/* Logo + Title */}
            <motion.div
              initial={{ x: -40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <motion.div
                className="relative"
                whileHover={{ scale: 1.08, rotate: -3 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <div
                  className={`absolute inset-0 rounded-full blur-xl ${
                    isDark ? "bg-[#9303C5]/60" : "bg-purple-400/50"
                  }`}
                />
                <img
                  src="/Transparent logo.png"
                  alt="FOSTIIMA Logo"
                  className={`relative h-12 w-12 object-contain ${
                    isDark
                      ? "drop-shadow-[0_0_10px_rgba(147,3,197,0.7)]"
                      : "drop-shadow-[0_4px_10px_rgba(147,3,197,0.35)]"
                  }`}
                />
              </motion.div>
              <div>
                <h1 className="text-lg sm:text-xl md:text-2xl font-semibold tracking-tight">
                  FOSTIIMA Stock Exchange
                </h1>
                <p
                  className={`text-[11px] sm:text-xs flex items-center gap-1.5 ${
                    isDark ? "text-gray-300" : "text-slate-500"
                  }`}
                >
                  <span className="relative flex w-1.5 h-1.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-400" />
                  </span>
                  Virtual Trading Platform · Live
                </p>
              </div>
            </motion.div>

            {/* User Info + Theme Toggle */}
            <motion.div
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-2 sm:gap-3"
            >
              <ThemeToggle />

              {/* User pill (desktop) */}
              <motion.div
                whileHover={{ scale: 1.03 }}
                className={`hidden sm:flex items-center gap-2 text-sm px-3.5 py-1.5 rounded-full backdrop-blur capitalize border relative overflow-hidden ${
                  isDark
                    ? "bg-white/10 border-white/20 text-white"
                    : "bg-white/70 border-purple-200 text-slate-800 shadow-sm"
                }`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${getRoleAccent(currentUser?.role)} opacity-50`}
                />
                <span className="relative flex items-center">
                  {getRoleIcon(currentUser?.role)}
                  <span className={getRoleLabelColor(currentUser?.role)}>
                    {currentUser?.role}
                  </span>
                  <span className="mx-1 opacity-40">·</span>
                  <span className="font-semibold truncate max-w-[120px]">
                    {currentUser?.name}
                  </span>
                </span>
              </motion.div>

              {/* Logout button */}
              <motion.div whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.04 }}>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className={`flex items-center gap-2 rounded-full transition-all duration-300 ${
                    isDark
                      ? "border-[#9303C5]/60 text-white bg-white/10 hover:bg-white/20 hover:border-[#b503f0] hover:shadow-[0_0_20px_rgba(147,3,197,0.4)]"
                      : "border-purple-300 text-purple-700 bg-white hover:bg-purple-50 hover:border-purple-500 hover:shadow-[0_0_20px_rgba(147,3,197,0.25)]"
                  }`}
                >
                  <LogOut className="h-4 w-4" strokeWidth={2.4} />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </motion.header>

        {/* ───────── Main content ───────── */}
        <motion.main
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative max-w-7xl mx-auto px-4 py-6 sm:py-8"
        >
          {/* ───────── Welcome banner ───────── */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className={`relative mb-7 overflow-hidden rounded-2xl border backdrop-blur-sm ${
              isDark
                ? "bg-[#2a0140]/40 border-[#9303C5]/30"
                : "bg-white/70 border-purple-100"
            }`}
          >
            {/* Left accent bar */}
            <div
              className={`absolute left-0 top-0 bottom-0 w-1 ${
                isDark
                  ? "bg-gradient-to-b from-[#9303C5] via-[#d8b4fe] to-[#9303C5]"
                  : "bg-gradient-to-b from-purple-500 via-purple-400 to-indigo-500"
              }`}
            />

            {/* Ambient corner glows */}
            <div
              className={`absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl ${
                isDark ? "bg-[#9303C5]/20" : "bg-purple-200/40"
              }`}
            />
            <div
              className={`absolute -bottom-12 -left-12 w-32 h-32 rounded-full blur-3xl ${
                isDark ? "bg-pink-500/15" : "bg-indigo-200/30"
              }`}
            />

            <div className="relative px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Left: Greeting */}
              <div className="flex items-center gap-3.5">
                <div
                  className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center border relative overflow-hidden ${
                    isDark
                      ? "bg-gradient-to-br from-[#9303C5]/40 to-[#2a0140]/60 border-[#d8b4fe]/30"
                      : "bg-gradient-to-br from-purple-100 to-indigo-100 border-purple-200"
                  }`}
                >
                  <Sparkles
                    className={`relative h-4.5 w-4.5 ${
                      isDark ? "text-[#f0e6ff]" : "text-purple-600"
                    }`}
                    strokeWidth={2.4}
                    style={{ width: 18, height: 18 }}
                  />
                  <span className="absolute inset-x-2 top-0 h-px bg-white/40" />
                </div>
                <div>
                  <p
                    className={`text-[10px] uppercase tracking-[0.18em] font-bold ${
                      isDark ? "text-gray-400" : "text-slate-500"
                    }`}
                  >
                    Welcome back
                  </p>
                  <p
                    className={`text-base sm:text-lg font-bold tracking-tight ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {currentUser?.name}
                  </p>
                </div>
              </div>

              {/* Right: Role indicator */}
              <div className="flex items-center gap-3 flex-wrap">
                <div
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-bold backdrop-blur-sm border ${
                    isDark
                      ? "bg-[#2a0140]/60 text-[#d8b4fe] border-[#9303C5]/40"
                      : "bg-purple-50 text-purple-700 border-purple-200"
                  }`}
                >
                  <span className="relative flex w-2 h-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75 animate-ping" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                  </span>
                  <span className="flex items-center gap-1 uppercase tracking-wider">
                    {getRoleIcon(currentUser?.role)}
                    {currentUser?.role} Mode
                  </span>
                </div>

                <div
                  className={`hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm border ${
                    isDark
                      ? "bg-[#2a0140]/40 text-gray-400 border-[#9303C5]/30"
                      : "bg-white/70 text-slate-500 border-purple-100"
                  }`}
                >
                  <Activity className="h-3 w-3" strokeWidth={2.4} />
                  Session Active
                </div>
              </div>
            </div>
          </motion.div>

          {/* Animated role-based dashboard */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentUser?.role}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {currentUser?.role === "participant" && (
                <ParticipantDashboard user={currentUser} />
              )}
              {currentUser?.role === "employee" && (
                <EmployeeDashboard user={currentUser} />
              )}
              {currentUser?.role === "admin" && (
                <AdminDashboard user={currentUser} />
              )}
            </motion.div>
          </AnimatePresence>
        </motion.main>

        {/* ───────── Footer ───────── */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className={`relative border-t mt-12 ${
            isDark ? "border-[#9303C5]/30" : "border-slate-200"
          }`}
        >
          <div
            className={`absolute top-0 left-0 right-0 h-px ${
              isDark
                ? "bg-gradient-to-r from-transparent via-[#9303C5]/50 to-transparent"
                : "bg-gradient-to-r from-transparent via-purple-300/60 to-transparent"
            }`}
          />

          <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div
              className={`flex items-center gap-3 ${
                isDark ? "text-gray-500" : "text-slate-500"
              }`}
            >
              <div
                className={`relative w-8 h-8 rounded-lg flex items-center justify-center border overflow-hidden ${
                  isDark
                    ? "bg-gradient-to-br from-[#9303C5]/40 to-[#2a0140]/60 border-[#9303C5]/50"
                    : "bg-gradient-to-br from-purple-100 to-indigo-100 border-purple-200"
                }`}
              >
                <Zap
                  className={`h-3.5 w-3.5 ${
                    isDark ? "text-[#f0e6ff]" : "text-purple-600"
                  }`}
                  strokeWidth={2.6}
                />
              </div>
              <div>
                <p className="flex items-center gap-1.5 flex-wrap">
                  © {new Date().getFullYear()}{" "}
                  <span
                    className={`font-semibold ${
                      isDark ? "text-gray-300" : "text-slate-700"
                    }`}
                  >
                    Finance Committee
                  </span>{" "}
                  <span className="opacity-40">·</span> FOSTIIMA Chapter
                </p>
                <p
                  className={`text-[10px] mt-0.5 opacity-70 ${
                    isDark ? "text-gray-500" : "text-slate-400"
                  }`}
                >
                  A virtual trading simulator for FOSTIIMA
                </p>
              </div>
            </div>

            <div
              className={`flex items-center gap-3 ${
                isDark ? "text-gray-500" : "text-slate-500"
              }`}
            >
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${
                  isDark
                    ? "bg-[#2a0140]/40 border-[#9303C5]/30 text-gray-300"
                    : "bg-white border-purple-100 text-slate-600"
                }`}
              >
                <span className="relative flex w-1.5 h-1.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75 animate-ping" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
                </span>
                <span className="font-semibold">All systems operational</span>
              </span>
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
  );
};

export default Index;