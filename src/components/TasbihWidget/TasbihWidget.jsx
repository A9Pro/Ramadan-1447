// src/components/TasbihWidget/TasbihWidget.jsx
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw } from "lucide-react";

const PRESETS = [33, 99, 100];
const DHIKR_LABELS = {
  33: ["سُبْحَانَ ٱللَّٰهِ", "SubhanAllah"],
  99: ["اللَّٰهُ أَكْبَرُ", "Allahu Akbar"],
  100: ["لَا إِلَٰهَ إِلَّا ٱللَّٰهُ", "La ilaha illallah"],
};

export default function TasbihWidget() {
  const [count, setCount] = useState(() => parseInt(localStorage.getItem("tasbihCount") || "0"));
  const [goal, setGoal] = useState(() => parseInt(localStorage.getItem("tasbihGoal") || "33"));
  const [showMenu, setShowMenu] = useState(false);
  const [pulse, setPulse] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => { localStorage.setItem("tasbihCount", count); }, [count]);
  useEffect(() => { localStorage.setItem("tasbihGoal", goal); }, [goal]);

  const handleCount = useCallback(() => {
    setCount((prev) => {
      const next = prev + 1;
      if (next === goal) setCompleted(true);
      return next;
    });
    setPulse(true);
    setTimeout(() => setPulse(false), 180);
  }, [goal]);

  // Keyboard shortcut — spacebar counts
  useEffect(() => {
    const handler = (e) => {
      if (e.code === "Space" && e.target === document.body) {
        e.preventDefault();
        handleCount();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [handleCount]);

  const handleReset = () => {
    setCount(0);
    setCompleted(false);
    setShowMenu(false);
  };

  const handleGoal = (g) => {
    setGoal(g);
    setCount(0);
    setCompleted(false);
    setShowMenu(false);
  };

  const progress = Math.min(count / goal, 1);
  const circumference = 2 * Math.PI * 28; // r=28
  const dashOffset = circumference * (1 - progress);
  const label = DHIKR_LABELS[goal] || ["ذِكْر", "Dhikr"];
  const overGoal = count > goal;
  const rounds = overGoal ? Math.floor(count / goal) : 0;

  return (
    <div className="fixed top-1/2 -translate-y-1/2 right-4 z-50 flex flex-col items-end gap-2">

      {/* Preset menu */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="flex flex-col gap-1.5 items-end"
          >
            {/* Goal presets */}
            {PRESETS.map((g) => (
              <motion.button key={g} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => handleGoal(g)}
                className={`flex items-center gap-2 px-3 py-2 rounded-2xl border text-xs font-medium transition-all backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.4)] ${
                  goal === g
                    ? "border-amber-400/40 bg-amber-400/15 text-amber-400"
                    : "border-white/10 bg-[#041C2C]/90 opacity-60 hover:opacity-100"
                }`}>
                <span className="text-base leading-none">{DHIKR_LABELS[g][0]}</span>
                <span>×{g}</span>
              </motion.button>
            ))}

            {/* Reset */}
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={handleReset}
              className="flex items-center gap-2 px-3 py-2 rounded-2xl border border-white/10 bg-[#041C2C]/90 backdrop-blur-xl text-xs opacity-50 hover:opacity-90 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
              <RotateCcw size={11} /> Reset
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Completed banner */}
      <AnimatePresence>
        {completed && (
          <motion.div
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
            className="px-3 py-1.5 rounded-2xl border border-amber-400/30 bg-amber-400/10 text-amber-400 text-xs font-medium backdrop-blur-xl"
          >
            ✨ MashaAllah! {goal} complete
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main tasbih bead */}
      <div className="relative">
        {/* Long-press / right-click to open menu — tap the small dot instead */}
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={handleCount}
          onContextMenu={(e) => { e.preventDefault(); setShowMenu(!showMenu); }}
          className="relative w-[72px] h-[72px] flex items-center justify-center"
          title="Tap to count · Right-click for options"
        >
          {/* SVG ring progress */}
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 72 72">
            {/* Track */}
            <circle cx="36" cy="36" r="28" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
            {/* Progress */}
            <motion.circle
              cx="36" cy="36" r="28"
              fill="none"
              stroke={completed ? "#34d399" : "#f59e0b"}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              animate={{ strokeDashoffset: dashOffset }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </svg>

          {/* Bead body */}
          <motion.div
            animate={{ scale: pulse ? 0.9 : 1 }}
            transition={{ duration: 0.15 }}
            className="relative w-[52px] h-[52px] rounded-full border shadow-[0_0_20px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.15)] flex items-center justify-center cursor-pointer select-none"
            style={{
              background: "radial-gradient(circle at 35% 35%, #1a3a50, #041C2C)",
              borderColor: completed ? "rgba(52,211,153,0.4)" : "rgba(245,158,11,0.3)",
              boxShadow: pulse
                ? `0 0 24px ${completed ? "rgba(52,211,153,0.4)" : "rgba(245,158,11,0.5)"}, inset 0 1px 0 rgba(255,255,255,0.15)`
                : `0 0 12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)`,
            }}
          >
            <AnimatePresence mode="popLayout">
              <motion.span
                key={count}
                initial={{ y: -8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 8, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className={`text-lg font-bold tabular-nums leading-none ${
                  completed ? "text-emerald-400" : "text-amber-400"
                }`}
              >
                {count > 999 ? `${Math.floor(count / 1000)}k` : count}
              </motion.span>
            </AnimatePresence>
          </motion.div>
        </motion.button>

        {/* Tiny settings dot */}
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => setShowMenu(!showMenu)}
          className="absolute -top-1 -right-1 w-5 h-5 rounded-full border border-white/15 bg-[#041C2C]/90 backdrop-blur-sm flex items-center justify-center"
        >
          <span className="text-[8px] opacity-50 leading-none">⚙</span>
        </motion.button>

        {/* Rounds badge */}
        {rounds > 0 && (
          <div className="absolute -bottom-1 -left-1 px-1.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-400 text-[9px] font-bold leading-none">
            ×{rounds}
          </div>
        )}
      </div>

      {/* Label under bead */}
      <div className="text-center pointer-events-none">
        <p className="text-[10px] opacity-30 font-arabic leading-none">{label[0]}</p>
        <p className="text-[8px] opacity-20 mt-0.5">{count}/{goal}</p>
      </div>
    </div>
  );
}