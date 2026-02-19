// src/components/Dhikr/DhikrStreak.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Trophy } from "lucide-react";

const STORAGE_KEY = "dhikrStreak";

function getTodayKey() {
  return new Date().toISOString().split("T")[0];
}

// ─── Hook — use this inside DhikrPanel ───────────────────────────────────────
export function useDhikrStreak() {
  const [streak, setStreak] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
        current: 0,
        best: 0,
        lastCompleted: null,
        completedDays: [],
      };
    } catch {
      return { current: 0, best: 0, lastCompleted: null, completedDays: [] };
    }
  });

  const markTodayComplete = () => {
    const today = getTodayKey();
    if (streak.lastCompleted === today) return;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = yesterday.toISOString().split("T")[0];

    const isConsecutive = streak.lastCompleted === yesterdayKey;
    const newCurrent = isConsecutive ? streak.current + 1 : 1;
    const newBest = Math.max(streak.best, newCurrent);

    const updated = {
      current: newCurrent,
      best: newBest,
      lastCompleted: today,
      completedDays: [...(streak.completedDays || []).slice(-29), today],
    };

    setStreak(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return true;
  };

  const completedToday = streak.lastCompleted === getTodayKey();

  return { streak, markTodayComplete, completedToday };
}

// ─── UI Component — add this at the bottom of DhikrPanel JSX ─────────────────
export default function DhikrStreak({ streak, completedToday }) {
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (completedToday && streak.current > 0) {
      setShowCelebration(true);
      const t = setTimeout(() => setShowCelebration(false), 3000);
      return () => clearTimeout(t);
    }
  }, [completedToday]);

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split("T")[0];
  });

  return (
    <div className="mt-4 p-4 rounded-2xl border border-white/8 bg-white/3 relative overflow-hidden">
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-amber-400/10 rounded-2xl pointer-events-none"
          />
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Flame size={14} className={streak.current > 0 ? "text-orange-400" : "opacity-30"} />
          <span className="text-xs font-medium opacity-60">Dhikr Streak</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Trophy size={11} className="text-amber-400/50" />
            <span className="text-xs opacity-40">Best: {streak.best}</span>
          </div>
          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-xl border ${
            streak.current > 0
              ? "border-orange-400/30 bg-orange-400/10 text-orange-400"
              : "border-white/8 opacity-30"
          }`}>
            <Flame size={11} />
            <span className="text-xs font-bold">{streak.current}</span>
          </div>
        </div>
      </div>

      {/* Last 7 days */}
      <div className="flex items-center gap-1.5">
        {last7.map((day) => {
          const done = streak.completedDays?.includes(day);
          const isToday = day === getTodayKey();
          return (
            <div key={day} className="flex-1 flex flex-col items-center gap-1">
              <motion.div
                initial={false}
                animate={{ scale: done ? 1 : 0.7 }}
                className={`w-full h-2 rounded-full transition-all ${
                  done
                    ? isToday
                      ? "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]"
                      : "bg-amber-400/60"
                    : isToday
                    ? "bg-white/20 border border-white/20"
                    : "bg-white/8"
                }`}
              />
              <span className="text-[9px] opacity-20">
                {["S","M","T","W","T","F","S"][new Date(day + "T12:00:00").getDay()]}
              </span>
            </div>
          );
        })}
      </div>

      {completedToday && (
        <motion.p
          initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
          className="text-xs text-amber-400/60 text-center mt-2"
        >
          ✨ MashaAllah — dhikr complete today!
        </motion.p>
      )}
    </div>
  );
}