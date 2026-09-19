// EmployeeDashboard.tsx - Portal dropdowns, no clipping
import React, {
  useEffect,
  useState,
  useRef,
  useLayoutEffect,
} from "react";
import { createPortal } from "react-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  TrendingUp,
  TrendingDown,
  Users,
  ArrowLeftRight,
  Activity,
  Wallet,
  Building2,
  Search,
  Store,
  Repeat,
  ArrowUpRight,
  ChevronDown,
  Check,
} from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import { io } from "socket.io-client";
import { AxiosError } from "axios";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";

interface Share {
  _id: string;
  name: string;
  price: number;
  change: number;
}

interface Holding {
  shareSymbol: string;
  quantity: number;
}

interface User {
  _id: string;
  name: string;
  role: "admin" | "employee" | "participant";
  participantId: string;
  balance: number;
  holdings?: Holding[];
}

interface EmployeeUser {
  _id: string;
  name: string;
  role: "admin" | "employee" | "participant";
  email?: string;
  participantId?: string;
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
/*              InputWithIcon                  */
/* ═══════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════ */
/*          Custom Dropdown Component          */
/*      (Portal-based, never clipped)          */
/* ═══════════════════════════════════════════ */
interface DropdownOption {
  value: string;
  label: string;
  hint?: string;
  accent?: "green" | "red" | "default";
}

const CustomDropdown = ({
  value,
  onChange,
  options,
  placeholder,
  isDark,
  name,
}: {
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  placeholder: string;
  isDark: boolean;
  name?: string;
}) => {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [panelStyle, setPanelStyle] = useState<React.CSSProperties>({});
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === value);

  /* Track mount so we can safely use createPortal (SSR-safe) */
  useEffect(() => {
    setMounted(true);
  }, []);

  /* Position the panel below the trigger whenever it opens or the page resizes/scrolls */
  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return;

    const update = () => {
      if (!triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      setPanelStyle({
        position: "fixed",
        top: rect.bottom + 8,
        left: rect.left,
        width: rect.width,
        zIndex: 9999,
      });
    };

    update();

    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [open]);

  /* Close on outside click */
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        panelRef.current &&
        !panelRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  /* Close on Escape */
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  /* Panel content — rendered either in place or via portal */
  const panelContent = (
    <motion.div
      ref={panelRef}
      initial={{ opacity: 0, y: -6, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.98 }}
      transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
      style={panelStyle}
      className={`rounded-xl border shadow-2xl overflow-hidden ${
        isDark
          ? "bg-[#0a0518] border-[#9303C5]/40 shadow-[0_20px_60px_-15px_rgba(147,3,197,0.6)]"
          : "bg-white border-purple-200 shadow-[0_20px_60px_-15px_rgba(99,86,215,0.35)]"
      }`}
    >
      {/* Top gradient hairline */}
      <div
        className={`absolute inset-x-6 top-0 h-px ${
          isDark
            ? "bg-gradient-to-r from-transparent via-[#d8b4fe]/60 to-transparent"
            : "bg-gradient-to-r from-transparent via-purple-300 to-transparent"
        }`}
      />

      <div className="max-h-64 overflow-y-auto py-1.5 custom-scrollbar">
        {options.length === 0 ? (
          <div
            className={`px-4 py-3 text-xs text-center ${
              isDark ? "text-gray-500" : "text-gray-400"
            }`}
          >
            No options available
          </div>
        ) : (
          options.map((option) => {
            const isSelected = option.value === value;
            const accentColor =
              option.accent === "green"
                ? isDark
                  ? "text-green-300"
                  : "text-green-600"
                : option.accent === "red"
                  ? isDark
                    ? "text-red-300"
                    : "text-red-600"
                  : isDark
                    ? "text-white"
                    : "text-gray-800";

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-3.5 py-2.5 text-left text-sm transition-colors ${
                  isSelected
                    ? isDark
                      ? "bg-[#9303C5]/30 text-white"
                      : "bg-purple-50 text-purple-900"
                    : isDark
                      ? "text-gray-200 hover:bg-[#9303C5]/15"
                      : "text-gray-700 hover:bg-purple-50/60"
                }`}
              >
                <span
                  className={`flex-1 truncate font-medium ${accentColor}`}
                >
                  {option.label}
                </span>
                {option.hint && (
                  <span
                    className={`text-xs tabular-nums shrink-0 ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {option.hint}
                  </span>
                )}
                {isSelected && (
                  <Check
                    className={`h-4 w-4 shrink-0 ${
                      isDark ? "text-[#d8b4fe]" : "text-purple-600"
                    }`}
                    strokeWidth={2.8}
                  />
                )}
              </button>
            );
          })
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="relative">
      {/* Hidden input for form submission */}
      <input type="hidden" name={name} value={value} />

