// src/components/SideRecitations/SideRecitationsPanel.jsx
import recitations from "./recitations.json";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, ChevronDown } from "lucide-react";

export default function SideRecitationsPanel() {
  const [selected, setSelected] = useState(recitations[0]);
  const [direction, setDirection] = useState(1);
  const [showTranslation, setShowTranslation] = useState(false);
  const [showTranslit, setShowTranslit] = useState(false);

  const handleSelect = (r) => {
    const newIndex = recitations.indexOf(r);
    const oldIndex = recitations.indexOf(selected);
    setDirection(newIndex > oldIndex ? 1 : -1);
    setSelected(r);
    setShowTranslation(false);
    setShowTranslit(false);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-5">
        <h2 className="text-2xl font-semibold text-ramadan-dark-accent dark:text-ramadan-dark-accent">
          Side Recitations
        </h2>
        <p className="text-sm mt-1 opacity-50">Daily adhkar & supplications</p>
      </div>

      {/* Tab Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none mb-5">
        {recitations.map((r, idx) => {
          const isActive = selected.name === r.name;
          return (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleSelect(r)}
              className={`relative flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                isActive
                  ? "border-ramadan-dark-accent/40 bg-ramadan-dark-accent/10 text-ramadan-dark-accent"
                  : "border-white/10 dark:border-white/10 border-black/10 opacity-50 hover:opacity-80"
              }`}
            >
              {r.name}
              {isActive && (
                <motion.div
                  layoutId="recitation-pill"
                  className="absolute inset-0 rounded-xl border border-ramadan-dark-accent/30"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={selected.name}
          custom={direction}
          initial={{ opacity: 0, x: direction * 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -24 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="space-y-3"
        >
          {/* Arabic text — primary focus */}
          <div className="rounded-2xl border border-white/10 dark:border-white/10 border-black/10 bg-black/5 dark:bg-white/5 p-5">
            <p
              className="text-right leading-[2.2] opacity-85 font-arabic"
              style={{ fontSize: "1.2rem", direction: "rtl" }}
            >
              {selected.arabic}
            </p>
          </div>

          {/* Transliteration — expandable */}
          {selected.transliteration && (
            <div className="rounded-2xl border border-white/10 dark:border-white/10 border-black/10 overflow-hidden">
              <button
                onClick={() => setShowTranslit((v) => !v)}
                className="w-full flex items-center justify-between px-5 py-3 text-sm opacity-60 hover:opacity-90 transition-opacity"
              >
                <span className="font-medium">Transliteration</span>
                <motion.div
                  animate={{ rotate: showTranslit ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown size={15} />
                </motion.div>
              </button>
              <AnimatePresence>
                {showTranslit && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-4 text-sm leading-relaxed opacity-50 italic">
                      {selected.transliteration}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Translation — expandable */}
          {selected.text && (
            <div className="rounded-2xl border border-white/10 dark:border-white/10 border-black/10 overflow-hidden">
              <button
                onClick={() => setShowTranslation((v) => !v)}
                className="w-full flex items-center justify-between px-5 py-3 text-sm opacity-60 hover:opacity-90 transition-opacity"
              >
                <span className="font-medium">Translation</span>
                <motion.div
                  animate={{ rotate: showTranslation ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown size={15} />
                </motion.div>
              </button>
              <AnimatePresence>
                {showTranslation && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-4 text-sm leading-relaxed opacity-60">
                      {selected.text}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Hadith note */}
          {selected.note && (
            <div className="px-4 py-3 rounded-2xl border border-ramadan-dark-accent/20 bg-ramadan-dark-accent/5">
              <p className="text-xs leading-relaxed opacity-60 italic">
                📖 {selected.note}
              </p>
            </div>
          )}

          {/* Audio */}
          {selected.audio && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-white/10 dark:border-white/10 border-black/10">
              <Volume2 size={14} className="opacity-40 flex-shrink-0" />
              <audio
                controls
                src={selected.audio}
                className="w-full h-8 opacity-70 hover:opacity-100 transition-opacity"
              />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Dots */}
      <div className="flex justify-center gap-1.5 mt-5">
        {recitations.map((r, idx) => (
          <button
            key={idx}
            onClick={() => handleSelect(r)}
            className={`rounded-full transition-all ${
              selected.name === r.name
                ? "w-4 h-1.5 bg-ramadan-dark-accent"
                : "w-1.5 h-1.5 bg-current opacity-20"
            }`}
          />
        ))}
      </div>
    </div>
  );
}