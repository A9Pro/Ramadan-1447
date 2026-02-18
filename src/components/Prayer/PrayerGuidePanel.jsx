// src/components/Prayer/PrayerGuidePanel.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import prayerGuides from "./prayerGuides.json";

export default function PrayerGuidePanel() {
  const [selected, setSelected] = useState(prayerGuides[0]);
  const [expandedStep, setExpandedStep] = useState(null);
  const [direction, setDirection] = useState(1);

  const handleSelect = (prayer) => {
    const newIndex = prayerGuides.indexOf(prayer);
    const oldIndex = prayerGuides.indexOf(selected);
    setDirection(newIndex > oldIndex ? 1 : -1);
    setSelected(prayer);
    setExpandedStep(null);
  };

  return (
    <div className="rounded-3xl p-8 border border-white/10 dark:border-white/10 border-black/10 bg-ramadan-dark-elevated dark:bg-ramadan-dark-elevated bg-ramadan-light-surface shadow-medium">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-ramadan-dark-accent dark:text-ramadan-dark-accent">
          Prayer Guide
        </h2>
        <p className="text-sm mt-1 opacity-50">Step-by-step salah instructions</p>
      </div>

      {/* Tab Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none mb-6">
        {prayerGuides.map((prayer, idx) => {
          const isActive = selected.name === prayer.name;
          return (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleSelect(prayer)}
              className={`relative flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                isActive
                  ? "border-ramadan-dark-accent/40 bg-ramadan-dark-accent/10 text-ramadan-dark-accent"
                  : "border-white/10 dark:border-white/10 border-black/10 opacity-50 hover:opacity-80"
              }`}
            >
              {prayer.name}
              {isActive && (
                <motion.div
                  layoutId="prayer-guide-pill"
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
          className="space-y-4"
        >
          {/* Prayer info card */}
          <div className="rounded-2xl border border-white/10 dark:border-white/10 border-black/10 bg-black/5 dark:bg-white/5 p-5 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <p className="text-xs opacity-40 uppercase tracking-wider">Time</p>
                <p className="text-sm opacity-70">{selected.time}</p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-xs opacity-40 uppercase tracking-wider">Rak'ahs</p>
                <div className="flex gap-1 justify-end">
                  {Array.from({ length: Math.min(selected.rakaat, 20) }).map((_, i) => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full bg-ramadan-dark-accent opacity-60"
                    />
                  ))}
                  {selected.rakaat > 20 && (
                    <span className="text-xs opacity-40 ml-1">×{selected.rakaat}</span>
                  )}
                </div>
              </div>
            </div>

            {selected.arabic && (
              <p className="text-right text-2xl leading-loose opacity-80 font-arabic border-t border-white/10 dark:border-white/10 border-black/10 pt-3">
                {selected.arabic}
              </p>
            )}
            {selected.translation && (
              <p className="text-sm leading-relaxed opacity-50 italic">{selected.translation}</p>
            )}
          </div>

          {/* Steps */}
          {selected.steps?.length > 0 && (
            <div className="space-y-2">
              {selected.steps.map((step, idx) => {
                const isOpen = expandedStep === idx;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className={`rounded-2xl border overflow-hidden transition-all ${
                      isOpen
                        ? "border-ramadan-dark-accent/30 bg-ramadan-dark-accent/5"
                        : "border-white/10 dark:border-white/10 border-black/10 bg-black/5 dark:bg-white/5"
                    }`}
                  >
                    <button
                      onClick={() => setExpandedStep(isOpen ? null : idx)}
                      className="w-full flex items-center gap-4 px-5 py-4 text-left"
                    >
                      <span
                        className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold border transition-all ${
                          isOpen
                            ? "border-ramadan-dark-accent bg-ramadan-dark-accent text-white"
                            : "border-current opacity-30"
                        }`}
                      >
                        {idx + 1}
                      </span>

                      <span className={`flex-1 font-medium text-sm ${isOpen ? "opacity-100" : "opacity-70"}`}>
                        {step.title}
                      </span>

                      <motion.span
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="opacity-30 text-xs flex-shrink-0"
                      >
                        ▼
                      </motion.span>
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5 space-y-3">
                            {step.arabic && (
                              <p className="text-right text-xl leading-loose opacity-80 font-arabic bg-black/5 dark:bg-white/5 rounded-xl px-4 py-2">
                                {step.arabic}
                              </p>
                            )}
                            <p className="text-sm leading-relaxed opacity-60">{step.text}</p>
                            {step.image && (
                              <img
                                src={step.image}
                                alt={step.title}
                                className="w-28 h-28 object-contain opacity-80 rounded-xl"
                              />
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Dot Indicators */}
      <div className="flex justify-center gap-1.5 mt-6">
        {prayerGuides.map((prayer, idx) => (
          <button
            key={idx}
            onClick={() => handleSelect(prayer)}
            className={`rounded-full transition-all ${
              selected.name === prayer.name
                ? "w-4 h-1.5 bg-ramadan-dark-accent"
                : "w-1.5 h-1.5 bg-current opacity-20"
            }`}
          />
        ))}
      </div>
    </div>
  );
}