// src/components/MostDiversifiedPortfolio.tsx
import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  TrendingDown,
  TrendingUp,
  BarChart3,
  PieChart,
  Shield,
  Target,
  Layers,
  Percent,
} from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";

// ---------------- TYPES ----------------

type DiversifiedParticipant = {
  participantId: string;
  name: string;
  uniqueShares: number;
  totalValue: number;
  maxConcentration: number; // 0 - 1
};

// ---------------- SECTION HEADER ----------------

const SectionHeader = ({
  icon: Icon,
  title,
  badge,
  isDark,
}: {
  icon: React.ElementType;
  title: string;
  badge?: React.ReactNode;
  isDark: boolean;
}) => (
  <div className="flex items-center gap-3.5 min-w-0">
    <div className="relative shrink-0">
      <div
        className={`absolute -inset-1 rounded-2xl blur-lg ${
          isDark ? "bg-[#9303C5]/40" : "bg-purple-300/60"
        }`}
      />
      <div
        className={`relative w-11 h-11 rounded-2xl flex items-center justify-center border overflow-hidden ${
          isDark
            ? "bg-gradient-to-br from-[#9303C5]/50 via-[#6b02b3]/40 to-[#2a0140]/70 border-[#d8b4fe]/30"
            : "bg-gradient-to-br from-purple-100 via-purple-50 to-indigo-100 border-purple-200"
        }`}
      >
        <span className="absolute inset-x-2 top-0 h-px bg-white/40" />
        <span
          className={`absolute -top-3 -right-3 w-8 h-8 rounded-full blur-md ${
            isDark ? "bg-[#d8b4fe]/30" : "bg-purple-300/50"
          }`}
        />
        <Icon
          className={`relative h-5 w-5 ${
            isDark ? "text-[#f0e6ff]" : "text-purple-600"
          }`}
          strokeWidth={2.4}
        />
      </div>
    </div>
    <div className="flex items-center gap-2.5 flex-wrap min-w-0">
      <h3
        className={`text-lg sm:text-xl font-bold tracking-tight ${
          isDark ? "text-white" : "text-gray-900"
        }`}
      >
        {title}
      </h3>
      {badge}
    </div>
  </div>
);

// ---------------- COMPONENT ----------------

