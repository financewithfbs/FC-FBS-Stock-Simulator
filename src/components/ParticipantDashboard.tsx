// src/components/ParticipantDashboard.tsx
import React, { useEffect, useState, useMemo } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  Newspaper,
  IdCard,
  Activity,
  Sparkles,
  Award,
  Clock,
  ChevronDown,
  ChevronUp,
  Wallet,
  BarChart3,
} from "lucide-react";
import { io } from "socket.io-client";
import { toast } from "@/components/ui/use-toast";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";

const socket = io(import.meta.env.VITE_SOCKET_URL);

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ═══════════════════════════════════════════ */
/*              Section Header                 */
/* ═══════════════════════════════════════════ */
const SectionHeader = ({
  icon: Icon,
  title,
  badge,
  isDark,
  right,
}: {
  icon: React.ElementType;
  title: string;
  badge?: React.ReactNode;
  isDark: boolean;
  right?: React.ReactNode;
}) => (
  <div className="flex items-center justify-between flex-wrap gap-4">
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
    {right}
  </div>
);

/* ═══════════════════════════════════════════ */
/*              Stat Card                      */
/* ═══════════════════════════════════════════ */
const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  isDark,
  accent = "purple",
  valueClass,
  delay = 0,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ElementType;
  isDark: boolean;
  accent?: "purple" | "emerald" | "amber" | "blue";
  valueClass?: string;
  delay?: number;
}) => {
  const accentMap = {
    purple: {
      iconBg: isDark
        ? "from-[#9303C5]/40 to-[#6b02b3]/30 border-[#d8b4fe]/30"
        : "from-purple-100 to-indigo-100 border-purple-200",
      iconColor: isDark ? "text-[#f0e6ff]" : "text-purple-600",
      glow: isDark ? "bg-[#9303C5]/40" : "bg-purple-300/60",
    },
    emerald: {
      iconBg: isDark
        ? "from-emerald-500/30 to-emerald-600/20 border-emerald-400/30"
        : "from-emerald-100 to-green-100 border-emerald-200",
      iconColor: isDark ? "text-emerald-200" : "text-emerald-600",
      glow: isDark ? "bg-emerald-500/40" : "bg-emerald-300/60",
    },
    amber: {
      iconBg: isDark
        ? "from-amber-500/30 to-orange-500/20 border-amber-400/30"
        : "from-amber-100 to-orange-100 border-amber-200",
      iconColor: isDark ? "text-amber-200" : "text-amber-600",
      glow: isDark ? "bg-amber-500/40" : "bg-amber-300/60",
    },
    blue: {
      iconBg: isDark
        ? "from-blue-500/30 to-indigo-500/20 border-blue-400/30"
        : "from-blue-100 to-indigo-100 border-blue-200",
      iconColor: isDark ? "text-blue-200" : "text-blue-600",
      glow: isDark ? "bg-blue-500/40" : "bg-blue-300/60",
    },
  }[accent];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3 }}
      className="relative"
    >
      <Card
        className={`relative rounded-2xl border overflow-hidden transition-all duration-300 ${
          isDark
            ? "bg-[#02060E]/80 backdrop-blur-md border-[#9303C5]/30 shadow-[0_10px_40px_-15px_rgba(147,3,197,0.4)]"
            : "bg-white border-gray-100 shadow-[0_8px_30px_-15px_rgba(99,86,215,0.15)]"
        }`}
      >
        {/* Top gradient hairline */}
        <div
          className={`absolute inset-x-8 -top-px h-px ${
            isDark
              ? "bg-gradient-to-r from-transparent via-[#9303C5] to-transparent"
              : "bg-gradient-to-r from-transparent via-purple-300 to-transparent"
          }`}
        />

        {/* Ambient corner blob */}
        <div
          className={`absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl pointer-events-none ${
            isDark ? accentMap.glow : accentMap.glow
          } opacity-50`}
        />

        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative">
          <CardTitle
            className={`text-xs font-bold uppercase tracking-widest ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {title}
          </CardTitle>
          <div className="relative shrink-0">
            <div
              className={`absolute inset-0 rounded-xl blur-md ${accentMap.glow}`}
            />
            <div
              className={`relative w-9 h-9 rounded-xl flex items-center justify-center border overflow-hidden bg-gradient-to-br ${accentMap.iconBg}`}
            >
              <span className="absolute inset-x-1 top-0 h-px bg-white/40" />
              <Icon
                className={`relative h-4 w-4 ${accentMap.iconColor}`}
                strokeWidth={2.4}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative">
          <div
            className={`text-2xl sm:text-3xl font-bold tracking-tight tabular-nums ${
              valueClass ?? (isDark ? "text-white" : "text-gray-900")
            }`}
          >
            {value}
          </div>
          <p
            className={`text-xs mt-1.5 ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {subtitle}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const ParticipantDashboard = ({ user }) => {
  const { theme } = useTheme();
  const [shares, setShares] = useState([]);
  const [news, setNews] = useState([]);
  const [portfolio, setPortfolio] = useState({ balance: 0, holdings: [] });
  const [trades, setTrades] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [showAllNews, setShowAllNews] = useState(false);

  const fetchAll = async () => {
    const [newsRes, userRes] = await Promise.all([
      axiosInstance.get("/news"),
      axiosInstance.get(`/users/${user._id}`),
    ]);

    setNews(newsRes.data);
    setPortfolio({
      balance: userRes.data.balance || 0,
      holdings: userRes.data.holdings || [],
    });
    setTrades(userRes.data.trades || []);
  };

  useEffect(() => {
    if (!user?._id) return;
    fetchAll();
    fetchLeaderboard();

    socket.on("share:update", (updatedShare) => {
      setShares((prev) =>
        prev.some((s) => s._id === updatedShare._id)
          ? prev.map((s) => (s._id === updatedShare._id ? updatedShare : s))
          : [...prev, updatedShare],
      );
    });

    socket.on("user:update", (updatedUsers) => {
      const me = updatedUsers.find((u) => u._id === user._id);
      if (!me) return;
      setPortfolio({
        balance: me.balance,
        holdings: me.holdings,
      });
      setTrades(me.trades || []);
    });

    socket.on("share:delete", (id) => {
      setShares((prev) => prev.filter((s) => s._id !== id));
    });

    socket.on("share:add", (share) => {
      toast({
        title: "📈 New Share Added",
        description: `${share.name} listed at ₹${share.price}`,
      });
    });

    socket.on("market:status", ({ running }) => {
      toast({
        title: running ? "📊 Market Resumed" : "⛔ Market Paused",
      });
    });

    socket.on("news:delete", (deletedId) => {
      setNews((prev) => {
        if (!Array.isArray(prev)) return [];
        return prev.filter((n) => n._id !== deletedId);
      });
      toast({
        title: "🗑️ News Removed",
        description: "A news item was removed by admin",
      });
    });

    socket.on("news:new", (newsItem) => {
      toast({
        title: "📰 Breaking News",
        description: newsItem.headline,
      });
      setNews((prev) => [newsItem, ...prev]);
    });

    socket.on("leaderboard:update", (data) => {
      setLeaderboard(Array.isArray(data) ? data : []);
    });

    axiosInstance.get("/shares").then((res) => setShares(res.data));

    return () => {
      socket.off("share:update");
      socket.off("share:delete");
      socket.off("share:add");
      socket.off("news:new");
      socket.off("news:delete");
      socket.off("market:status");
      socket.off("user:update");
      socket.off("leaderboard:update");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchLeaderboard = async () => {
    try {
      const res = await axiosInstance.get("/users/leaderboard");
      setLeaderboard(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
    }
  };

  const portfolioValue = useMemo(() => {
    const holdingsValue = portfolio.holdings.reduce((total, holding) => {
      const share = shares.find((s) => s.name === holding.symbol);
      return total + (share ? share.price * holding.quantity : 0);
    }, 0);
    return portfolio.balance + holdingsValue;
  }, [portfolio.balance, portfolio.holdings, shares]);

  const totalInvested = useMemo(() => {
    return portfolio.holdings.reduce(
      (total, holding) => total + holding.avgPrice * holding.quantity,
      0,
    );
  }, [portfolio.holdings]);

  const totalProfitLoss = useMemo(() => {
    return portfolio.holdings.reduce((total, holding) => {
      const share = shares.find((s) => s.name === holding.symbol);
      if (!share) return total;
      return total + (share.price - holding.avgPrice) * holding.quantity;
    }, 0);
  }, [portfolio.holdings, shares]);

  const calculateProfitLoss = (holding) => {
    const share = shares.find((s) => s.name === holding.symbol);
    if (!share) return 0;
    return (share.price - holding.avgPrice) * holding.quantity;
  };

  const getRankIcon = (index) => {
    if (index === 0) return "👑";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return null;
  };

  if (!user) return <div>Loading dashboard...</div>;

  const mid = Math.ceil(shares.length / 2);
  const leftShares = shares.slice(0, mid);
  const rightShares = shares.slice(mid);
  const isDark = theme === "dark";

  const displayedNews = showAllNews ? news : news.slice(0, 5);
  const hasMoreNews = news.length > 5;

  /* ───── Shared theme helpers ───── */
  const cardShell = `relative rounded-2xl border transition-all duration-300 overflow-hidden ${
    isDark
      ? "bg-[#02060E]/80 backdrop-blur-md border-[#9303C5]/30 shadow-[0_10px_40px_-15px_rgba(147,3,197,0.4)]"
      : "bg-white border-gray-100 shadow-[0_8px_30px_-15px_rgba(99,86,215,0.15)]"
  }`;

  const cardHeaderStrip = `relative border-b ${
    isDark ? "border-[#9303C5]/20" : "border-gray-100"
  }`;

  const mutedText = isDark ? "text-gray-400" : "text-gray-500";
  const strongText = isDark ? "text-white" : "text-gray-900";
  const priceText = isDark ? "text-[#d8b4fe]" : "text-purple-700";
  const tableHeaderClass = isDark
    ? "bg-[#2a0140]/40 border-b border-[#9303C5]/20"
    : "bg-gray-50/80 border-b border-gray-100";

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="relative space-y-6"
    >
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className={`absolute -top-40 -left-40 w-[32rem] h-[32rem] rounded-full blur-3xl ${
            isDark ? "bg-[#9303C5]/15" : "bg-purple-200/25"
          }`}
        />
        <div
          className={`absolute -bottom-40 -right-40 w-[36rem] h-[36rem] rounded-full blur-3xl ${
            isDark ? "bg-[#2a0140]/40" : "bg-indigo-200/25"
          }`}
        />
      </div>

      {/* ═══════════════ PORTFOLIO OVERVIEW ═══════════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        <StatCard
          title="Cash Balance"
          value={`₹${portfolio.balance?.toLocaleString() ?? "0"}`}
          subtitle="Available for trading"
          icon={DollarSign}
          isDark={isDark}
          accent="emerald"
          delay={0.05}
        />
        <StatCard
          title="Portfolio Value"
          value={`₹${portfolioValue.toLocaleString()}`}
          subtitle={`${portfolio.holdings.length} ${
            portfolio.holdings.length === 1 ? "asset" : "assets"
          } held`}
          icon={PieChart}
          isDark={isDark}
          accent="purple"
          delay={0.1}
        />
        <StatCard
          title="Participant ID"
          value={user.participantId ?? "-"}
          subtitle="Your unique identifier"
          icon={IdCard}
          isDark={isDark}
          accent="blue"
          valueClass={`text-xl sm:text-2xl font-mono tracking-wider ${
            isDark ? "text-[#d8b4fe]" : "text-blue-600"
          }`}
          delay={0.15}
        />
      </div>

      {/* P&L summary strip */}
      {portfolio.holdings.length > 0 && (
        <motion.div variants={item}>
          <div
            className={`relative rounded-2xl border overflow-hidden ${
              isDark
                ? "bg-[#02060E]/60 backdrop-blur-md border-[#9303C5]/25"
                : "bg-white/80 border-gray-100 shadow-[0_8px_30px_-15px_rgba(99,86,215,0.12)]"
            }`}
          >
            <div
              className={`absolute inset-x-8 -top-px h-px ${
                isDark
                  ? "bg-gradient-to-r from-transparent via-[#9303C5] to-transparent"
                  : "bg-gradient-to-r from-transparent via-purple-300 to-transparent"
              }`}
            />
            <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border overflow-hidden relative ${
                    totalProfitLoss >= 0
                      ? isDark
                        ? "bg-gradient-to-br from-emerald-500/30 to-emerald-600/20 border-emerald-400/30"
                        : "bg-gradient-to-br from-emerald-100 to-green-100 border-emerald-200"
                      : isDark
                        ? "bg-gradient-to-br from-red-500/30 to-rose-600/20 border-red-400/30"
                        : "bg-gradient-to-br from-red-100 to-rose-100 border-red-200"
                  }`}
                >
                  <span className="absolute inset-x-1 top-0 h-px bg-white/40" />
                  {totalProfitLoss >= 0 ? (
                    <TrendingUp
                      className={`h-5 w-5 ${
                        isDark ? "text-emerald-200" : "text-emerald-600"
                      }`}
                      strokeWidth={2.4}
                    />
                  ) : (
                    <TrendingDown
                      className={`h-5 w-5 ${
                        isDark ? "text-red-200" : "text-red-600"
                      }`}
                      strokeWidth={2.4}
                    />
                  )}
                </div>
                <div>
                  <p
                    className={`text-[10px] font-bold uppercase tracking-widest ${mutedText}`}
                  >
                    Total P&L
                  </p>
                  <p
                    className={`text-lg sm:text-xl font-bold tabular-nums ${
                      totalProfitLoss >= 0
                        ? isDark
                          ? "text-emerald-300"
                          : "text-emerald-600"
                        : isDark
                          ? "text-red-300"
                          : "text-red-600"
                    }`}
                  >
                    {totalProfitLoss >= 0 ? "+" : "-"}₹
                    {Math.abs(totalProfitLoss).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 sm:gap-8">
                <div>
                  <p
                    className={`text-[10px] font-bold uppercase tracking-widest ${mutedText}`}
                  >
                    Invested
                  </p>
                  <p
                    className={`text-sm font-bold tabular-nums ${strongText}`}
                  >
                    ₹{totalInvested.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p
                    className={`text-[10px] font-bold uppercase tracking-widest ${mutedText}`}
                  >
                    Current
                  </p>
                  <p
                    className={`text-sm font-bold tabular-nums ${priceText}`}
                  >
                    ₹{(totalInvested + totalProfitLoss).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ═══════════════ HOLDINGS ═══════════════ */}
      <motion.div variants={item}>
        <Card className={cardShell}>
          <div
            className={`absolute inset-x-10 -top-px h-px ${
              isDark
                ? "bg-gradient-to-r from-transparent via-[#9303C5] to-transparent"
                : "bg-gradient-to-r from-transparent via-purple-300 to-transparent"
            }`}
          />
          <CardHeader className={cardHeaderStrip}>
            <SectionHeader
              icon={Activity}
              title="My Holdings"
              isDark={isDark}
              badge={
                <span
                  className={`inline-flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-widest border tabular-nums ${
                    isDark
                      ? "bg-[#9303C5]/25 text-[#e9d5ff] border-[#d8b4fe]/25"
                      : "bg-purple-50 text-purple-700 border-purple-200"
                  }`}
                >
                  {portfolio.holdings.length}{" "}
                  {portfolio.holdings.length === 1 ? "Asset" : "Assets"}
                </span>
              }
            />
          </CardHeader>
          <CardContent className="p-0">
            {portfolio.holdings.length === 0 ? (
              <div className="p-12 text-center">
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl border ${
                      isDark
                        ? "bg-[#9303C5]/20 border-[#d8b4fe]/25"
                        : "bg-purple-50 border-purple-200"
                    }`}
                  >
                    <Activity
                      className={`h-6 w-6 ${
                        isDark ? "text-[#f0e6ff]" : "text-purple-500"
                      }`}
                      strokeWidth={2.4}
                    />
                  </div>
                  <p className={`text-sm font-medium ${strongText}`}>
                    No holdings yet
                  </p>
                  <p className={`text-xs ${mutedText}`}>
                    Start trading to build your portfolio
                  </p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={tableHeaderClass}>
                      {[
                        "Name",
                        "Quantity",
                        "Avg Price",
                        "Current Price",
                        "Invested",
                        "Current Value",
                        "P&L",
                      ].map((head, i) => (
                        <th
                          key={head}
                          className={`p-4 text-[11px] font-bold uppercase tracking-wider ${
                            i === 0 ? "text-left" : "text-right"
                          } ${mutedText}`}
                        >
                          {head}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {portfolio.holdings.map((holding, index) => {
                      const share = shares.find(
                        (s) => s.name === holding.symbol,
                      );
                      const profitLoss = calculateProfitLoss(holding);
                      const invested = holding.avgPrice * holding.quantity;
                      const currentValue = share
                        ? share.price * holding.quantity
                        : 0;
                      const profitPercent =
                        invested > 0 ? (profitLoss / invested) * 100 : 0;

                      return (
                        <motion.tr
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onMouseEnter={() => setHoveredRow(index)}
                          onMouseLeave={() => setHoveredRow(null)}
                          className={`border-b transition-all duration-200 ${
                            isDark
                              ? "border-[#9303C5]/10 hover:bg-[#2a0140]/30"
                              : "border-gray-100 hover:bg-gray-50"
                          }`}
                        >
                          <td
                            className={`p-4 font-semibold text-sm ${strongText}`}
                          >
                            {holding.symbol}
                          </td>
                          <td
                            className={`text-right p-4 text-sm tabular-nums ${strongText}`}
                          >
                            {holding.quantity}
                          </td>
                          <td
                            className={`text-right p-4 text-sm tabular-nums ${mutedText}`}
                          >
                            ₹{holding.avgPrice.toFixed(2)}
                          </td>
                          <td
                            className={`text-right p-4 text-sm font-semibold tabular-nums ${priceText}`}
                          >
                            ₹{share?.price?.toFixed(2) ?? "N/A"}
                          </td>
                          <td
                            className={`text-right p-4 text-sm tabular-nums ${mutedText}`}
                          >
                            ₹{invested.toLocaleString()}
                          </td>
                          <td
                            className={`text-right p-4 text-sm font-semibold tabular-nums ${strongText}`}
                          >
                            ₹{currentValue.toLocaleString()}
                          </td>
                          <td className="text-right p-4">
                            <div
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold tabular-nums ${
                                profitLoss >= 0
                                  ? isDark
                                    ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                                    : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : isDark
                                    ? "bg-red-500/15 text-red-300 border border-red-500/30"
                                    : "bg-red-50 text-red-700 border border-red-200"
                              }`}
                            >
                              {profitLoss >= 0 ? (
                                <TrendingUp
                                  className="h-3 w-3"
                                  strokeWidth={2.6}
                                />
                              ) : (
                                <TrendingDown
                                  className="h-3 w-3"
                                  strokeWidth={2.6}
                                />
                              )}
                              ₹{Math.abs(profitLoss).toLocaleString()}
                              <span className="opacity-70">
                                ({profitPercent >= 0 ? "+" : ""}
                                {profitPercent.toFixed(1)}%)
                              </span>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* ═══════════════ MARKET OVERVIEW ═══════════════ */}
      <motion.div variants={item}>
        <Card className={cardShell}>
          <div
            className={`absolute inset-x-10 -top-px h-px ${
              isDark
                ? "bg-gradient-to-r from-transparent via-[#9303C5] to-transparent"
                : "bg-gradient-to-r from-transparent via-purple-300 to-transparent"
            }`}
          />
          <CardHeader className={cardHeaderStrip}>
            <SectionHeader
              icon={Sparkles}
              title="Market Overview"
              isDark={isDark}
              badge={
                <span
                  className={`inline-flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-widest border tabular-nums ${
                    isDark
                      ? "bg-[#9303C5]/25 text-[#e9d5ff] border-[#d8b4fe]/25"
                      : "bg-purple-50 text-purple-700 border-purple-200"
                  }`}
                >
                  {shares.length} Listed
                </span>
              }
            />
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[leftShares, rightShares].map((shareList, listIdx) => (
                <div key={listIdx}>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className={tableHeaderClass}>
                        <th
                          className={`p-3 text-left text-[11px] font-bold uppercase tracking-wider ${mutedText}`}
                        >
                          Name
                        </th>
                        <th
                          className={`p-3 text-right text-[11px] font-bold uppercase tracking-wider ${mutedText}`}
                        >
                          Price
                        </th>
                        <th
                          className={`p-3 text-right text-[11px] font-bold uppercase tracking-wider ${mutedText}`}
                        >
                          Change
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {shareList.map((share, idx) => (
                        <motion.tr
                          key={share._id}
                          initial={{ opacity: 0, x: listIdx === 0 ? -20 : 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.02 }}
                          className={`border-b transition-all duration-200 ${
                            isDark
                              ? "border-[#9303C5]/10 hover:bg-[#2a0140]/30"
                              : "border-gray-100 hover:bg-gray-50"
                          }`}
                        >
                          <td
                            className={`p-3 font-medium text-sm ${strongText}`}
                          >
                            {share.name}
                          </td>
                          <td
                            className={`text-right p-3 font-semibold tabular-nums ${priceText}`}
                          >
                            ₹{share.price.toFixed(2)}
                          </td>
                          <td className="text-right p-3">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold tabular-nums ${
                                share.change >= 0
                                  ? isDark
                                    ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                                    : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : isDark
                                    ? "bg-red-500/15 text-red-300 border border-red-500/30"
                                    : "bg-red-50 text-red-700 border border-red-200"
                              }`}
                            >
                              {share.change >= 0 ? (
                                <TrendingUp
                                  className="h-3 w-3"
                                  strokeWidth={2.6}
                                />
                              ) : (
                                <TrendingDown
                                  className="h-3 w-3"
                                  strokeWidth={2.6}
                                />
                              )}
                              {share.change >= 0 ? "+" : ""}
                              {share.change.toFixed(2)}%
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ═══════════════ RECENT TRADES ═══════════════ */}
      <motion.div variants={item}>
        <Card className={cardShell}>
          <div
            className={`absolute inset-x-10 -top-px h-px ${
              isDark
                ? "bg-gradient-to-r from-transparent via-[#9303C5] to-transparent"
                : "bg-gradient-to-r from-transparent via-purple-300 to-transparent"
            }`}
          />
          <CardHeader className={cardHeaderStrip}>
            <SectionHeader
              icon={Clock}
              title="Recent Trades"
              isDark={isDark}
              badge={
                trades.length > 0 ? (
                  <span
                    className={`inline-flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-widest border tabular-nums ${
                      isDark
                        ? "bg-[#9303C5]/25 text-[#e9d5ff] border-[#d8b4fe]/25"
                        : "bg-purple-50 text-purple-700 border-purple-200"
                    }`}
                  >
                    {Math.min(trades.length, 10)} Shown
                  </span>
                ) : null
              }
            />
          </CardHeader>
          <CardContent className="p-0">
            {trades.length === 0 ? (
              <div className="p-12 text-center">
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl border ${
                      isDark
                        ? "bg-[#9303C5]/20 border-[#d8b4fe]/25"
                        : "bg-purple-50 border-purple-200"
                    }`}
                  >
                    <Clock
                      className={`h-6 w-6 ${
                        isDark ? "text-[#f0e6ff]" : "text-purple-500"
                      }`}
                      strokeWidth={2.4}
                    />
                  </div>
                  <p className={`text-sm font-medium ${strongText}`}>
                    No trades yet
                  </p>
                  <p className={`text-xs ${mutedText}`}>
                    Your trade history will appear here
                  </p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={tableHeaderClass}>
                      {[
                        "Date",
                        "Action",
                        "Name",
                        "Qty",
                        "Price",
                        "Traded With",
                      ].map((head, i) => (
                        <th
                          key={head}
                          className={`p-4 text-[11px] font-bold uppercase tracking-wider ${
                            i >= 3 ? "text-right" : "text-left"
                          } ${mutedText}`}
                        >
                          {head}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {trades.slice(0, 10).map((t, i) => (
                      <motion.tr
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className={`border-b transition-all duration-200 ${
                          isDark
                            ? "border-[#9303C5]/10 hover:bg-[#2a0140]/30"
                            : "border-gray-100 hover:bg-gray-50"
                        }`}
                      >
                        <td
                          className={`p-4 text-xs tabular-nums ${mutedText}`}
                        >
                          {new Date(t.date).toLocaleString()}
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                              t.action === "buy"
                                ? isDark
                                  ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                                  : "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : isDark
                                  ? "bg-red-500/15 text-red-300 border-red-500/30"
                                  : "bg-red-50 text-red-700 border-red-200"
                            }`}
                          >
                            {t.action === "buy" ? (
                              <TrendingUp
                                className="h-3 w-3"
                                strokeWidth={2.6}
                              />
                            ) : (
                              <TrendingDown
                                className="h-3 w-3"
                                strokeWidth={2.6}
                              />
                            )}
                            {t.action}
                          </span>
                        </td>
                        <td
                          className={`p-4 text-sm font-semibold ${strongText}`}
                        >
                          {t.symbol}
                        </td>
                        <td
                          className={`p-4 text-right text-sm tabular-nums ${strongText}`}
                        >
                          {t.quantity}
                        </td>
                        <td
                          className={`p-4 text-right text-sm font-semibold tabular-nums ${priceText}`}
                        >
                          ₹{t.price.toLocaleString()}
                        </td>
                        <td
                          className={`p-4 text-right text-xs ${mutedText}`}
                        >
                          {t.counterpart}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* ═══════════════ MARKET NEWS ═══════════════ */}
      <motion.div variants={item}>
        <Card className={cardShell}>
          <div
            className={`absolute inset-x-10 -top-px h-px ${
              isDark
                ? "bg-gradient-to-r from-transparent via-[#9303C5] to-transparent"
                : "bg-gradient-to-r from-transparent via-purple-300 to-transparent"
            }`}
          />
          <CardHeader className={cardHeaderStrip}>
            <SectionHeader
              icon={Newspaper}
              title="Market News"
              isDark={isDark}
              badge={
                news.length > 0 ? (
                  <span
                    className={`inline-flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-widest border tabular-nums ${
                      isDark
                        ? "bg-[#9303C5]/25 text-[#e9d5ff] border-[#d8b4fe]/25"
                        : "bg-purple-50 text-purple-700 border-purple-200"
                    }`}
                  >
                    {news.length} Articles
                  </span>
                ) : null
              }
              right={
                hasMoreNews ? (
                  <motion.button
                    whileHover={{ scale: 1.03, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setShowAllNews(!showAllNews)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-300 border ${
                      isDark
                        ? "bg-[#9303C5]/25 text-[#e9d5ff] border-[#d8b4fe]/30 hover:bg-[#9303C5]/40"
                        : "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
                    }`}
                  >
                    {showAllNews ? (
                      <>
                        <ChevronUp className="h-3.5 w-3.5" strokeWidth={2.6} />
                        Show Less
                      </>
                    ) : (
                      <>
                        <ChevronDown
                          className="h-3.5 w-3.5"
                          strokeWidth={2.6}
                        />
                        Show All
                      </>
                    )}
                  </motion.button>
                ) : null
              }
            />
          </CardHeader>
          <CardContent className="p-6">
            {news.length === 0 ? (
              <div className="py-10 text-center">
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl border ${
                      isDark
                        ? "bg-[#9303C5]/20 border-[#d8b4fe]/25"
                        : "bg-purple-50 border-purple-200"
                    }`}
                  >
                    <Newspaper
                      className={`h-6 w-6 ${
                        isDark ? "text-[#f0e6ff]" : "text-purple-500"
                      }`}
                      strokeWidth={2.4}
                    />
                  </div>
                  <p className={`text-sm font-medium ${strongText}`}>
                    No news available
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <AnimatePresence>
                  {displayedNews.map((newsItem, index) => {
                    const isBreaking = index === 0;
                    const idx = index + 1;

                    return (
                      <motion.div
                        key={newsItem._id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.04 }}
                        className={`group relative rounded-xl border p-4 transition-all duration-300 overflow-hidden ${
                          isBreaking
                            ? isDark
                              ? "bg-gradient-to-r from-[#9303C5]/15 via-[#2a0140]/30 to-transparent border-[#9303C5]/40 shadow-[0_10px_30px_-15px_rgba(147,3,197,0.5)]"
                              : "bg-gradient-to-r from-purple-50 via-pink-50/50 to-transparent border-purple-200 shadow-[0_10px_30px_-15px_rgba(168,85,247,0.35)]"
                            : isDark
                              ? "bg-[#02060E]/40 border-[#9303C5]/20 hover:border-[#9303C5]/50 hover:bg-[#2a0140]/20"
                              : "bg-white border-gray-100 hover:border-purple-200 hover:shadow-md"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {/* Numbered index badge */}
                          <div
                            className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center border text-xs font-bold tabular-nums relative overflow-hidden ${
                              isBreaking
                                ? isDark
                                  ? "bg-gradient-to-br from-[#9303C5]/50 to-pink-500/30 border-[#d8b4fe]/40 text-[#f0e6ff]"
                                  : "bg-gradient-to-br from-purple-500 to-pink-500 border-transparent text-white"
                                : isDark
                                  ? "bg-[#2a0140]/60 border-[#9303C5]/30 text-[#e9d5ff]"
                                  : "bg-purple-50 border-purple-200 text-purple-700"
                            }`}
                          >
                            <span className="absolute inset-x-1 top-0 h-px bg-white/40" />
                            <span className="relative">{idx}</span>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              {isBreaking && (
                                <span
                                  className={`inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border animate-pulse ${
                                    isDark
                                      ? "bg-gradient-to-r from-[#9303C5] to-pink-500 text-white border-transparent"
                                      : "bg-gradient-to-r from-purple-600 to-pink-500 text-white border-transparent"
                                  }`}
                                >
                                  <span className="w-1 h-1 rounded-full bg-white" />
                                  Breaking
                                </span>
                              )}
                            </div>

                            <p
                              className={`text-sm font-semibold leading-snug ${strongText}`}
                            >
                              {newsItem.headline}
                            </p>

                            {newsItem.affectedShares &&
                              newsItem.affectedShares.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {newsItem.affectedShares
                                    .slice(0, 4)
                                    .map((share, i) => (
                                      <span
                                        key={i}
                                        className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                                          isDark
                                            ? "bg-[#2a0140]/60 text-[#e9d5ff] border-[#d8b4fe]/20"
                                            : "bg-gray-100 text-gray-600 border-gray-200"
                                        }`}
                                      >
                                        {share}
                                      </span>
                                    ))}
                                  {newsItem.affectedShares.length > 4 && (
                                    <span
                                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                                        isDark
                                          ? "bg-[#2a0140]/60 text-[#e9d5ff] border-[#d8b4fe]/20"
                                          : "bg-gray-100 text-gray-600 border-gray-200"
                                      }`}
                                    >
                                      +{newsItem.affectedShares.length - 4}
                                    </span>
                                  )}
                                </div>
                              )}

                            <span
                              className={`text-[10px] flex items-center gap-1 mt-2 tabular-nums ${mutedText}`}
                            >
                              <Clock className="h-3 w-3" strokeWidth={2.4} />
                              {new Date(
                                newsItem.timestamp,
                              ).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* ═══════════════ LEADERBOARD ═══════════════ */}
      <motion.div variants={item}>
        <Card className={cardShell}>
          <div
            className={`absolute inset-x-10 -top-px h-px ${
              isDark
                ? "bg-gradient-to-r from-transparent via-[#9303C5] to-transparent"
                : "bg-gradient-to-r from-transparent via-purple-300 to-transparent"
            }`}
          />
          <CardHeader className={cardHeaderStrip}>
            <SectionHeader
              icon={Award}
              title="Live Leaderboard"
              isDark={isDark}
              badge={
                leaderboard.length > 0 ? (
                  <span
                    className={`inline-flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-widest border ${
                      isDark
                        ? "bg-amber-500/15 text-amber-200 border-amber-500/40"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                  >
                    <span className="relative flex w-1.5 h-1.5">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75 animate-ping" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500" />
                    </span>
                    Top 15
                  </span>
                ) : null
              }
            />
          </CardHeader>
          <CardContent className="p-0">
            {leaderboard.length === 0 ? (
              <div className="p-12 text-center">
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl border ${
                      isDark
                        ? "bg-[#9303C5]/20 border-[#d8b4fe]/25"
                        : "bg-purple-50 border-purple-200"
                    }`}
                  >
                    <Award
                      className={`h-6 w-6 ${
                        isDark ? "text-[#f0e6ff]" : "text-purple-500"
                      }`}
                      strokeWidth={2.4}
                    />
                  </div>
                  <p className={`text-sm font-medium ${strongText}`}>
                    No leaderboard data yet
                  </p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={tableHeaderClass}>
                      <th
                        className={`p-4 text-left text-[11px] font-bold uppercase tracking-wider ${mutedText}`}
                      >
                        Rank
                      </th>
                      <th
                        className={`p-4 text-left text-[11px] font-bold uppercase tracking-wider ${mutedText}`}
                      >
                        Participant
                      </th>
                      <th
                        className={`p-4 text-right text-[11px] font-bold uppercase tracking-wider ${mutedText}`}
                      >
                        Net Worth
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.slice(0, 15).map((p, index) => {
                      const isMe = p.participantId === user.participantId;
                      const rank = getRankIcon(index);

                      return (
                        <motion.tr
                          key={p.participantId}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.03 }}
                          className={`border-b transition-all duration-200 relative ${
                            isMe
                              ? isDark
                                ? "bg-gradient-to-r from-[#9303C5]/20 via-[#2a0140]/20 to-transparent border-l-4 border-l-[#9303C5] border-b-[#9303C5]/30"
                                : "bg-gradient-to-r from-purple-100/80 via-purple-50 to-transparent border-l-4 border-l-purple-500 border-b-purple-100"
                              : isDark
                                ? "border-[#9303C5]/10 hover:bg-[#2a0140]/30"
                                : "border-gray-100 hover:bg-gray-50"
                          }`}
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              {rank ? (
                                <span className="text-2xl drop-shadow">
                                  {rank}
                                </span>
                              ) : (
                                <span
                                  className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold tabular-nums ${
                                    isDark
                                      ? "bg-[#2a0140] text-gray-300 border border-[#9303C5]/20"
                                      : "bg-gray-100 text-gray-600"
                                  }`}
                                >
                                  {index + 1}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span
                                className={`font-semibold text-sm ${strongText}`}
                              >
                                {p.name}
                              </span>
                              {isMe && (
                                <span
                                  className={`inline-flex items-center text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                                    isDark
                                      ? "bg-[#9303C5]/30 text-[#f0e6ff] border-[#d8b4fe]/40"
                                      : "bg-purple-600 text-white border-purple-500"
                                  }`}
                                >
                                  You
                                </span>
                              )}
                            </div>
                            <div
                              className={`text-[11px] font-mono ${mutedText} mt-0.5`}
                            >
                              {p.participantId}
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <span
                              className={`font-bold text-lg tabular-nums ${
                                index === 0
                                  ? isDark
                                    ? "text-amber-300"
                                    : "text-amber-600"
                                  : index === 1
                                    ? isDark
                                      ? "text-gray-300"
                                      : "text-gray-600"
                                    : index === 2
                                      ? isDark
                                        ? "text-orange-300"
                                        : "text-orange-600"
                                      : priceText
                              }`}
                            >
                              ₹{p.totalNetWorth.toLocaleString()}
                            </span>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default ParticipantDashboard;