      {/* Trigger */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5 text-sm text-left transition-all duration-200 focus:outline-none focus:ring-2 ${
          isDark
            ? "bg-[#02060E]/80 border-[#9303C5]/30 text-white focus:border-[#9303C5] focus:ring-[#9303C5]/40"
            : "bg-white border-gray-200 text-gray-800 focus:border-purple-500 focus:ring-purple-200/50"
        } ${
          open
            ? isDark
              ? "ring-2 ring-[#9303C5]/40"
              : "ring-2 ring-purple-200/50"
            : ""
        }`}
      >
        <span
          className={`truncate ${
            !selectedOption
              ? isDark
                ? "text-gray-500"
                : "text-gray-400"
              : ""
          }`}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          } ${isDark ? "text-[#d8b4fe]" : "text-purple-500"}`}
          strokeWidth={2.4}
        />
      </button>

      {/* Panel — rendered via portal so it escapes any parent overflow context */}
      {mounted && createPortal(
        <AnimatePresence>{open && panelContent}</AnimatePresence>,
        document.body
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════ */
/*                Main Component               */
/* ═══════════════════════════════════════════ */
const EmployeeDashboard = ({ user }: { user: EmployeeUser }) => {
  const [shares, setShares] = useState<Share[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { theme } = useTheme();
  const { toast } = useToast();

  const isDark: boolean = theme === "dark";

  const participants: User[] = users.filter((u) => u.role === "participant");

  const filteredParticipants: User[] = participants.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.participantId.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  /* ───── Direct trade form state ───── */
  const [directParticipant, setDirectParticipant] = useState("");
  const [directShare, setDirectShare] = useState("");
  const [directAction, setDirectAction] = useState("buy");

  /* ───── P2P trade form state ───── */
  const [p2pBuyer, setP2pBuyer] = useState("");
  const [p2pSeller, setP2pSeller] = useState("");
  const [p2pShare, setP2pShare] = useState("");

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
      : "bg-gray-50/60 border-gray-200 text-gray-800 focus:border-purple-500 focus:ring-purple-200/50 placeholder:text-gray-400"
  }`;

  const mutedText = isDark ? "text-gray-400" : "text-gray-500";
  const strongText = isDark ? "text-white" : "text-gray-900";
  const priceText = isDark ? "text-[#d8b4fe]" : "text-purple-700";
  const tableHeaderClass = isDark
    ? "bg-[#2a0140]/40 border-b border-[#9303C5]/20"
    : "bg-gray-50/80 border-b border-gray-100";

  /* ───── Build dropdown options ───── */
  const participantOptions: DropdownOption[] = participants.map((p) => ({
    value: p.participantId,
    label: p.name,
    hint: p.participantId,
  }));

  const shareOptions: DropdownOption[] = shares.map((s) => ({
    value: s.name,
    label: s.name,
    hint: `₹${s.price.toFixed(2)}`,
  }));

  const actionOptions: DropdownOption[] = [
    { value: "buy", label: "📈 Buy from Market", accent: "green" },
    { value: "sell", label: "📉 Sell to Market", accent: "red" },
  ];

  useEffect(() => {
    const loadInitial = async () => {
      try {
        const [sRes, uRes] = await Promise.all([
          axiosInstance.get("/shares"),
          axiosInstance.get("/users"),
        ]);
        setShares(sRes.data || []);
        setUsers(uRes.data || []);
      } catch {
        toast({
          title: "Error",
          description: "Failed to load initial data",
          variant: "destructive",
        });
      }
    };
    loadInitial();

    socket.on("share:update", (updated: Share) => {
      setShares((prev) =>
        prev.some((s) => s._id === updated._id)
          ? prev.map((s) => (s._id === updated._id ? updated : s))
          : [...prev, updated],
      );
    });
    socket.on("share:add", (newShare: Share) => {
      setShares((prev) => [...prev, newShare]);
      toast({
        title: "📈 New Share Listed",
        description: `${newShare.name} listed at ₹${newShare.price}`,
      });
    });

    socket.on("share:delete", (id: string) => {
      setShares((prev) => prev.filter((s) => s._id !== id));
    });

    socket.on("user:update", (changedUsers: User[]) => {
      setUsers((prev) => {
        const map = new Map(prev.map((u) => [u.participantId, u]));
        changedUsers.forEach((u: User) => map.set(u.participantId, u));
        return Array.from(map.values());
      });
    });

    socket.on("market:status", ({ running }: { running: boolean }) => {
      toast({
        title: running ? "📊 Market Resumed" : "⛔ Market Paused",
      });
    });

    return () => {
      socket.off("share:update");
      socket.off("share:delete");
      socket.off("share:add");
      socket.off("user:update");
      socket.off("market:status");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDirectTrade = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = {
      type: "direct",
      action: formData.get("action"),
      participantId: formData.get("participantId"),
      shareSymbol: formData.get("shareSymbol"),
      quantity: parseInt(formData.get("quantity") as string, 10),
    };

    try {
      await axiosInstance.post("/trade", payload);
      toast({
        title: "Trade Executed",
        description: "Trade completed successfully",
      });
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        toast({
          title: "Trade Failed",
          description: err.response?.data?.message || "Unknown error",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Trade Failed",
          description: "Unexpected error occurred",
          variant: "destructive",
        });
      }
    }
    form.reset();
    setDirectParticipant("");
    setDirectShare("");
    setDirectAction("buy");
  };

  const handleP2PTrade = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = {
      type: "p2p",
      buyerParticipantId: formData.get("buyerParticipantId"),
      sellerParticipantId: formData.get("sellerParticipantId"),
      shareSymbol: formData.get("p2pShareSymbol"),
      quantity: parseInt(formData.get("p2pQuantity") as string, 10),
      price: parseFloat(formData.get("p2pPrice") as string),
    };

    try {
      await axiosInstance.post("/trade", payload);
      toast({
        title: "P2P Executed",
        description: "P2P trade completed successfully",
      });
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        toast({
          title: "Trade Failed",
          description: err.response?.data?.message || "Unknown error",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Trade Failed",
          description: "Unexpected error occurred",
          variant: "destructive",
        });
      }
    }
    form.reset();
    setP2pBuyer("");
    setP2pSeller("");
    setP2pShare("");
  };

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
              icon={Activity}
              title="Market Overview"
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
                  Live
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
                      className={`p-4 text-left text-[11px] font-bold uppercase tracking-wider ${mutedText}`}
                    >
                      Name
                    </th>
                    <th
                      className={`p-4 text-right text-[11px] font-bold uppercase tracking-wider ${mutedText}`}
                    >
                      Price
                    </th>
                    <th
                      className={`p-4 text-right text-[11px] font-bold uppercase tracking-wider ${mutedText}`}
                    >
                      Change
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {shares.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="p-12 text-center">
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
                            No shares available
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    shares.map((s, idx) => (
                      <motion.tr
                        key={s._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.02 }}
                        className={`border-b transition-all duration-200 ${
                          isDark
                            ? "border-[#9303C5]/10 hover:bg-[#2a0140]/30"
                            : "border-gray-100 hover:bg-gray-50"
                        }`}
                      >
                        <td className={`p-4 font-medium ${strongText}`}>
                          {s.name}
                        </td>
                        <td
                          className={`p-4 text-right font-bold tabular-nums ${priceText}`}
                        >
                          ₹{s.price.toFixed(2)}
                        </td>
                        <td className="p-4 text-right">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold tabular-nums ${
                              s.change >= 0
                                ? isDark
                                  ? "bg-green-500/15 text-green-300 border border-green-500/30"
                                  : "bg-green-50 text-green-700 border border-green-200"
                                : isDark
                                  ? "bg-red-500/15 text-red-300 border border-red-500/30"
                                  : "bg-red-50 text-red-700 border border-red-200"
                            }`}
                          >
                            {s.change >= 0 ? (
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
                            {s.change >= 0 ? "+" : ""}
                            {s.change.toFixed(2)}%
                          </span>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ═══════════════ TRADING INTERFACE ═══════════════ */}
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
              icon={Wallet}
              title="Trading Interface"
              isDark={isDark}
            />
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="direct">
              <TabsList
                className={`grid w-full grid-cols-2 p-1.5 rounded-xl ${
                  isDark ? "bg-[#2a0140]/50" : "bg-gray-100"
                }`}
              >
                <TabsTrigger
                  value="direct"
                  className={`rounded-lg transition-all duration-200 flex items-center gap-2 text-sm font-medium ${
                    isDark
                      ? "data-[state=active]:bg-[#9303C5] data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-[#9303C5]/40"
                      : "data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-purple-700"
                  }`}
                >
                  <Store className="h-4 w-4" strokeWidth={2.4} />
                  Trade w/ Exchange
                </TabsTrigger>
                <TabsTrigger
                  value="p2p"
                  className={`rounded-lg transition-all duration-200 flex items-center gap-2 text-sm font-medium ${
                    isDark
                      ? "data-[state=active]:bg-[#9303C5] data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-[#9303C5]/40"
                      : "data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-purple-700"
                  }`}
                >
                  <Repeat className="h-4 w-4" strokeWidth={2.4} />
                  P2P Trade
                </TabsTrigger>
              </TabsList>

              {/* ────── DIRECT TRADE ────── */}
              <TabsContent value="direct" className="space-y-5 mt-6">
                <form onSubmit={handleDirectTrade} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label
                        className={`text-xs font-semibold uppercase tracking-wider ${mutedText} mb-2 block`}
                      >
                        Participant
                      </Label>
                      <CustomDropdown
                        name="participantId"
                        value={directParticipant}
                        onChange={setDirectParticipant}
                        options={participantOptions}
                        placeholder="Select participant"
                        isDark={isDark}
                      />
                    </div>
                    <div>
                      <Label
                        className={`text-xs font-semibold uppercase tracking-wider ${mutedText} mb-2 block`}
                      >
                        Share
                      </Label>
                      <CustomDropdown
                        name="shareSymbol"
                        value={directShare}
                        onChange={setDirectShare}
                        options={shareOptions}
                        placeholder="Select share"
                        isDark={isDark}
                      />
                    </div>
                    <div>
                      <Label
                        className={`text-xs font-semibold uppercase tracking-wider ${mutedText} mb-2 block`}
                      >
                        Quantity
                      </Label>
                      <Input
                        name="quantity"
                        type="number"
                        min={1}
                        required
                        className={`h-11 rounded-xl ${inputClass}`}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label
                        className={`text-xs font-semibold uppercase tracking-wider ${mutedText} mb-2 block`}
                      >
                        Action
                      </Label>
                      <CustomDropdown
                        name="action"
                        value={directAction}
                        onChange={setDirectAction}
                        options={actionOptions}
                        placeholder="Select action"
                        isDark={isDark}
                      />
                    </div>
                  </div>
                  <motion.div
                    whileTap={{ scale: 0.98 }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <Button
                      className={`w-full h-12 rounded-xl font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5 ${
                        isDark
                          ? "bg-gradient-to-r from-[#9303C5] to-[#6b02b3] text-white hover:shadow-lg hover:shadow-[#9303C5]/50 shadow-[#9303C5]/40 shadow-lg"
                          : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-purple-500/30 shadow-purple-500/20 shadow-lg"
                      }`}
                    >
                      <ArrowUpRight
                        className="h-4 w-4 mr-2"
                        strokeWidth={2.6}
                      />
                      Execute Trade
                    </Button>
                  </motion.div>
                </form>
              </TabsContent>

              {/* ────── P2P TRADE ────── */}
              <TabsContent value="p2p" className="space-y-5 mt-6">
                <form onSubmit={handleP2PTrade} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label
                        className={`text-xs font-semibold uppercase tracking-wider ${mutedText} mb-2 block`}
                      >
                        Buyer
                      </Label>
                      <CustomDropdown
                        name="buyerParticipantId"
                        value={p2pBuyer}
                        onChange={setP2pBuyer}
                        options={participantOptions}
                        placeholder="Select buyer"
                        isDark={isDark}
                      />
                    </div>
                    <div>
                      <Label
                        className={`text-xs font-semibold uppercase tracking-wider ${mutedText} mb-2 block`}
                      >
                        Seller
                      </Label>
                      <CustomDropdown
                        name="sellerParticipantId"
                        value={p2pSeller}
                        onChange={setP2pSeller}
                        options={participantOptions}
                        placeholder="Select seller"
                        isDark={isDark}
                      />
                    </div>
                    <div>
                      <Label
                        className={`text-xs font-semibold uppercase tracking-wider ${mutedText} mb-2 block`}
                      >
                        Share
                      </Label>
                      <CustomDropdown
                        name="p2pShareSymbol"
                        value={p2pShare}
                        onChange={setP2pShare}
                        options={shareOptions}
                        placeholder="Select share"
                        isDark={isDark}
                      />
                    </div>
                    <div>
                      <Label
                        className={`text-xs font-semibold uppercase tracking-wider ${mutedText} mb-2 block`}
                      >
                        Quantity
                      </Label>
                      <Input
                        name="p2pQuantity"
                        type="number"
                        min={1}
                        required
                        className={`h-11 rounded-xl ${inputClass}`}
                        placeholder="0"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label
                        className={`text-xs font-semibold uppercase tracking-wider ${mutedText} mb-2 block`}
                      >
                        Price per share (₹)
                      </Label>
                      <Input
                        name="p2pPrice"
                        type="number"
                        step="0.01"
                        min={0}
                        required
                        className={`h-11 rounded-xl ${inputClass}`}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <motion.div
                    whileTap={{ scale: 0.98 }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <Button
                      className={`w-full h-12 rounded-xl font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5 ${
                        isDark
                          ? "bg-gradient-to-r from-[#9303C5] to-[#6b02b3] text-white hover:shadow-lg hover:shadow-[#9303C5]/50 shadow-[#9303C5]/40 shadow-lg"
                          : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-purple-500/30 shadow-purple-500/20 shadow-lg"
                      }`}
                    >
                      <ArrowLeftRight
                        className="h-4 w-4 mr-2"
                        strokeWidth={2.6}
                      />
                      Execute P2P Trade
                    </Button>
                  </motion.div>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>

      {/* ═══════════════ ACTIVE PARTICIPANTS ═══════════════ */}
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
              icon={Building2}
              title="Active Participants"
              isDark={isDark}
              badge={
                <span
                  className={`inline-flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-widest border tabular-nums ${
                    isDark
                      ? "bg-[#9303C5]/25 text-[#e9d5ff] border-[#d8b4fe]/25"
                      : "bg-purple-50 text-purple-700 border-purple-200"
                  }`}
                >
                  {participants.length} Active
                </span>
              }
              right={
                <div className="relative w-full sm:w-64">
                  <InputWithIcon
                    icon={Search}
                    isDark={isDark}
                    placeholder="Search participants…"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`h-11 ${inputClass}`}
                  />
                </div>
              }
            />
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={tableHeaderClass}>
                    <th
                      className={`p-4 text-left text-[11px] font-bold uppercase tracking-wider ${mutedText}`}
                    >
                      PID
                    </th>
                    <th
                      className={`p-4 text-left text-[11px] font-bold uppercase tracking-wider ${mutedText}`}
                    >
                      Name
                    </th>
                    <th
                      className={`p-4 text-right text-[11px] font-bold uppercase tracking-wider ${mutedText}`}
                    >
                      Balance
                    </th>
                    <th
                      className={`p-4 text-center text-[11px] font-bold uppercase tracking-wider ${mutedText}`}
                    >
                      Holdings
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredParticipants.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-12 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <div
                            className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl border ${
                              isDark
                                ? "bg-[#9303C5]/20 border-[#d8b4fe]/25"
                                : "bg-purple-50 border-purple-200"
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
                            {searchTerm
                              ? "No matching participants"
                              : "No participants yet"}
                          </p>
                          {searchTerm && (
                            <button
                              onClick={() => setSearchTerm("")}
                              className={`text-xs font-semibold underline decoration-dotted underline-offset-4 ${
                                isDark ? "text-[#d8b4fe]" : "text-purple-600"
                              }`}
                            >
                              Clear search
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredParticipants.map((p, idx) => (
                      <motion.tr
                        key={p._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.02 }}
                        className={`border-b transition-all duration-200 ${
                          isDark
                            ? "border-[#9303C5]/10 hover:bg-[#2a0140]/30"
                            : "border-gray-100 hover:bg-gray-50"
                        }`}
                      >
                        <td
                          className={`p-4 font-mono text-xs font-semibold ${priceText}`}
                        >
                          {p.participantId}
                        </td>
                        <td className={`p-4 font-medium ${strongText}`}>
                          {p.name}
                        </td>
                        <td
                          className={`p-4 text-right font-bold tabular-nums ${strongText}`}
                        >
                          ₹{p.balance.toLocaleString()}
                        </td>
                        <td className="p-4 text-center">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold tabular-nums border ${
                              isDark
                                ? "bg-[#9303C5]/25 text-[#e9d5ff] border-[#d8b4fe]/25"
                                : "bg-purple-50 text-purple-700 border-purple-200"
                            }`}
                          >
                            {p.holdings?.length || 0}{" "}
                            {p.holdings?.length === 1 ? "asset" : "assets"}
                          </span>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default EmployeeDashboard;