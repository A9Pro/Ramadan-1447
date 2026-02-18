// src/components/Workout/WorkoutPanel.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import workoutGuide from "./workoutGuide.json";

export default function WorkoutPanel() {
  const [expanded, setExpanded] = useState(null);

  const toggle = (idx) => setExpanded((prev) => (prev === idx ? null : idx));

  return (
    <div>
      {/* Header */}
      <div className="mb-5">
        <h2 className="text-2xl font-semibold text-ramadan-dark-accent dark:text-ramadan-dark-accent">
          Daily Workout
        </h2>
        <p className="text-sm mt-1 opacity-50">Ramadan-friendly movement & exercise</p>
      </div>

      {/* Workout List */}
      <div className="space-y-2">
        {workoutGuide.map((item, idx) => {
          const isOpen = expanded === idx;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`rounded-2xl border overflow-hidden transition-all ${
                isOpen
                  ? "border-ramadan-dark-accent/40 bg-ramadan-dark-accent/8"
                  : "border-white/10 dark:border-white/10 border-black/10 bg-black/5 dark:bg-white/5"
              }`}
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full flex items-center gap-4 px-5 py-4 text-left"
              >
                {/* Icon or number */}
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm border-2 transition-all ${
                  isOpen
                    ? "border-ramadan-dark-accent bg-ramadan-dark-accent/20 text-ramadan-dark-accent"
                    : "border-current opacity-25"
                }`}>
                  {item.icon || idx + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <p className={`font-medium text-sm ${isOpen ? "opacity-100" : "opacity-70"}`}>
                    {item.title}
                  </p>
                  {item.duration && (
                    <p className="text-xs opacity-40 mt-0.5">{item.duration}</p>
                  )}
                </div>

                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="opacity-30 flex-shrink-0"
                >
                  <ChevronDown size={16} />
                </motion.div>
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
                      <p className="text-sm leading-relaxed opacity-60">{item.description}</p>

                      {/* Optional exercises list */}
                      {item.exercises?.length > 0 && (
                        <div className="space-y-1.5 mt-2">
                          {item.exercises.map((ex, eIdx) => (
                            <div key={eIdx} className="flex items-center gap-3 text-sm opacity-50">
                              <span className="w-1.5 h-1.5 rounded-full bg-ramadan-dark-accent flex-shrink-0" />
                              {ex}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Optional tip */}
                      {item.tip && (
                        <div className="mt-3 px-4 py-3 rounded-xl border border-ramadan-dark-accent/20 bg-ramadan-dark-accent/5 text-xs opacity-70 italic">
                          💡 {item.tip}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}