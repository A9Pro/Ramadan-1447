// src/components/Timeline/SunnahTimeline.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const phases = [
  { name: "Before Fajr", icon: "🌑", start: 3, end: 5, guidance: "Renew your intention (Niyyah). Make du'a for strength and sincerity." },
  { name: "After Fajr", icon: "🌅", start: 5, end: 9, guidance: "Morning adhkar. Recite Quran. Reflect quietly." },
  { name: "Midday Patience", icon: "☀️", start: 9, end: 17, guidance: "Guard your tongue. Increase dhikr. Small acts of charity." },
  { name: "Before Maghrib", icon: "🌇", start: 17, end: 19, guidance: "Prepare for iftar. Make du'a — the fasting person's du'a is accepted." },
  { name: "After Isha", icon: "🌙", start: 19, end: 24, guidance: "Taraweeh. Qiyam. Seek forgiveness in the night." },
];

function getCurrentPhase(hour) {
  return phases.find((p) => hour >= p.start && hour < p.end);
}

export default function SunnahTimeline() {
  const [currentHour, setCurrentHour] = useState(new Date().getHours());

  useEffect(() => {
    const interval = setInterval(() => setCurrentHour(new Date().getHours()), 60000);
    return () => clearInterval(interval);
  }, []);

  const activePhase = getCurrentPhase(currentHour);

  return (
    <div className="space-y-3">
      {phases.map((phase, idx) => {
        const isActive = activePhase?.name === phase.name;
        const isPast = currentHour >= phase.end;

        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.07 }}
            className={`flex gap-4 items-start px-5 py-4 rounded-2xl border transition-all ${
              isActive
                ? "border-ramadan-dark-accent/40 bg-ramadan-dark-accent/10"
                : isPast
                ? "border-white/5 dark:border-white/5 border-black/5 opacity-40"
                : "border-white/10 dark:border-white/10 border-black/10 bg-black/5 dark:bg-white/5"
            }`}
          >
            {/* Timeline dot + line */}
            <div className="flex flex-col items-center gap-1 pt-0.5 flex-shrink-0">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-sm border-2 transition-all ${
                  isActive
                    ? "border-ramadan-dark-accent bg-ramadan-dark-accent/20"
                    : isPast
                    ? "border-current opacity-20"
                    : "border-current opacity-30"
                }`}
              >
                {phase.icon}
              </div>
              {idx < phases.length - 1 && (
                <div className={`w-px flex-1 min-h-[16px] ${isPast ? "bg-current opacity-10" : "bg-current opacity-10"}`} />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`font-medium text-sm ${isActive ? "text-ramadan-dark-accent" : ""}`}>
                  {phase.name}
                </span>
                <span className="text-xs opacity-30">
                  {phase.start}:00 – {phase.end}:00
                </span>
                {isActive && (
                  <motion.span
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="ml-auto text-xs px-2 py-0.5 rounded-full bg-ramadan-dark-accent/20 text-ramadan-dark-accent"
                  >
                    Now
                  </motion.span>
                )}
              </div>
              <p className="text-sm leading-relaxed opacity-50">{phase.guidance}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}