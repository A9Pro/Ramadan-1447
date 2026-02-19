// src/components/Dhikr/DhikrPanel.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, ChevronLeft, ChevronRight, Languages } from "lucide-react";
import dhikrList from "./dhikrList.json";

// ─── Tasbih Ring Counter ──────────────────────────────────────────────────────
function TasbihCounter({ count, goal, onClick, completed, pulse }) {
  const size = 220;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(count / goal, 1);
  const offset = circumference * (1 - progress);

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.button
        onClick={onClick}
        disabled={completed}
        whileTap={!completed ? { scale: 0.95 } : {}}
        animate={pulse ? { scale: [1, 1.04, 1] } : {}}
        transition={{ duration: 0.15 }}
        className="relative flex items-center justify-center select-none"
        style={{ width: size, height: size }}
      >
        <svg width={size} height={size} className="absolute inset-0" style={{ transform: "rotate(-90deg)" }}>
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor"
            strokeWidth={strokeWidth} className="opacity-10" />
          <motion.circle cx={size / 2} cy={size / 2} r={radius} fill="none"
            stroke="#c9a96e" strokeWidth={strokeWidth} strokeLinecap="round"
            strokeDasharray={circumference}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          />
        </svg>

        <div
          className={`relative z-10 flex flex-col items-center justify-center rounded-full transition-all duration-300 ${
            completed
              ? "bg-amber-400/20 border-2 border-amber-400/50"
              : "bg-black/10 border-2 border-white/10"
          }`}
          style={{ width: size - strokeWidth * 3, height: size - strokeWidth * 3 }}
        >
          <div className="absolute top-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 blur-sm"
            style={{ width: "55%", height: "28%" }} />

          {completed ? (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
              className="flex flex-col items-center gap-1">
              <span className="text-5xl">✓</span>
              <span className="text-xs opacity-60">Complete</span>
            </motion.div>
          ) : (
            <motion.span key={count}
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="text-6xl font-bold tabular-nums text-amber-400"
              style={{ lineHeight: 1 }}
            >
              {String(count).padStart(2, "0")}
            </motion.span>
          )}
          {!completed && <span className="text-sm opacity-40 mt-1">/ {goal}</span>}
        </div>
      </motion.button>
      <p className="text-xs opacity-40 mt-1">Tap to count</p>
    </div>
  );
}

// ─── Dhikr Text Card ──────────────────────────────────────────────────────────
function DhikrTextCard({ dhikr, direction }) {
  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={`${dhikr.arabic}-${dhikr.text}`}
        custom={direction}
        initial={{ opacity: 0, y: direction * 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: direction * -12 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="rounded-2xl border border-white/8 bg-white/3 px-5 py-5 space-y-3 text-center"
      >
        {/* Arabic */}
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.3 }}
          className="text-2xl leading-relaxed font-arabic text-amber-400"
          dir="rtl"
          style={{ fontFamily: "'Noto Naskh Arabic', 'Amiri', 'Scheherazade New', serif" }}
        >
          {dhikr.arabic}
        </motion.p>

        {/* Divider */}
        <div className="w-12 h-px bg-amber-400/20 mx-auto" />

        {/* Transliteration */}
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="text-sm font-medium opacity-70 italic tracking-wide"
        >
          {dhikr.transliteration}
        </motion.p>

        {/* Translation */}
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.3 }}
          className="text-xs opacity-45 leading-relaxed"
        >
          "{dhikr.translation}"
        </motion.p>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Main Panel ───────────────────────────────────────────────────────────────
