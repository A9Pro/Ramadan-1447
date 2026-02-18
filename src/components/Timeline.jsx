// src/components/Timeline/Timeline.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const hourlyGuidance = [
  { hour: 4,  label: "4:00 AM",  message: "Prepare for Tahajjud. Make sincere du'a." },
  { hour: 5,  label: "5:00 AM",  message: "Pray Fajr and recite morning adhkar." },
  { hour: 6,  label: "6:00 AM",  message: "Read Qur'an (1–2 pages)." },
  { hour: 9,  label: "9:00 AM",  message: "Work/study with excellence. Intend it for Allah." },
  { hour: 12, label: "12:00 PM", message: "Prepare for Dhuhr. Renew wudu." },
  { hour: 15, label: "3:00 PM",  message: "Pray Asr. Avoid idle talk." },
  { hour: 18, label: "6:00 PM",  message: "Prepare for Maghrib. Make du'a before iftar." },
  { hour: 19, label: "7:00 PM",  message: "Pray Maghrib. Eat moderately." },
  { hour: 20, label: "8:00 PM",  message: "Pray Isha & Taraweeh." },
  { hour: 22, label: "10:00 PM", message: "Reflect. Write in your journal." },
];

function getCurrentEntry(hour) {
  return (
    [...hourlyGuidance].reverse().find((item) => hour >= item.hour) ||
    { message: "Rest with intention.", label: "Now" }
  );
}

function getCurrentIndex(hour) {
  let idx = -1;
  hourlyGuidance.forEach((item, i) => {
    if (hour >= item.hour) idx = i;
  });
  return idx;
}

export default function Timeline() {
  const [currentHour, setCurrentHour] = useState(new Date().getHours());

  useEffect(() => {
    const interval = setInterval(() => setCurrentHour(new Date().getHours()), 60000);
    return () => clearInterval(interval);
  }, []);

  const activeIdx = getCurrentIndex(currentHour);
  const current = getCurrentEntry(currentHour);

  return (
    <div className="rounded-3xl p-8 border border-white/10 dark:border-white/10 border-black/10 bg-ramadan-dark-elevated dark:bg-ramadan-dark-elevated bg-ramadan-light-surface shadow-medium space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-ramadan-dark-accent dark:text-ramadan-dark-accent">
            Hour by Hour
          </h2>
          <p className="text-sm mt-1 opacity-50">Your Ramadan day, guided</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-semibold opacity-80 tabular-nums">
            {String(new Date().getHours()).padStart(2, "0")}
            <span className="opacity-40">:00</span>
          </p>
        </div>
      </div>

      {/* Current message highlight */}
      <motion.div
        key={current.message}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-ramadan-dark-accent/30 bg-ramadan-dark-accent/10 px-5 py-4"
      >
        <p className="text-xs text-ramadan-dark-accent mb-1 opacity-70 font-medium">Right now</p>
        <p className="text-base leading-relaxed">{current.message}</p>
      </motion.div>

      {/* Timeline list */}
      <div className="space-y-2">
        {hourlyGuidance.map((item, idx) => {
          const isActive = idx === activeIdx;
          const isPast = idx < activeIdx;

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.04 }}
              className={`flex items-start gap-4 px-4 py-3 rounded-2xl border transition-all ${
                isActive
                  ? "border-ramadan-dark-accent/30 bg-ramadan-dark-accent/8"
                  : isPast
                  ? "border-transparent opacity-30"
                  : "border-white/5 dark:border-white/5 border-black/5"
              }`}
            >
              {/* Dot */}
              <div className="flex flex-col items-center gap-1 pt-1 flex-shrink-0">
                <div
                  className={`w-2 h-2 rounded-full transition-all ${
                    isActive
                      ? "bg-ramadan-dark-accent scale-125"
                      : isPast
                      ? "bg-current opacity-20"
                      : "bg-current opacity-20"
                  }`}
                />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <span className={`text-xs font-medium mr-3 ${isActive ? "text-ramadan-dark-accent" : "opacity-40"}`}>
                  {item.label}
                </span>
                <span className="text-sm opacity-60">{item.message}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}