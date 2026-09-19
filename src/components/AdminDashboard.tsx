// AdminDashboard.tsx - Refined, dark-mode-safe icons
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Newspaper,
  TrendingUp,
  TrendingDown,
  Award,
  Users,
  DollarSign,
  IndianRupee,
  Activity,
  Shield,
  AlertCircle,
  X,
  Search,
  Plus,
  Trash2,
} from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import { io } from "socket.io-client";
import { toast } from "@/components/ui/use-toast";
import { AxiosError } from "axios";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import MostTradedPortfolio from "./MostTradedPortfolio";
import MostDiversifiedPortfolio from "./MostDiversifiedPortfolio";
import { useTheme } from "@/contexts/ThemeContext";

interface AdminUser {
  _id: string;
  name: string;
  role: "admin" | "employee" | "participant";
  email?: string;
  participantId?: string;
}

interface Share {
  _id: string;
  name: string;
  price: number;
  change: number;
  lockedUntil?: string | null;
}

interface NewsItem {
  _id: string;
  headline: string;
  sentiment: "positive" | "negative";
  affectedShares: string[];
  impact: number;
  timestamp: string;
}

interface LeaderboardItem {
  participantId: string;
  name: string;
  totalNetWorth: number;
}

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

const SectionHeader = ({
  icon: Icon,
  title,
  subtitle,
  isDark,
  right,
  count,
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  isDark: boolean;
  right?: React.ReactNode;
  count?: { value: number; label: string };
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
          className={`relative w-12 h-12 rounded-2xl flex items-center justify-center border overflow-hidden ${
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
            className={`relative h-[22px] w-[22px] ${
              isDark ? "text-[#f0e6ff]" : "text-purple-600"
            }`}
            strokeWidth={2.4}
          />
        </div>
      </div>

      <div className="min-w-0">
        <div className="flex items-center gap-2.5 flex-wrap">
          <h3
            className={`text-lg sm:text-xl font-bold tracking-tight ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {title}
          </h3>
          {count && (
            <span
              className={`text-[11px] px-2.5 py-1 rounded-full font-bold border tabular-nums ${
                isDark
                  ? "bg-[#9303C5]/25 text-[#e9d5ff] border-[#d8b4fe]/25"
                  : "bg-purple-50 text-purple-700 border-purple-200"
              }`}
            >
              {count.value} {count.label}
            </span>
          )}
        </div>
        <p
          className={`text-xs mt-0.5 ${
            isDark ? "text-gray-400" : "text-gray-500"
          }`}
        >
          {subtitle}
        </p>
      </div>
    </div>
    {right}
  </div>
);

/**
 * InputWithIcon — input with a leading icon placed inside a small tinted chip.
 * The chip guarantees visibility because the icon sits on its own colored surface.
 */
const InputWithIcon = ({
  icon: Icon,
  isDark,
  className,
  ...inputProps
}: {
  icon: React.ElementType;
  isDark: boolean;
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div className="relative">
    {/* Icon chip — a mini surface behind the icon so it's always visible */}
    <div
      className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 pointer-events-none w-7 h-7 rounded-lg flex items-center justify-center border ${
        isDark
          ? "bg-gradient-to-br from-[#9303C5]/40 to-[#6b02b3]/30 border-[#d8b4fe]/30"
          : "bg-gradient-to-br from-purple-100 to-indigo-100 border-purple-200"
      }`}
    >
      <Icon
        className={`h-3.5 w-3.5 ${
          isDark ? "text-[#f0e6ff]" : "text-purple-600"
        }`}
        strokeWidth={2.6}
      />
    </div>
    <Input {...inputProps} className={`pl-11 ${className ?? ""}`} />
  </div>
);

const AdminDashboard = ({ user }: { user: AdminUser }) => {
  const { theme } = useTheme();
  const [shares, setShares] = useState<Share[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);

  const [newShare, setNewShare] = useState({ name: "", price: 0 });
  const [newNews, setNewNews] = useState({
    headline: "",
    sentiment: "positive",
    affectedShares: [] as string[],
    impact: 1,
  });

  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareSearchTerm, setShareSearchTerm] = useState("");
  const [marketRunning, setMarketRunning] = useState(true);

  const [bumpDialogOpen, setBumpDialogOpen] = useState(false);
  const [bumpValue, setBumpValue] = useState<number>(0);
  const [bumpTarget, setBumpTarget] = useState<{
    id: string;
    sign: "+" | "-";
  } | null>(null);

  const isDark = theme === "dark";

  /* ───── Shared theme helpers ───── */
  const cardShell = `relative rounded-2xl border transition-all duration-300 ${
    isDark
      ? "bg-[#02060E]/80 backdrop-blur-md border-[#9303C5]/30 shadow-[0_10px_40px_-15px_rgba(147,3,197,0.4)]"
      : "bg-white border-gray-100 shadow-[0_8px_30px_-15px_rgba(99,86,215,0.15)]"
  }`;

  const cardHeaderStrip = `relative border-b ${
    isDark ? "border-[#9303C5]/20" : "border-gray-100"
  }`;

  const inputClass = `transition-all duration-200 focus:ring-2 rounded-xl ${
    isDark
      ? "bg-[#02060E]/80 border-[#9303C5]/30 text-white focus:border-[#9303C5] focus:ring-[#9303C5]/40 placeholder:text-gray-500"
      : "bg-gray-50/60 border-gray-200 focus:border-purple-500 focus:ring-purple-200/50"
  }`;

  const primaryBtnClass = `text-white font-semibold transition-all duration-300 rounded-full shadow-lg hover:-translate-y-0.5 ${
    isDark
      ? "bg-gradient-to-r from-[#9303C5] to-[#6b02b3] hover:from-[#7B02A8] hover:to-[#5B0186] shadow-[#9303C5]/40 hover:shadow-[#9303C5]/60"
      : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-purple-500/30 hover:shadow-purple-500/50"
  }`;

  const mutedText = isDark ? "text-gray-400" : "text-gray-500";
  const strongText = isDark ? "text-white" : "text-gray-900";
  const priceText = isDark ? "text-[#d8b4fe]" : "text-purple-700";

  /* ──────────────────────────────────── */
  /*           API actions                */
  /* ──────────────────────────────────── */
  const fetchNews = async () => {
    const res = await axiosInstance.get("/news");
    setNews(res.data);
  };

  const toggleMarket = async () => {
    const res = await axiosInstance.post("/market/toggle");
    setMarketRunning(res.data.running);
  };

  const fetchLeaderboard = async () => {
    const res = await axiosInstance.get("/users/leaderboard");
    setLeaderboard(res.data);
  };

  const fetchAll = async () => {
    const [sRes, nRes, lRes] = await Promise.all([
      axiosInstance.get("/shares"),
      axiosInstance.get("/news"),
      axiosInstance.get("/users/leaderboard"),
    ]);
    setShares(sRes.data);
    setNews(nRes.data);
    setLeaderboard(lRes.data);
  };

  useEffect(() => {
    fetchAll();

    axiosInstance.get("/market/status").then((res) => {
      setMarketRunning(res.data.running);
    });

    socket.on("market:status", ({ running }) => {
      setMarketRunning(running);
      toast({
        title: running ? "📊 Market Resumed" : "⛔ Market Paused",
        description: running
          ? "Market fluctuations are active."
          : "Market fluctuations are halted.",
      });
    });

    socket.on("share:add", (newShare) => {
      setShares((prev) => [...prev, newShare]);
      toast({
        title: "📈 New Share Added",
        description: `${newShare.name} listed at ₹${newShare.price}`,
      });
    });

    socket.on("share:update", (updatedShare: Share) => {
      setShares((prev) =>
        prev.map((s) => (s._id === updatedShare._id ? updatedShare : s)),
      );
    });

    socket.on("share:delete", (id: string) => {
      setShares((prev) => prev.filter((s) => s._id !== id));
    });

    socket.on("news:new", (newsItem: NewsItem) => {
      toast({
        title: "📰 Breaking News",
        description: newsItem.headline,
      });
      setNews((prev) => [newsItem, ...prev]);
    });

    socket.on("leaderboard:update", (data) => {
      setLeaderboard(data);
    });

    return () => {
      socket.off("share:update");
      socket.off("share:delete");
      socket.off("share:add");
      socket.off("news:new");
      socket.off("market:status");
      socket.off("leaderboard:update");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openBumpDialog = (id: string, sign: "+" | "-") => {
    setBumpTarget({ id, sign });
    setBumpValue(0);
    setBumpDialogOpen(true);
  };

  const confirmBump = async () => {
    if (!bumpTarget || bumpValue <= 0) {
      toast({
        title: "Invalid value",
        description: "Please enter a positive percentage",
        variant: "destructive",
      });
      return;
    }

    const percent = bumpTarget.sign === "+" ? bumpValue : -bumpValue;

    try {
      await axiosInstance.post(`/shares/${bumpTarget.id}/bump`, { percent });
      setBumpDialogOpen(false);
    } catch (err: unknown) {
      const error = err as AxiosError<{ msg?: string }>;
      toast({
        title: "Update failed",
        description: error.response?.data?.msg ?? "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const handleAddShare = async () => {
    if (!newShare.name || newShare.price <= 0) return;
    await axiosInstance.post("/shares", newShare);
    setNewShare({ name: "", price: 0 });
  };

  const handleDeleteShare = async (id: string) => {
    await axiosInstance.delete(`/shares/${id}`);
  };

  const handleAddNews = async () => {
    const { headline, affectedShares, impact } = newNews;
    if (!headline || affectedShares.length === 0) return;
    if (impact < 1 || impact > 5) return alert("Impact must be 1‑5");

    await axiosInstance.post("/news", newNews);
    setNewNews({
      headline: "",
      sentiment: "positive",
      affectedShares: [],
      impact: 1,
    });
    fetchNews();
    fetchLeaderboard();
  };

  const applyPenalty = async (participantId: string) => {
    if (!confirm("Apply ₹1,00,000 penalty to this participant?")) return;

    try {
      await axiosInstance.post(`/users/penalty/${participantId}`);
      toast({
        title: "Penalty Applied",
        description: "₹1,00,000 deducted",
        variant: "destructive",
      });
    } catch {
      toast({
        title: "Penalty Failed",
        variant: "destructive",
      });
    }
  };

  const removeAffectedShare = (shareName: string) => {
    setNewNews({
      ...newNews,
      affectedShares: newNews.affectedShares.filter((s) => s !== shareName),
    });
  };

  const toggleShareSelection = (shareName: string, checked: boolean) => {
    if (checked) {
      setNewNews({
        ...newNews,
        affectedShares: [...newNews.affectedShares, shareName],
      });
    } else {
      setNewNews({
        ...newNews,
        affectedShares: newNews.affectedShares.filter((s) => s !== shareName),
      });
    }
  };

  const filteredShares = shares.filter((sh) =>
    sh.name.toLowerCase().includes(shareSearchTerm.toLowerCase()),
  );

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="relative max-w-6xl mx-auto space-y-8"
    >
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

      {/* ═══════════════════ SHARE MANAGEMENT ═══════════════════ */}
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
              icon={DollarSign}
              title="Manage Shares"
              subtitle="Add, adjust, and remove listed shares"
              isDark={isDark}
              count={{ value: shares.length, label: "active" }}
              right={
                <motion.div
                  animate={
                    marketRunning
                      ? {
                          boxShadow: [
                            "0 0 0 0 rgba(34,197,94,0.4)",
                            "0 0 0 8px rgba(34,197,94,0)",
                          ],
                        }
                      : {}
                  }
                  transition={{ repeat: Infinity, duration: 1.8 }}
                  className="rounded-full"
                >
                  <Button
                    onClick={toggleMarket}
                    className={`rounded-full px-5 shadow-lg transition-all duration-300 hover:-translate-y-0.5 ${
                      marketRunning
                        ? isDark
                          ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-green-500/50"
                          : "bg-green-600 text-white hover:bg-green-700 hover:shadow-green-500/40"
                        : isDark
                          ? "bg-gradient-to-r from-red-600 to-rose-600 text-white hover:shadow-red-500/50"
                          : "bg-red-600 text-white hover:bg-red-700 hover:shadow-red-500/40"
                    }`}
                  >
                    <span
                      className={`inline-block w-2 h-2 rounded-full mr-2 ${
                        marketRunning
                          ? "bg-green-300 animate-pulse"
                          : "bg-red-300"
                      }`}
                    />
                    {marketRunning ? "Market ON" : "Market OFF"}
                  </Button>
                </motion.div>
              }
            />
          </CardHeader>

          <CardContent className="space-y-6 p-6">
            {/* Add share row — icon chips now guarantee visibility */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <InputWithIcon
                  icon={Activity}
                  isDark={isDark}
                  placeholder="Share name (e.g., TCS)"
                  value={newShare.name}
                  onChange={(e) =>
                    setNewShare({
                      ...newShare,
                      name: (e.target as HTMLInputElement).value.toUpperCase(),
                    })
                  }
                  className={`h-12 ${inputClass}`}
                />
              </div>
              <div className="sm:w-52">
                <InputWithIcon
                  icon={IndianRupee}
                  isDark={isDark}
                  type="number"
                  placeholder="Price"
                  value={newShare.price || ""}
                  onChange={(e) =>
                    setNewShare({
                      ...newShare,
                      price: +(e.target as HTMLInputElement).value,
                    })
                  }
                  className={`h-12 ${inputClass}`}
                />
              </div>
              <Button
                onClick={handleAddShare}
                disabled={!newShare.name || newShare.price <= 0}
                className={`${primaryBtnClass} h-12 px-6 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0`}
              >
                <Plus className="h-4 w-4 mr-1.5" strokeWidth={2.6} />
                Add Share
              </Button>
            </div>

            {/* Shares list */}
            <div className="grid gap-3">
              <AnimatePresence mode="popLayout">
                {shares.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`text-center py-14 rounded-2xl border border-dashed ${
                      isDark
                        ? "border-[#9303C5]/30 text-gray-400 bg-[#2a0140]/10"
                        : "border-purple-200 text-gray-500 bg-purple-50/30"
                    }`}
                  >
                    <div
                      className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-3 border ${
                        isDark
                          ? "bg-[#9303C5]/20 border-[#d8b4fe]/25"
                          : "bg-white border-purple-200"
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
                      No shares listed yet
                    </p>
                    <p className={`text-xs ${mutedText} mt-1`}>
                      Add your first share above
                    </p>
                  </motion.div>
                ) : (
                  shares.map((sh, idx) => {
                    const locked =
                      sh.lockedUntil && new Date(sh.lockedUntil) > new Date();
                    return (
                      <motion.div
                        key={sh._id}
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: idx * 0.04 }}
                        whileHover={{ y: -2 }}
                        className={`group relative rounded-xl border p-4 flex items-center justify-between transition-all duration-300 overflow-hidden ${
                          isDark
                            ? "bg-[#02060E]/40 border-[#9303C5]/20 hover:border-[#9303C5]/50 hover:bg-[#2a0140]/30"
                            : "bg-white border-gray-200 hover:border-purple-300 hover:shadow-md"
                        }`}
                      >
                        <div
                          className={`absolute left-0 top-0 bottom-0 w-0.5 opacity-0 group-hover:opacity-100 transition-opacity ${
                            isDark
                              ? "bg-gradient-to-b from-[#9303C5] to-[#d8b4fe]"
                              : "bg-gradient-to-b from-purple-500 to-indigo-500"
                          }`}
                        />

                        <div className="flex items-center gap-4 flex-1 min-w-0 pl-1">
                          <div
                            className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center border ${
                              isDark
                                ? "bg-gradient-to-br from-[#9303C5]/35 to-[#2a0140]/60 border-[#d8b4fe]/25"
                                : "bg-gradient-to-br from-purple-100 to-indigo-100 border-purple-200"
                            }`}
                          >
                            <Activity
                              className={`h-5 w-5 ${
                                isDark ? "text-[#f0e6ff]" : "text-purple-600"
                              }`}
                              strokeWidth={2.4}
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <strong
                                className={`text-base sm:text-lg font-bold ${strongText}`}
                              >
                                {sh.name}
                              </strong>
                              {locked && (
                                <Badge
                                  className={`rounded-full text-[10px] font-semibold ${
                                    isDark
                                      ? "bg-[#9303C5]/30 text-[#e9d5ff] border border-[#d8b4fe]/40"
                                      : "bg-amber-100 text-amber-700 border border-amber-200"
                                  }`}
                                >
                                  🔒 Locked
                                </Badge>
                              )}
                            </div>
                            <p className={`text-xs ${mutedText} mt-0.5`}>
                              Current price
                            </p>
                          </div>
                        </div>

                        <div className="text-right mr-4 shrink-0">
                          <p
                            className={`text-xl sm:text-2xl font-bold tabular-nums ${priceText}`}
                          >
                            ₹{sh.price.toFixed(2)}
                          </p>
                        </div>

                        <div className="flex gap-2 shrink-0">
                          <button
                            disabled={locked}
                            onClick={() => openBumpDialog(sh._id, "+")}
                            title="Increase price"
                            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 ${
                              isDark
                                ? "bg-green-500/15 text-green-300 hover:bg-green-500/25 border border-green-500/40"
                                : "bg-green-50 text-green-600 hover:bg-green-100 border border-green-200"
                            }`}
                          >
                            <TrendingUp className="h-4 w-4" strokeWidth={2.4} />
                          </button>

                          <button
                            disabled={locked}
                            onClick={() => openBumpDialog(sh._id, "-")}
                            title="Decrease price"
                            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 ${
                              isDark
                                ? "bg-red-500/15 text-red-300 hover:bg-red-500/25 border border-red-500/40"
                                : "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                            }`}
                          >
                            <TrendingDown
                              className="h-4 w-4"
                              strokeWidth={2.4}
                            />
                          </button>

                          <button
                            onClick={() => handleDeleteShare(sh._id)}
                            title="Delete share"
                            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-95 ${
                              isDark
                                ? "bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/50"
                                : "bg-red-100 text-red-700 hover:bg-red-200 border border-red-300"
                            }`}
                          >
                            <Trash2 className="h-4 w-4" strokeWidth={2.4} />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ═══════════════════ NEWS MANAGEMENT ═══════════════════ */}
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
              title="Manage News"
              subtitle="Post headlines that affect share prices"
              isDark={isDark}
            />
          </CardHeader>

          <CardContent className="space-y-5 p-6">
            <Textarea
              className={`min-h-[110px] ${inputClass} resize-none`}
              placeholder="Enter news headline…"
              value={newNews.headline}
              onChange={(e) =>
                setNewNews({ ...newNews, headline: e.target.value })
              }
            />

            <div className="flex flex-wrap gap-2 items-center">
              <span
                className={`text-xs font-semibold uppercase tracking-wider ${mutedText}`}
              >
                Affected shares
              </span>
              {newNews.affectedShares.length > 0 ? (
                <AnimatePresence mode="popLayout">
                  {newNews.affectedShares.map((share) => (
                    <motion.button
                      key={share}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      onClick={() => removeAffectedShare(share)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        isDark
                          ? "bg-[#9303C5]/40 text-[#f0e6ff] border border-[#d8b4fe]/40 hover:bg-[#9303C5]/60"
                          : "bg-purple-100 text-purple-700 border border-purple-200 hover:bg-purple-200"
                      }`}
                    >
                      {share}
                      <X className="h-3 w-3" />
                    </motion.button>
                  ))}
                </AnimatePresence>
              ) : (
                <span className={`text-xs italic ${mutedText}`}>
                  No shares selected yet
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-3 items-end">
              <Button
                type="button"
                onClick={() => {
                  setShareModalOpen(true);
                  setShareSearchTerm("");
                }}
                className={`w-full sm:w-[280px] h-11 justify-start rounded-xl border relative pl-11 ${
                  isDark
                    ? "bg-[#02060E]/60 border-[#9303C5]/30 text-white hover:bg-[#2a0140]/60"
                    : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-purple-300"
                }`}
              >
                {/* Icon chip inside the button — same treatment as InputWithIcon */}
                <div
                  className={`absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg flex items-center justify-center border ${
                    isDark
                      ? "bg-gradient-to-br from-[#9303C5]/40 to-[#6b02b3]/30 border-[#d8b4fe]/30"
                      : "bg-gradient-to-br from-purple-100 to-indigo-100 border-purple-200"
                  }`}
                >
                  <Search
                    className={`h-3.5 w-3.5 ${
                      isDark ? "text-[#f0e6ff]" : "text-purple-600"
                    }`}
                    strokeWidth={2.6}
                  />
                </div>
                <span className="truncate">
                  {newNews.affectedShares.length
                    ? `${newNews.affectedShares.length} share(s) selected`
                    : "Select affected shares"}
                </span>
              </Button>

              <div className="flex items-center gap-2">
                <span className={`text-xs font-medium ${mutedText}`}>
                  Impact
                </span>
                <Input
                  type="number"
                  min={1}
                  max={5}
                  className={`w-16 text-center h-11 ${inputClass}`}
                  value={newNews.impact}
                  onChange={(e) =>
                    setNewNews({ ...newNews, impact: +e.target.value })
                  }
                />
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`w-5 h-1.5 rounded-full transition-all ${
                        level <= newNews.impact
                          ? newNews.sentiment === "positive"
                            ? "bg-green-500"
                            : "bg-red-500"
                          : isDark
                            ? "bg-gray-700"
                            : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <select
                className={`rounded-xl border px-4 h-11 text-sm transition-all focus:ring-2 ${
                  isDark
                    ? "bg-[#02060E]/80 border-[#9303C5]/30 text-white focus:border-[#9303C5] focus:ring-[#9303C5]/40"
                    : "bg-white border-gray-200 text-gray-700 focus:ring-purple-200/50 focus:border-purple-500"
                }`}
                value={newNews.sentiment}
                onChange={(e) =>
                  setNewNews({
                    ...newNews,
                    sentiment: e.target.value as "positive" | "negative",
                  })
                }
              >
                <option
                  value="positive"
                  className={isDark ? "bg-[#02060E]" : ""}
                >
                  📈 Positive
                </option>
                <option
                  value="negative"
                  className={isDark ? "bg-[#02060E]" : ""}
                >
                  📉 Negative
                </option>
              </select>

              <Button
                onClick={handleAddNews}
                disabled={
                  !newNews.headline || newNews.affectedShares.length === 0
                }
                className={`${primaryBtnClass} h-11 px-6 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0`}
              >
                <Newspaper className="h-4 w-4 mr-1.5" strokeWidth={2.4} />
                Post News
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ═══════════════════ SHARE SELECTION MODAL ═══════════════════ */}
      <Dialog open={shareModalOpen} onOpenChange={setShareModalOpen}>
        <DialogContent
          className={`sm:max-w-lg rounded-2xl ${
            isDark
              ? "bg-[#02060E] border-[#9303C5]/30"
              : "bg-white border-gray-100"
          }`}
        >
          <DialogHeader>
            <DialogTitle className={strongText}>
              Select affected shares
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Search input with icon chip */}
            <div className="relative">
              <div
                className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 pointer-events-none w-7 h-7 rounded-lg flex items-center justify-center border ${
                  isDark
                    ? "bg-gradient-to-br from-[#9303C5]/40 to-[#6b02b3]/30 border-[#d8b4fe]/30"
                    : "bg-gradient-to-br from-purple-100 to-indigo-100 border-purple-200"
                }`}
              >
                <Search
                  className={`h-3.5 w-3.5 ${
                    isDark ? "text-[#f0e6ff]" : "text-purple-600"
                  }`}
                  strokeWidth={2.6}
                />
              </div>
              <input
                type="text"
                placeholder="Search shares…"
                value={shareSearchTerm}
                onChange={(e) => setShareSearchTerm(e.target.value)}
                className={`w-full pl-11 pr-3 py-2.5 text-sm rounded-xl border transition-all focus:ring-2 ${
                  isDark
                    ? "bg-[#02060E]/80 border-[#9303C5]/30 text-white placeholder:text-gray-400 focus:border-[#9303C5] focus:ring-[#9303C5]/40"
                    : "bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400 focus:ring-purple-200/50 focus:border-purple-500"
                }`}
                autoFocus
              />
            </div>

            <div className="max-h-96 overflow-y-auto space-y-1.5 pr-1">
              {filteredShares.length === 0 ? (
                <div className={`text-center py-10 ${mutedText}`}>
                  <Activity className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No shares found</p>
                </div>
              ) : (
                filteredShares.map((sh) => {
                  const isSelected = newNews.affectedShares.includes(sh.name);
                  return (
                    <label
                      key={sh._id}
                      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 border ${
                        isSelected
                          ? isDark
                            ? "bg-[#2a0140]/40 border-[#9303C5]/50"
                            : "bg-purple-50 border-purple-200"
                          : isDark
                            ? "hover:bg-[#2a0140]/30 border-transparent hover:border-[#9303C5]/30"
                            : "hover:bg-gray-50 border-transparent hover:border-gray-200"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) =>
                          toggleShareSelection(sh.name, e.target.checked)
                        }
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 w-4 h-4"
                      />
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center border ${
                          isDark
                            ? "bg-[#9303C5]/30 border-[#d8b4fe]/25"
                            : "bg-purple-100 border-purple-200"
                        }`}
                      >
                        <Activity
                          className={`h-4 w-4 ${
                            isDark ? "text-[#f0e6ff]" : "text-purple-600"
                          }`}
                          strokeWidth={2.4}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-semibold truncate ${strongText}`}
                        >
                          {sh.name}
                        </p>
                        <p className={`text-xs ${mutedText} tabular-nums`}>
                          ₹{sh.price.toFixed(2)}
                        </p>
                      </div>
                      {isSelected && (
                        <div
                          className={`text-[10px] font-bold uppercase tracking-wider ${
                            isDark ? "text-green-400" : "text-purple-600"
                          }`}
                        >
                          ✓ Selected
                        </div>
                      )}
                    </label>
                  );
                })
              )}
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mt-2">
            <div className={`text-xs ${mutedText}`}>
              {newNews.affectedShares.length} share(s) selected
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setNewNews({ ...newNews, affectedShares: [] });
                }}
                className="rounded-full"
              >
                Clear all
              </Button>
              <Button
                onClick={() => setShareModalOpen(false)}
                className={`rounded-full ${primaryBtnClass}`}
              >
                Done
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ═══════════════════ NEWS LIST ═══════════════════ */}
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
              subtitle="Latest headlines affecting share prices"
              isDark={isDark}
              count={{ value: news.length, label: "articles" }}
            />
          </CardHeader>

          <CardContent className="p-6">
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {news.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`text-center py-14 rounded-2xl border border-dashed ${
                      isDark
                        ? "border-[#9303C5]/30 text-gray-400 bg-[#2a0140]/10"
                        : "border-purple-200 text-gray-500 bg-purple-50/30"
                    }`}
                  >
                    <div
                      className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-3 border ${
                        isDark
                          ? "bg-[#9303C5]/20 border-[#d8b4fe]/25"
                          : "bg-white border-purple-200"
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
                      No news articles yet
                    </p>
                    <p className={`text-xs ${mutedText} mt-1`}>
                      Publish your first headline above
                    </p>
                  </motion.div>
                ) : (
                  news.map((n, idx) => (
                    <motion.div
                      key={n._id}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: idx * 0.04 }}
                      className={`relative rounded-xl border p-5 overflow-hidden transition-all duration-300 ${
                        isDark
                          ? "bg-[#02060E]/40 border-[#9303C5]/20 hover:border-[#9303C5]/50 hover:bg-[#2a0140]/20"
                          : "bg-white border-gray-200 hover:border-purple-300 hover:shadow-md"
                      }`}
                    >
                      <div
                        className={`absolute left-0 top-0 h-full w-1 ${
                          n.sentiment === "positive"
                            ? "bg-gradient-to-b from-green-500 to-emerald-600"
                            : "bg-gradient-to-b from-red-500 to-rose-600"
                        }`}
                      />

                      <div className="flex justify-between items-start gap-4 ml-3">
                        <div className="flex-1 min-w-0">
                          <h4
                            className={`font-semibold text-base mb-2 leading-snug ${strongText}`}
                          >
                            {n.headline}
                          </h4>
                          <div className="flex flex-wrap gap-2 items-center">
                            <div className="flex flex-wrap gap-1">
                              {n.affectedShares.slice(0, 4).map((share, i) => (
                                <Badge
                                  key={i}
                                  className={`text-[10px] rounded-full font-medium ${
                                    isDark
                                      ? "bg-[#2a0140]/60 text-[#e9d5ff] border border-[#d8b4fe]/20"
                                      : "bg-gray-100 text-gray-600 border border-gray-200"
                                  }`}
                                >
                                  {share}
                                </Badge>
                              ))}
                              {n.affectedShares.length > 4 && (
                                <Badge
                                  className={`text-[10px] rounded-full font-medium ${
                                    isDark
                                      ? "bg-[#2a0140]/60 text-[#e9d5ff] border border-[#d8b4fe]/20"
                                      : "bg-gray-100 text-gray-600 border border-gray-200"
                                  }`}
                                >
                                  +{n.affectedShares.length - 4}
                                </Badge>
                              )}
                            </div>
                            <Badge
                              className={`rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                n.sentiment === "positive"
                                  ? isDark
                                    ? "bg-green-500/20 text-green-300 border border-green-500/30"
                                    : "bg-green-100 text-green-700 border border-green-200"
                                  : isDark
                                    ? "bg-red-500/20 text-red-300 border border-red-500/30"
                                    : "bg-red-100 text-red-700 border border-red-200"
                              }`}
                            >
                              {n.sentiment === "positive"
                                ? "📈 Positive"
                                : "📉 Negative"}{" "}
                              · Impact {n.impact}/5
                            </Badge>
                          </div>
                          <p
                            className={`text-[11px] mt-3 flex items-center gap-1 ${mutedText}`}
                          >
                            🕒 {new Date(n.timestamp).toLocaleString()}
                          </p>
                        </div>

                        <button
                          onClick={() =>
                            axiosInstance
                              .delete(`/news/${n._id}`)
                              .then(fetchNews)
                          }
                          title="Delete news"
                          className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-95 ${
                            isDark
                              ? "bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/50"
                              : "bg-red-100 text-red-700 hover:bg-red-200 border border-red-300"
                          }`}
                        >
                          <Trash2 className="h-4 w-4" strokeWidth={2.4} />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ═══════════════════ LEADERBOARD ═══════════════════ */}
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
              subtitle="Top 15 participants by net worth"
              isDark={isDark}
            />
          </CardHeader>

          <CardContent className="p-0">
            {leaderboard.length === 0 ? (
              <div className={`p-14 text-center ${mutedText}`}>
                <div
                  className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-3 border ${
                    isDark
                      ? "bg-[#9303C5]/20 border-[#d8b4fe]/25"
                      : "bg-white border-purple-200"
                  }`}
                >
                  <Users
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
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr
                      className={`border-b ${
                        isDark
                          ? "border-[#9303C5]/20 bg-[#2a0140]/30"
                          : "bg-gray-50"
                      }`}
                    >
                      <th
                        className={`px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider ${mutedText}`}
                      >
                        Rank
                      </th>
                      <th
                        className={`px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider ${mutedText}`}
                      >
                        Participant
                      </th>
                      <th
                        className={`px-6 py-4 text-right text-[11px] font-bold uppercase tracking-wider ${mutedText}`}
                      >
                        Net Worth
                      </th>
                      <th
                        className={`px-6 py-4 text-center text-[11px] font-bold uppercase tracking-wider ${mutedText}`}
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((p, i) => (
                      <motion.tr
                        key={p.participantId}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className={`border-b transition-all duration-200 ${
                          isDark
                            ? "border-[#9303C5]/10 hover:bg-[#2a0140]/30"
                            : "border-gray-100 hover:bg-gray-50"
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {i === 0 && (
                              <span className="text-2xl drop-shadow">👑</span>
                            )}
                            {i === 1 && <span className="text-2xl">🥈</span>}
                            {i === 2 && <span className="text-2xl">🥉</span>}
                            {i > 2 && (
                              <span
                                className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold ${
                                  isDark
                                    ? "bg-[#2a0140] text-gray-300 border border-[#9303C5]/20"
                                    : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {i + 1}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div
                            className={`font-semibold text-sm ${strongText}`}
                          >
                            {p.name}
                          </div>
                          <div
                            className={`text-[11px] font-mono ${mutedText} mt-0.5`}
                          >
                            {p.participantId}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div
                            className={`font-bold text-lg tabular-nums ${priceText}`}
                          >
                            ₹{p.totalNetWorth.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => applyPenalty(p.participantId)}
                            title="Apply penalty"
                            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold transition-all active:scale-95 ${
                              isDark
                                ? "bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/50"
                                : "bg-red-100 text-red-700 hover:bg-red-200 border border-red-300"
                            }`}
                          >
                            <Shield className="h-3 w-3" strokeWidth={2.4} />
                            Penalty
                          </button>
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

      {/* ═══════════════════ ANALYTICS ═══════════════════ */}
      <motion.div variants={item}>
        <Card className={cardShell}>
          <CardContent className="p-0">
            <MostTradedPortfolio />
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card className={cardShell}>
          <CardContent className="p-0">
            <MostDiversifiedPortfolio />
          </CardContent>
        </Card>
      </motion.div>

      {/* ═══════════════════ BUMP DIALOG ═══════════════════ */}
      <Dialog open={bumpDialogOpen} onOpenChange={setBumpDialogOpen}>
        <DialogContent
          className={`sm:max-w-md rounded-2xl ${
            isDark
              ? "bg-[#02060E] border-[#9303C5]/30"
              : "bg-white border-gray-100"
          }`}
        >
          <DialogHeader>
            <DialogTitle className={strongText}>
              {bumpTarget?.sign === "+"
                ? "📈 Increase Share Price"
                : "📉 Decrease Share Price"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="relative">
              <Input
                type="number"
                min={1}
                placeholder="Enter percentage"
                value={bumpValue || ""}
                onChange={(e) => setBumpValue(+e.target.value)}
                className={`h-12 text-center text-lg font-bold tabular-nums pr-10 ${inputClass}`}
              />
              <span
                className={`absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold ${mutedText}`}
              >
                %
              </span>
            </div>

            <p className={`text-xs flex items-center gap-1.5 ${mutedText}`}>
              <AlertCircle className="h-3.5 w-3.5" />
              Example: 5 means {bumpTarget?.sign}5% change
            </p>
          </div>

          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setBumpDialogOpen(false)}
              className="rounded-full"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmBump}
              className={`rounded-full ${primaryBtnClass}`}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default AdminDashboard;