export default function DhikrPanel() {
  const [categoryIdx, setCategoryIdx] = useState(0);
  const [dhikrIdx, setDhikrIdx] = useState(0);
  const [counts, setCounts] = useState({});
  const [catDirection, setCatDirection] = useState(1);
  const [dhikrDirection, setDhikrDirection] = useState(1);
  const [pulse, setPulse] = useState(false);

  const category = dhikrList[categoryIdx];
  const dhikrItems = category.dhikr;
  const currentDhikr = dhikrItems[dhikrIdx];
  const countKey = `${categoryIdx}-${dhikrIdx}`;
  const count = counts[countKey] || 0;
  const goal = currentDhikr.goal || 33;
  const completed = count >= goal;

  const selectCategory = (idx) => {
    setCatDirection(idx > categoryIdx ? 1 : -1);
    setCategoryIdx(idx);
    setDhikrIdx(0);
    setDhikrDirection(1);
  };

  const selectDhikr = (idx) => {
    setDhikrDirection(idx > dhikrIdx ? 1 : -1);
    setDhikrIdx(idx);
  };

  const handleCount = () => {
    if (completed) return;
    setCounts((prev) => ({ ...prev, [countKey]: (prev[countKey] || 0) + 1 }));
    setPulse(true);
    setTimeout(() => setPulse(false), 150);
  };

  const handleReset = () => setCounts((prev) => ({ ...prev, [countKey]: 0 }));

  const goNext = () => { if (dhikrIdx < dhikrItems.length - 1) selectDhikr(dhikrIdx + 1); };
  const goPrev = () => { if (dhikrIdx > 0) selectDhikr(dhikrIdx - 1); };

  const categoryCompleted = dhikrItems.filter(
    (item, i) => (counts[`${categoryIdx}-${i}`] || 0) >= item.goal
  ).length;

  return (
    <div className="rounded-3xl p-8 border border-white/10 bg-ramadan-dark-elevated shadow-medium">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-amber-400">Dhikr & Remembrance</h2>
          <p className="text-sm mt-1 opacity-50">Tap the circle to count</p>
        </div>
        <div className="flex items-center gap-2">
          <Languages size={14} className="text-amber-400/40" />
          <span className="text-xs opacity-40">
            <span className="text-amber-400 font-medium opacity-100">{categoryCompleted}</span>
            {" / "}{dhikrItems.length} done
          </span>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none mb-6">
        {dhikrList.map((cat, idx) => {
          const isActive = categoryIdx === idx;
          const catDone = cat.dhikr.filter(
            (item, i) => (counts[`${idx}-${i}`] || 0) >= item.goal
          ).length;
          return (
            <motion.button key={idx} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => selectCategory(idx)}
              className={`relative flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                isActive
                  ? "border-amber-400/40 bg-amber-400/10 text-amber-400"
                  : "border-white/10 opacity-50 hover:opacity-80"
              }`}
            >
              {cat.category}
              {catDone > 0 && (
                <span className="ml-1.5 text-xs opacity-60">{catDone}/{cat.dhikr.length}</span>
              )}
              {isActive && (
                <motion.div layoutId="dhikr-cat-pill"
                  className="absolute inset-0 rounded-xl border border-amber-400/30"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }} />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Category slide transition */}
      <AnimatePresence mode="wait" custom={catDirection}>
        <motion.div
          key={categoryIdx}
          custom={catDirection}
          initial={{ opacity: 0, x: catDirection * 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: catDirection * -30 }}
          transition={{ duration: 0.22, ease: "easeInOut" }}
          className="space-y-5"
        >
          {/* Dhikr text card — Arabic + transliteration + translation */}
          <DhikrTextCard dhikr={currentDhikr} direction={dhikrDirection} />

          {/* Tasbih counter */}
          <div className="flex justify-center">
            <TasbihCounter count={count} goal={goal} onClick={handleCount}
              completed={completed} pulse={pulse} />
          </div>

          {/* Completion message */}
          <AnimatePresence>
            {completed && (
              <motion.div
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="text-center py-3 rounded-2xl bg-amber-400/10 border border-amber-400/20"
              >
                <p className="text-sm text-amber-400">🌙 {goal}× completed — Alhamdulillah</p>
                {dhikrIdx < dhikrItems.length - 1 && (
                  <motion.button whileTap={{ scale: 0.97 }} onClick={goNext}
                    className="mt-1.5 text-xs opacity-60 hover:opacity-100 underline underline-offset-2">
                    Next dhikr →
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Dhikr navigator dots */}
          <div className="flex items-center gap-2">
            <motion.button whileTap={{ scale: 0.9 }} onClick={goPrev} disabled={dhikrIdx === 0}
              className="p-2 rounded-xl border border-white/10 opacity-40 hover:opacity-80 disabled:opacity-20 transition-opacity">
              <ChevronLeft size={16} />
            </motion.button>

            <div className="flex-1 flex gap-1.5 overflow-x-auto scrollbar-none justify-center">
              {dhikrItems.map((item, idx) => {
                const isActive = dhikrIdx === idx;
                const isDone = (counts[`${categoryIdx}-${idx}`] || 0) >= item.goal;
                return (
                  <motion.button key={idx} whileTap={{ scale: 0.9 }}
                    onClick={() => selectDhikr(idx)}
                    className={`flex-shrink-0 w-6 h-6 rounded-full text-xs border transition-all flex items-center justify-center ${
                      isActive
                        ? "border-amber-400 bg-amber-400 text-[#041C2C] font-bold"
                        : isDone
                        ? "border-amber-400/50 bg-amber-400/10 text-amber-400"
                        : "border-current opacity-20 hover:opacity-40"
                    }`}
                  >
                    {isDone ? "✓" : idx + 1}
                  </motion.button>
                );
              })}
            </div>

            <motion.button whileTap={{ scale: 0.9 }} onClick={goNext}
              disabled={dhikrIdx === dhikrItems.length - 1}
              className="p-2 rounded-xl border border-white/10 opacity-40 hover:opacity-80 disabled:opacity-20 transition-opacity">
              <ChevronRight size={16} />
            </motion.button>
          </div>

          {/* Reset */}
          <div className="flex justify-center">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 opacity-40 hover:opacity-70 transition-opacity text-sm">
              <RotateCcw size={14} /> Reset
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Category dots */}
      <div className="flex justify-center gap-1.5 mt-6">
        {dhikrList.map((_, idx) => (
          <button key={idx} onClick={() => selectCategory(idx)}
            className={`rounded-full transition-all ${
              categoryIdx === idx ? "w-4 h-1.5 bg-amber-400" : "w-1.5 h-1.5 bg-current opacity-20"
            }`}
          />
        ))}
      </div>
    </div>
  );
}