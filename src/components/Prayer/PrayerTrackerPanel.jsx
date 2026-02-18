import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

const PRAYERS = [
  { id: "fajr", name: "Fajr", arabic: "الفجر", time: "Dawn" },
  { id: "dhuhr", name: "Dhuhr", arabic: "الظهر", time: "Midday" },
  { id: "asr", name: "Asr", arabic: "العصر", time: "Afternoon" },
  { id: "maghrib", name: "Maghrib", arabic: "المغرب", time: "Sunset" },
  { id: "isha", name: "Isha", arabic: "العشاء", time: "Night" },
  { id: "taraweeh", name: "Taraweeh", arabic: "التراويح", time: "Late Night", ramadan: true },
];

const STORAGE_KEY = "ramadan-prayer-tracker";

function getTodayKey() {
  return new Date().toISOString().split("T")[0];
}

export default function PrayerTrackerPanel() {
  const [checked, setChecked] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      const todayKey = getTodayKey();
      return stored[todayKey] || {};
    } catch {
      return {};
    }
  });

  const [notifPermission, setNotifPermission] = useState(
    typeof Notification !== "undefined" ? Notification.permission : "denied"
  );

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      stored[getTodayKey()] = checked;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    } catch {}
  }, [checked]);

  const toggle = (id) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const completedCount = Object.values(checked).filter(Boolean).length;
  const total = PRAYERS.length;
  const progressPct = Math.round((completedCount / total) * 100);

  const requestNotifications = async () => {
    if (typeof Notification === "undefined") return;
    const result = await Notification.requestPermission();
    setNotifPermission(result);
    if (result === "granted") {
      new Notification("Prayer Reminder", {
        body: "Don't forget your prayers today! 🌙",
        icon: "/favicon.ico",
      });
    }
  };

  return (
    <div className="rounded-3xl p-8 border bg-ramadan-dark-elevated border-ramadan-dark-surfaceSoft shadow-medium dark:bg-ramadan-dark-elevated dark:border-ramadan-dark-surfaceSoft bg-ramadan-light-surface border-ramadan-light-surfaceSoft shadow-subtle">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-ramadan-dark-accent dark:text-ramadan-dark-accent text-ramadan-light-accent">
            Prayer Tracker
          </h2>
          <p className="text-sm mt-1 opacity-60">
            {completedCount} of {total} completed today
          </p>
        </div>
        {notifPermission !== "granted" && (
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={requestNotifications}
            className="text-xs px-4 py-2 rounded-xl border opacity-70 hover:opacity-100 transition-opacity border-current"
          >
            Enable Reminders
          </motion.button>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-xs mb-2 opacity-50">
          <span>Progress</span>
          <span>{progressPct}%</span>
        </div>
        <div className="h-2 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-ramadan-dark-accent dark:bg-ramadan-dark-accent"
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Prayer List */}
      <div className="space-y-3">
        {PRAYERS.map((prayer, i) => {
          const isDone = !!checked[prayer.id];
          return (
            <motion.button
              key={prayer.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => toggle(prayer.id)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl border transition-all text-left ${
                isDone
                  ? "border-ramadan-dark-accent/40 bg-ramadan-dark-accent/10"
                  : "border-white/10 dark:border-white/10 border-black/10 hover:border-ramadan-dark-accent/30"
              }`}
            >
              {/* Checkbox */}
              <div
                className={`w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                  isDone
                    ? "border-ramadan-dark-accent bg-ramadan-dark-accent"
                    : "border-current opacity-30"
                }`}
              >
                <AnimatePresence>
                  {isDone && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    >
                      <Check size={14} className="text-white" strokeWidth={3} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`font-medium ${isDone ? "opacity-60 line-through" : ""}`}>
                    {prayer.name}
                  </span>
                  {prayer.ramadan && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-ramadan-dark-accent/20 text-ramadan-dark-accent">
                      Ramadan
                    </span>
                  )}
                </div>
                <span className="text-xs opacity-40">{prayer.time}</span>
              </div>

              {/* Arabic */}
              <span className="text-lg opacity-30 font-arabic">{prayer.arabic}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Completion Message */}
      <AnimatePresence>
        {completedCount === total && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="mt-6 text-center py-4 rounded-2xl bg-ramadan-dark-accent/10 border border-ramadan-dark-accent/20"
          >
            <p className="text-sm font-medium text-ramadan-dark-accent">
              🌙 All prayers completed — Alhamdulillah!
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}