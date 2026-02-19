// src/components/IftarCountdown/IftarCountdown.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function pad(n) {
  return String(n).padStart(2, "0");
}

function getCountdown(times) {
  if (!times?.Fajr || !times?.Maghrib) return null;

  const now = new Date();

  const parseTime = (t) => {
    const [h, m] = t.split(":").map(Number);
    const d = new Date();
    d.setHours(h, m, 0, 0);
    return d;
  };

  const fajr = parseTime(times.Fajr);
  const maghrib = parseTime(times.Maghrib);

  // Before Fajr → countdown to Suhoor end (Fajr)
  if (now < fajr) {
    const diff = fajr - now;
    return { label: "Suhoor ends in", type: "suhoor", diff };
  }

  // Between Fajr and Maghrib → fasting, countdown to Iftar
  if (now >= fajr && now < maghrib) {
    const diff = maghrib - now;
    return { label: "Iftar in", type: "iftar", diff };
  }

  // After Maghrib → Iftar passed, countdown to tomorrow's Fajr
  const tomorrowFajr = new Date(fajr);
  tomorrowFajr.setDate(tomorrowFajr.getDate() + 1);
  const diff = tomorrowFajr - now;
  return { label: "Suhoor ends in", type: "suhoor", diff };
}

function formatDiff(diff) {
  const totalSecs = Math.max(0, Math.floor(diff / 1000));
  const h = Math.floor(totalSecs / 3600);
  const m = Math.floor((totalSecs % 3600) / 60);
  const s = totalSecs % 60;
  return { h, m, s };
}

export default function IftarCountdown({ times }) {
  const [countdown, setCountdown] = useState(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setCountdown(getCountdown(times));
  }, [times, tick]);

  if (!countdown) return null;

  const { h, m, s } = formatDiff(countdown.diff);
  const isIftar = countdown.type === "iftar";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`relative overflow-hidden rounded-3xl border p-8 mb-8 ${
        isIftar
          ? "border-amber-400/20 bg-gradient-to-br from-amber-400/8 via-transparent to-transparent"
          : "border-blue-400/20 bg-gradient-to-br from-blue-400/8 via-transparent to-transparent"
      }`}
    >
      {/* Background glow */}
      <div className={`absolute top-[-60px] right-[-60px] w-[300px] h-[300px] blur-[100px] rounded-full pointer-events-none ${
        isIftar ? "bg-amber-400/15" : "bg-blue-400/10"
      }`} />

      {/* Label */}
      <div className="relative z-10 text-center mb-6">
        <p className={`text-xs uppercase tracking-widest mb-1 ${isIftar ? "text-amber-400/60" : "text-blue-400/60"}`}>
          {isIftar ? "🌙 Ramadan Fast" : "⭐ Night Fast"}
        </p>
        <p className={`text-lg font-medium ${isIftar ? "text-amber-400" : "text-blue-300"}`}>
          {countdown.label}
        </p>
      </div>

      {/* Big countdown digits */}
      <div className="relative z-10 flex items-center justify-center gap-3">
        {[
          { value: h, label: "Hours" },
          { value: m, label: "Minutes" },
          { value: s, label: "Seconds" },
        ].map(({ value, label }, idx) => (
          <div key={label} className="flex items-center gap-3">
            <div className="text-center">
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={value}
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 10, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`text-5xl lg:text-6xl font-bold tabular-nums tracking-tight ${
                    isIftar ? "text-amber-400" : "text-blue-300"
                  }`}
                >
                  {pad(value)}
                </motion.div>
              </AnimatePresence>
              <p className="text-xs opacity-30 mt-1 uppercase tracking-widest">{label}</p>
            </div>
            {idx < 2 && (
              <motion.span
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className={`text-3xl font-light mb-4 ${isIftar ? "text-amber-400/40" : "text-blue-400/40"}`}
              >
                :
              </motion.span>
            )}
          </div>
        ))}
      </div>

      {/* Dua */}
      <div className="relative z-10 text-center mt-6">
        {isIftar ? (
          <p className="text-xs opacity-30 italic">
            "O Allah, I fasted for You and I believe in You and I break my fast with Your provision"
          </p>
        ) : (
          <p className="text-xs opacity-30 italic">
            "Eat and drink until the white thread becomes distinct from the black thread at dawn" — Quran 2:187
          </p>
        )}
      </div>
    </motion.div>
  );
}