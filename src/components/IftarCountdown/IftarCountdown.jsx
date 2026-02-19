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
    // Strip any trailing " (BST)" or timezone labels — API sometimes adds them
    const clean = t.split(" ")[0];
    const [h, m] = clean.split(":").map(Number);
    const d = new Date();
    d.setHours(h, m, 0, 0);
    return d;
  };

  const fajr = parseTime(times.Fajr);
  const maghrib = parseTime(times.Maghrib);

  if (now < fajr) {
    return { label: "Suhoor ends in", type: "suhoor", diff: fajr - now };
  }
  if (now >= fajr && now < maghrib) {
    return { label: "Iftar in", type: "iftar", diff: maghrib - now };
  }
  // After Maghrib — countdown to tomorrow Fajr
  const tomorrowFajr = new Date(fajr);
  tomorrowFajr.setDate(tomorrowFajr.getDate() + 1);
  return { label: "Suhoor ends in", type: "suhoor", diff: tomorrowFajr - now };
}

function formatDiff(diff) {
  const totalSecs = Math.max(0, Math.floor(diff / 1000));
  const h = Math.floor(totalSecs / 3600);
  const m = Math.floor((totalSecs % 3600) / 60);
  const s = totalSecs % 60;
  return { h, m, s };
}

export default function IftarCountdown({ times }) {
  const [countdown, setCountdown] = useState(() => getCountdown(times));
  const [tick, setTick] = useState(0);

  // Tick every second
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  // Recalculate whenever times arrive OR every second
  useEffect(() => {
    setCountdown(getCountdown(times));
  }, [times, tick]);

  const isIftar = countdown?.type === "iftar";
  const { h, m, s } = countdown ? formatDiff(countdown.diff) : { h: 0, m: 0, s: 0 };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`relative overflow-hidden rounded-3xl border p-6 md:p-8 mb-8 ${
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
      <div className="relative z-10 text-center mb-5">
        <p className={`text-xs uppercase tracking-widest mb-1 ${isIftar ? "text-amber-400/60" : "text-blue-400/60"}`}>
          {isIftar ? "🌙 Ramadan Fast" : "⭐ Night Fast"}
        </p>
        {countdown ? (
          <p className={`text-base md:text-lg font-medium ${isIftar ? "text-amber-400" : "text-blue-300"}`}>
            {countdown.label}
          </p>
        ) : (
          <p className="text-sm opacity-30">Loading prayer times...</p>
        )}
      </div>

      {/* Countdown digits */}
      {countdown ? (
        <div className="relative z-10 flex items-center justify-center gap-2 md:gap-3">
          {[
            { value: h, label: "Hours" },
            { value: m, label: "Minutes" },
            { value: s, label: "Seconds" },
          ].map(({ value, label }, idx) => (
            <div key={label} className="flex items-center gap-2 md:gap-3">
              <div className="text-center min-w-[56px] md:min-w-[72px]">
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={value}
                    initial={{ y: -8, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 8, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className={`text-4xl md:text-5xl lg:text-6xl font-bold tabular-nums tracking-tight ${
                      isIftar ? "text-amber-400" : "text-blue-300"
                    }`}
                  >
                    {pad(value)}
                  </motion.div>
                </AnimatePresence>
                <p className="text-[9px] md:text-xs opacity-30 mt-1 uppercase tracking-widest">{label}</p>
              </div>
              {idx < 2 && (
                <motion.span
                  animate={{ opacity: [1, 0.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className={`text-2xl md:text-3xl font-light pb-4 ${isIftar ? "text-amber-400/40" : "text-blue-400/40"}`}
                >
                  :
                </motion.span>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* Skeleton while prayer times are loading */
        <div className="relative z-10 flex items-center justify-center gap-3">
          {["Hours", "Minutes", "Seconds"].map((label, idx) => (
            <div key={label} className="flex items-center gap-3">
              <div className="text-center min-w-[56px]">
                <motion.div
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ repeat: Infinity, duration: 1.5, delay: idx * 0.2 }}
                  className={`text-4xl md:text-5xl font-bold tabular-nums ${
                    isIftar ? "text-amber-400/30" : "text-blue-300/30"
                  }`}
                >
                  --
                </motion.div>
                <p className="text-[9px] md:text-xs opacity-20 mt-1 uppercase tracking-widest">{label}</p>
              </div>
              {idx < 2 && <span className="text-2xl opacity-20 pb-4">:</span>}
            </div>
          ))}
        </div>
      )}

      {/* Dua */}
      <div className="relative z-10 text-center mt-5">
        {isIftar ? (
          <p className="text-[10px] md:text-xs opacity-30 italic px-2">
            "O Allah, I fasted for You and I believe in You and I break my fast with Your provision"
          </p>
        ) : (
          <p className="text-[10px] md:text-xs opacity-30 italic px-2">
            "Eat and drink until the white thread becomes distinct from the black thread at dawn" — Quran 2:187
          </p>
        )}
      </div>
    </motion.div>
  );
}