const MostDiversifiedPortfolio = () => {
  const [data, setData] = useState<DiversifiedParticipant[]>([]);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    axiosInstance.get("/admin/analytics/most-diversified").then((res) => {
      const sorted = [...(res.data || [])].sort((a, b) => {
        // 1️⃣ More unique stocks
        if (b.uniqueShares !== a.uniqueShares) {
          return b.uniqueShares - a.uniqueShares;
        }
        // 2️⃣ Lower max concentration (better spread)
        if (a.maxConcentration !== b.maxConcentration) {
          return a.maxConcentration - b.maxConcentration;
        }
        // 3️⃣ Higher total portfolio value
        if (b.totalValue !== a.totalValue) {
          return b.totalValue - a.totalValue;
        }
        // 4️⃣ Final fallback (stable order)
        return a.participantId.localeCompare(b.participantId);
      });
      setData(sorted);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ───── Concentration helpers — now theme aware ───── */
  const getConcentrationStyle = (percentage: number) => {
    if (percentage < 30) {
      return {
        label: "Well Diversified",
        text: isDark ? "text-emerald-300" : "text-emerald-600",
        bar: isDark
          ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
          : "bg-gradient-to-r from-emerald-500 to-emerald-600",
        pill: isDark
          ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
          : "bg-emerald-50 text-emerald-700 border-emerald-200",
        dot: "bg-emerald-500",
      };
    }
    if (percentage < 50) {
      return {
        label: "Moderate",
        text: isDark ? "text-amber-300" : "text-amber-600",
        bar: isDark
          ? "bg-gradient-to-r from-amber-400 to-yellow-500"
          : "bg-gradient-to-r from-amber-500 to-yellow-500",
        pill: isDark
          ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
          : "bg-amber-50 text-amber-700 border-amber-200",
        dot: "bg-amber-500",
      };
    }
    if (percentage < 70) {
      return {
        label: "Concentrated",
        text: isDark ? "text-orange-300" : "text-orange-600",
        bar: isDark
          ? "bg-gradient-to-r from-orange-400 to-orange-500"
          : "bg-gradient-to-r from-orange-500 to-orange-600",
        pill: isDark
          ? "bg-orange-500/15 text-orange-300 border-orange-500/30"
          : "bg-orange-50 text-orange-700 border-orange-200",
        dot: "bg-orange-500",
      };
    }
    return {
      label: "Highly Concentrated",
      text: isDark ? "text-red-300" : "text-red-600",
      bar: isDark
        ? "bg-gradient-to-r from-red-400 to-rose-500"
        : "bg-gradient-to-r from-red-500 to-rose-600",
      pill: isDark
        ? "bg-red-500/15 text-red-300 border-red-500/30"
        : "bg-red-50 text-red-700 border-red-200",
      dot: "bg-red-500",
    };
  };

  /* ───── Shared theme helpers ───── */
  const mutedText = isDark ? "text-gray-400" : "text-gray-500";
  const strongText = isDark ? "text-white" : "text-gray-900";
  const priceText = isDark ? "text-[#d8b4fe]" : "text-purple-700";
  const tableHeaderClass = isDark
    ? "bg-[#2a0140]/40 border-b border-[#9303C5]/20"
    : "bg-gray-50/80 border-b border-gray-100";

  const totalStocksAcrossAll = data.reduce((sum, p) => sum + p.uniqueShares, 0);

  return (
    <Card
      className={`relative rounded-2xl border overflow-hidden transition-all duration-300 ${
        isDark
          ? "bg-[#02060E]/80 backdrop-blur-md border-[#9303C5]/30 shadow-[0_10px_40px_-15px_rgba(147,3,197,0.4)]"
          : "bg-white border-gray-100 shadow-[0_8px_30px_-15px_rgba(99,86,215,0.15)]"
      }`}
    >
      {/* Top gradient hairline */}
      <div
        className={`absolute inset-x-10 -top-px h-px ${
          isDark
            ? "bg-gradient-to-r from-transparent via-[#9303C5] to-transparent"
            : "bg-gradient-to-r from-transparent via-purple-300 to-transparent"
        }`}
      />

      <CardHeader
        className={`relative border-b ${
          isDark ? "border-[#9303C5]/20" : "border-gray-100"
        }`}
      >
        <SectionHeader
          icon={PieChart}
          title="Most Diversified Portfolios"
          isDark={isDark}
          badge={
            <span
              className={`inline-flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-widest border ${
                isDark
                  ? "bg-[#9303C5]/25 text-[#e9d5ff] border-[#d8b4fe]/25"
                  : "bg-purple-50 text-purple-700 border-purple-200"
              }`}
            >
              <Layers className="h-3 w-3" strokeWidth={2.6} />
              Diversification Score
            </span>
          }
        />
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={tableHeaderClass}>
                <th
                  className={`px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider ${mutedText}`}
                >
                  Rank
                </th>
                <th
                  className={`px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider ${mutedText}`}
                >
                  Participant
                </th>
                <th
                  className={`px-5 py-4 text-center text-[11px] font-bold uppercase tracking-wider ${mutedText}`}
                >
                  Stocks
                </th>
                <th
                  className={`px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider ${mutedText}`}
                >
                  Max Exposure
                </th>
                <th
                  className={`px-5 py-4 text-right text-[11px] font-bold uppercase tracking-wider ${mutedText}`}
                >
                  Portfolio Value
                </th>
              </tr>
            </thead>

            <tbody>
              <AnimatePresence>
                {data.map((p, i) => {
                  const concentrationPercent = p.maxConcentration * 100;
                  const concentration = getConcentrationStyle(
                    concentrationPercent,
                  );
                  const isFirst = i === 0;
                  const isTopThree = i < 3;

                  return (
                    <motion.tr
                      key={p.participantId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className={`
                        border-b transition-all duration-200
                        ${
                          isTopThree
                            ? isDark
                              ? "border-[#9303C5]/10 bg-gradient-to-r from-[#9303C5]/[0.06] via-transparent to-transparent hover:from-[#9303C5]/[0.12]"
                              : "border-gray-100 bg-gradient-to-r from-purple-50/60 via-transparent to-transparent hover:from-purple-50"
                            : isDark
                              ? "border-[#9303C5]/10 hover:bg-[#2a0140]/30"
                              : "border-gray-100 hover:bg-gray-50"
                        }
                      `}
                    >
                      {/* Rank */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {i === 0 && (
                            <motion.span
                              initial={{ scale: 0, rotate: -30 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{
                                delay: i * 0.05 + 0.2,
                                type: "spring",
                                stiffness: 260,
                              }}
                              className="relative"
                            >
                              <span className="text-2xl drop-shadow">👑</span>
                              <motion.span
                                animate={{ scale: [1, 1.15, 1] }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  ease: "easeInOut",
                                }}
                                className="absolute -top-1 -right-2 text-xs"
                              >
                                ⭐
                              </motion.span>
                            </motion.span>
                          )}
                          {i === 1 && (
                            <span className="text-2xl drop-shadow">🥈</span>
                          )}
                          {i === 2 && (
                            <span className="text-2xl drop-shadow">🥉</span>
                          )}
                          {i > 2 && (
                            <span
                              className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold tabular-nums border ${
                                isDark
                                  ? "bg-[#2a0140] text-gray-300 border-[#9303C5]/20"
                                  : "bg-gray-100 text-gray-600 border-gray-200"
                              }`}
                            >
                              {i + 1}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Participant */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold border relative overflow-hidden ${
                              isTopThree
                                ? isDark
                                  ? "bg-gradient-to-br from-[#9303C5]/40 to-[#6b02b3]/30 text-[#f0e6ff] border-[#d8b4fe]/30"
                                  : "bg-gradient-to-br from-purple-100 to-indigo-100 text-purple-600 border-purple-200"
                                : isDark
                                  ? "bg-[#2a0140]/60 text-gray-300 border-[#9303C5]/20"
                                  : "bg-gray-50 text-gray-600 border-gray-200"
                            }`}
                          >
                            <span className="absolute inset-x-1 top-0 h-px bg-white/30" />
                            {p.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div
                              className={`font-semibold text-sm truncate ${strongText}`}
                            >
                              {p.name}
                            </div>
                            <div
                              className={`text-[11px] font-mono ${mutedText} mt-0.5`}
                            >
                              {p.participantId}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Unique Stocks */}
                      <td className="px-5 py-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border tabular-nums ${
                            isDark
                              ? "bg-[#9303C5]/20 text-[#e9d5ff] border-[#d8b4fe]/25"
                              : "bg-purple-50 text-purple-700 border-purple-200"
                          }`}
                        >
                          <BarChart3 className="h-3 w-3" strokeWidth={2.6} />
                          {p.uniqueShares}
                        </span>
                      </td>

                      {/* Max Exposure */}
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-1.5 min-w-[180px]">
                          {/* Concentration pill */}
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border w-fit ${concentration.pill}`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${concentration.dot}`}
                            />
                            {concentration.label}
                          </span>

                          {/* Progress bar + percent */}
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`flex-1 h-2 rounded-full overflow-hidden ${
                                isDark ? "bg-[#2a0140]" : "bg-gray-200"
                              }`}
                            >
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{
                                  width: `${concentrationPercent}%`,
                                }}
                                transition={{
                                  delay: i * 0.05 + 0.3,
                                  duration: 0.6,
                                  ease: [0.22, 1, 0.36, 1],
                                }}
                                className={`h-full rounded-full ${concentration.bar}`}
                              />
                            </div>
                            <span
                              className={`text-[11px] font-bold tabular-nums shrink-0 ${concentration.text}`}
                            >
                              {concentrationPercent.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Total Value */}
                      <td className="px-5 py-4 text-right">
                        <div
                          className={`text-base font-bold tabular-nums ${
                            isFirst
                              ? isDark
                                ? "text-amber-300"
                                : "text-amber-600"
                              : priceText
                          }`}
                        >
                          ₹{p.totalValue.toLocaleString()}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>

              {!data.length && (
                <tr>
                  <td colSpan={5} className="p-14 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div
                        className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl border ${
                          isDark
                            ? "bg-[#9303C5]/20 border-[#d8b4fe]/25"
                            : "bg-purple-50 border-purple-200"
                        }`}
                      >
                        <Shield
                          className={`h-6 w-6 ${
                            isDark ? "text-[#f0e6ff]" : "text-purple-500"
                          }`}
                          strokeWidth={2.4}
                        />
                      </div>
                      <p className={`text-sm font-medium ${strongText}`}>
                        No diversification data available
                      </p>
                      <p className={`text-xs ${mutedText}`}>
                        Portfolio data will appear once participants start trading
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default MostDiversifiedPortfolio;