// src/components/MostTradedPortfolio.tsx
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  Award,
  BarChart3,
  Repeat,
  Crown,
} from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import { useToast } from "@/hooks/use-toast";
import { io } from "socket.io-client";
import { useTheme } from "@/contexts/ThemeContext";
import { motion } from "framer-motion";

const socket = io(import.meta.env.VITE_SOCKET_URL);

type MostTradedParticipant = {
  participantId: string;
  name: string;
  totalTrades: number;
  totalQuantity: number;
  totalTurnover: number;
  topShare: string;
  topShareQuantity: number;
};

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

const MostTradedPortfolio = () => {
  const [data, setData] = useState<MostTradedParticipant[]>([]);
  const { toast } = useToast();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const fetchData = async () => {
    try {
      const res = await axiosInstance.get<MostTradedParticipant[]>(
        "/admin/analytics/most-traded",
      );
      setData(res.data || []);
    } catch {
      toast({
        title: "Error",
        description: "Failed to load analytics",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchData();
    socket.on("trade:executed", fetchData);

    return () => {
      socket.off("trade:executed", fetchData);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ───── Shared theme helpers ───── */
  const mutedText = isDark ? "text-gray-400" : "text-gray-500";
  const strongText = isDark ? "text-white" : "text-gray-900";
  const priceText = isDark ? "text-[#d8b4fe]" : "text-purple-700";
  const tableHeaderClass = isDark
    ? "bg-[#2a0140]/40 border-b border-[#9303C5]/20"
    : "bg-gray-50/80 border-b border-gray-100";

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
          icon={Activity}
          title="Most Traded Portfolios"
          isDark={isDark}
          badge={
            <span
              className={`inline-flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-widest border ${
                isDark
                  ? "bg-green-500/15 text-green-300 border-green-500/40"
                  : "bg-green-50 text-green-700 border-green-200"
              }`}
            >
              <span className="relative flex w-1.5 h-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
              </span>
              Live Analytics
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
                  className={`px-5 py-4 text-right text-[11px] font-bold uppercase tracking-wider ${mutedText}`}
                >
                  Trades
                </th>
                <th
                  className={`px-5 py-4 text-right text-[11px] font-bold uppercase tracking-wider ${mutedText}`}
                >
                  Quantity
                </th>
                <th
                  className={`px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider ${mutedText}`}
                >
                  Top Share
                </th>
                <th
                  className={`px-5 py-4 text-right text-[11px] font-bold uppercase tracking-wider ${mutedText}`}
                >
                  Turnover
                </th>
              </tr>
            </thead>

            <tbody>
              {data.map((p, i) => {
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
                            transition={{ delay: i * 0.05 + 0.2, type: "spring", stiffness: 260 }}
                            className="relative"
                          >
                            <span className="text-2xl drop-shadow">👑</span>
                            <motion.span
                              animate={{ scale: [1, 1.15, 1] }}
                              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                              className="absolute -top-1 -right-2 text-xs"
                            >
                              ⭐
                            </motion.span>
                          </motion.span>
                        )}
                        {i === 1 && <span className="text-2xl drop-shadow">🥈</span>}
                        {i === 2 && <span className="text-2xl drop-shadow">🥉</span>}
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
                        {/* Avatar initial */}
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

                    {/* Trades */}
                    <td className="px-5 py-4 text-right">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border tabular-nums ${
                          isDark
                            ? "bg-[#9303C5]/20 text-[#e9d5ff] border-[#d8b4fe]/25"
                            : "bg-purple-50 text-purple-700 border-purple-200"
                        }`}
                      >
                        <Repeat className="h-3 w-3" strokeWidth={2.6} />
                        {p.totalTrades}
                      </span>
                    </td>

                    {/* Quantity */}
                    <td
                      className={`px-5 py-4 text-right text-sm font-semibold tabular-nums ${strongText}`}
                    >
                      {p.totalQuantity.toLocaleString()}
                    </td>

                    {/* Top Share */}
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-0.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border w-fit ${
                            isDark
                              ? "bg-[#2a0140]/60 text-[#e9d5ff] border-[#d8b4fe]/20"
                              : "bg-gray-50 text-gray-700 border-gray-200"
                          }`}
                        >
                          <BarChart3 className="h-3 w-3" strokeWidth={2.6} />
                          {p.topShare}
                        </span>
                        <span
                          className={`text-[10px] tabular-nums pl-1 ${mutedText}`}
                        >
                          {p.topShareQuantity.toLocaleString()} units
                        </span>
                      </div>
                    </td>

                    {/* Turnover */}
                    <td className="px-5 py-4 text-right">
                      <span
                        className={`text-base font-bold tabular-nums ${
                          isFirst
                            ? isDark
                              ? "text-amber-300"
                              : "text-amber-600"
                            : priceText
                        }`}
                      >
                        ₹{p.totalTurnover.toLocaleString()}
                      </span>
                    </td>
                  </motion.tr>
                );
              })}

              {!data.length && (
                <tr>
                  <td colSpan={6} className="p-14 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div
                        className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl border ${
                          isDark
                            ? "bg-[#9303C5]/20 border-[#d8b4fe]/25"
                            : "bg-purple-50 border-purple-200"
                        }`}
                      >
                        <TrendingUp
                          className={`h-6 w-6 ${
                            isDark ? "text-[#f0e6ff]" : "text-purple-500"
                          }`}
                          strokeWidth={2.4}
                        />
                      </div>
                      <p className={`text-sm font-medium ${strongText}`}>
                        No trade data available
                      </p>
                      <p className={`text-xs ${mutedText}`}>
                        Trades will appear here once participants start trading
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

export default MostTradedPortfolio;