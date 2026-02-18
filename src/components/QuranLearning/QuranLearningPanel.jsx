// src/components/QuranLearning/QuranLearningPanel.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import learningGuide from "./learningGuide.json";

export default function QuranLearningPanel() {
  const [selected, setSelected] = useState(learningGuide[0]);
  const [direction, setDirection] = useState(1);
  const [expandedStep, setExpandedStep] = useState(null);

  const handleSelect = (lesson) => {
    const newIndex = learningGuide.indexOf(lesson);
    const oldIndex = learningGuide.indexOf(selected);
    setDirection(newIndex > oldIndex ? 1 : -1);
    setSelected(lesson);
    setExpandedStep(null);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-5">
        <h2 className="text-2xl font-semibold text-ramadan-dark-accent dark:text-ramadan-dark-accent">
          Quran Learning
        </h2>
        <p className="text-sm mt-1 opacity-50">Step-by-step lessons & guides</p>
      </div>

      {/* Tab Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none mb-5">
        {learningGuide.map((lesson, idx) => {
          const isActive = selected.title === lesson.title;
          return (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleSelect(lesson)}
              className={`relative flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                isActive
                  ? "border-ramadan-dark-accent/40 bg-ramadan-dark-accent/10 text-ramadan-dark-accent"
                  : "border-white/10 dark:border-white/10 border-black/10 opacity-50 hover:opacity-80"
              }`}
            >
              {lesson.title}
              {isActive && (
                <motion.div
                  layoutId="quran-pill"
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
          key={selected.title}
          custom={direction}
          initial={{ opacity: 0, x: direction * 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -24 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="space-y-3"
        >
          {/* Description */}
          {selected.description && (
            <div className="rounded-2xl border border-white/10 dark:border-white/10 border-black/10 bg-black/5 dark:bg-white/5 px-5 py-4">
              <p className="text-sm leading-relaxed opacity-60">{selected.description}</p>
            </div>
          )}

          {/* Steps */}
          {selected.steps?.length > 0 && (
            <div className="space-y-2">
              {selected.steps.map((step, idx) => {
                const isString = typeof step === "string";
                const title = isString ? `Step ${idx + 1}` : step.title;
                const text = isString ? step : step.text;
                const isOpen = expandedStep === idx;

                return isString ? (
                  // Simple string steps — just list them
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex gap-3 items-start px-5 py-3 rounded-2xl border border-white/10 dark:border-white/10 border-black/10 bg-black/5 dark:bg-white/5"
                  >
                    <span className="w-5 h-5 rounded-full border border-ramadan-dark-accent/40 text-ramadan-dark-accent flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-sm leading-relaxed opacity-60">{text}</p>
                  </motion.div>
                ) : (
                  // Object steps — accordion
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
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
                      <span className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold border transition-all ${
                        isOpen ? "border-ramadan-dark-accent bg-ramadan-dark-accent text-white" : "border-current opacity-30"
                      }`}>
                        {idx + 1}
                      </span>
                      <span className={`flex-1 font-medium text-sm ${isOpen ? "opacity-100" : "opacity-70"}`}>{title}</span>
                      <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }} className="opacity-30 text-xs">▼</motion.span>
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <p className="px-5 pb-5 text-sm leading-relaxed opacity-60">{text}</p>
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

      {/* Dots */}
      <div className="flex justify-center gap-1.5 mt-5">
        {learningGuide.map((lesson, idx) => (
          <button
            key={idx}
            onClick={() => handleSelect(lesson)}
            className={`rounded-full transition-all ${
              selected.title === lesson.title
                ? "w-4 h-1.5 bg-ramadan-dark-accent"
                : "w-1.5 h-1.5 bg-current opacity-20"
            }`}
          />
        ))}
      </div>
    </div>
  );
}