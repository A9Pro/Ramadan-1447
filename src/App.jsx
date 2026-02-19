import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, LayoutDashboard, Users } from "lucide-react";

import IslamicPattern from "./components/ui/background/IslamicPattern";
import Reveal from "./components/ui/animations/Reveal";

import SunnahTimeline from "./components/Timeline/SunnahTimeline";
import DhikrPanel from "./components/Dhikr/DhikrPanel";
import PrayerGuidePanel from "./components/Prayer/PrayerGuidePanel";
import SideRecitationsPanel from "./components/SideRecitations/SideRecitationsPanel";
import QuranLearningPanel from "./components/QuranLearning/QuranLearningPanel";
import WorkoutPanel from "./components/Workout/WorkoutPanel";
import PrayerTrackerPanel from "./components/Prayer/PrayerTrackerPanel";
import CommunityPrayerBoard from "./components/Community/CommunityPrayerBoard";
import PrayerTimesWidget from "./components/PrayerTimes/PrayerTimesWidget";

const PAGES = [
  { id: "home", label: "Dashboard", icon: LayoutDashboard },
  { id: "community", label: "Community", icon: Users },
];

function getRamadanDay() {
  const ramadanStart = new Date("2026-02-18");
  const today = new Date();
  const diff = Math.floor((today - ramadanStart) / (1000 * 60 * 60 * 24)) + 1;
  return Math.max(1, Math.min(diff, 30));
}

export default function App() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });
  const [page, setPage] = useState("home");
  const isDark = theme === "dark";
  const ramadanDay = getRamadanDay();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  return (
    <div
      className={`min-h-screen relative overflow-hidden transition-colors duration-500 ${
        isDark
          ? "bg-[#041C2C] text-ramadan-dark-text"
          : "bg-ramadan-light-base text-ramadan-light-text"
      }`}
    >
      <IslamicPattern />

      {/* Cinematic atmospheric depth */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-amber-400/10 blur-[180px] rounded-full" />
        <div className="absolute bottom-[-250px] right-[-200px] w-[700px] h-[700px] bg-cyan-400/8 blur-[160px] rounded-full" />
        <div className="absolute top-[40%] left-[-150px] w-[500px] h-[500px] bg-amber-600/5 blur-[120px] rounded-full" />
      </div>

      {/* Theme Toggle */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        onClick={toggleTheme}
        className={`fixed top-6 right-6 z-50 p-3 rounded-full border transition-all ${
          isDark
            ? "bg-ramadan-dark-elevated border-white/5 text-amber-400 shadow-[0_8px_40px_rgba(0,0,0,0.45)]"
            : "bg-ramadan-light-surface border-ramadan-light-surfaceSoft text-ramadan-light-accent shadow-subtle"
        }`}
        aria-label="Toggle theme"
      >
        {isDark ? <Sun size={22} /> : <Moon size={22} />}
      </motion.button>

      {/* Nav */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex gap-1 p-1 rounded-2xl border backdrop-blur-md bg-black/30 border-white/8 shadow-[0_8px_40px_rgba(0,0,0,0.3)]">
        {PAGES.map(({ id, label, icon: Icon }) => {
          const isActive = page === id;
          return (
            <motion.button
              key={id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setPage(id)}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                isActive ? "text-amber-400" : "opacity-40 hover:opacity-70"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-xl bg-white/5 border border-white/10"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Icon size={15} className="relative z-10" />
              <span className="relative z-10">{label}</span>
            </motion.button>
          );
        })}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-14">
        {/* Hero */}
        <motion.header
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-6 pt-10"
        >
          {/* Day Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-amber-400/20 bg-amber-400/8 text-sm mb-6"
          >
            <span>🌙</span>
            <span className="text-amber-300/80 font-medium">Day {ramadanDay} of Ramadan 1447</span>
            <span className="text-amber-400/30">·</span>
            <span className="text-amber-400/50 text-xs">May Allah accept our fasts</span>
          </motion.div>

          <h1 className="text-6xl lg:text-7xl font-heading font-semibold tracking-tight bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent"
            style={{ filter: "drop-shadow(0 0 40px rgba(245,158,11,0.2))" }}
          >
            Ramadan 1447
          </h1>

          <p className="mt-5 text-xl opacity-40">
            {page === "home"
              ? "Sunnah-Focused Daily Companion"
              : "Ummah Prayer Board — support & du'a together"}
          </p>
        </motion.header>

        {/* Bismillah Divider */}
        <div className="flex items-center gap-4 mb-14">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-400/20 to-transparent" />
          <span className="text-amber-400/30 text-sm tracking-widest">بِسْمِ اللَّهِ</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-400/20 to-transparent" />
        </div>

        {/* Pages */}
        <AnimatePresence mode="wait">
          {page === "home" ? (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
                {/* Left */}
                <div className="lg:col-span-8 space-y-10">
                  <Reveal>
                    <DhikrPanel />
                  </Reveal>

                  <Reveal>
                    <section className={`rounded-3xl p-8 border shadow-[0_8px_40px_rgba(0,0,0,0.45)] ${
                      isDark
                        ? "bg-ramadan-dark-elevated border-white/5"
                        : "bg-ramadan-light-surface border-ramadan-light-surfaceSoft"
                    }`}>
                      <h2 className={`text-2xl font-semibold mb-6 ${isDark ? "text-amber-400" : "text-ramadan-light-accent"}`}>
                        Sunnah Moments Today
                      </h2>
                      <SunnahTimeline />
                    </section>
                  </Reveal>

                  <Reveal>
                    <PrayerGuidePanel />
                  </Reveal>

                  <Reveal>
                    <PrayerTrackerPanel />
                  </Reveal>
                </div>

                {/* Right Sidebar */}
                <div className="lg:col-span-4 space-y-10 lg:sticky lg:top-10">
                  <Reveal>
                    <div className={`rounded-3xl p-6 border shadow-[0_8px_40px_rgba(0,0,0,0.45)] ${
                      isDark ? "bg-ramadan-dark-elevated border-white/5" : "bg-ramadan-light-surface border-ramadan-light-surfaceSoft"
                    }`}>
                      <QuranLearningPanel />
                    </div>
                  </Reveal>

                  <Reveal>
                    <div className={`rounded-3xl p-6 border shadow-[0_8px_40px_rgba(0,0,0,0.45)] ${
                      isDark ? "bg-ramadan-dark-elevated border-white/5" : "bg-ramadan-light-surface border-ramadan-light-surfaceSoft"
                    }`}>
                      <SideRecitationsPanel />
                    </div>
                  </Reveal>

                  <Reveal>
                    <div className={`rounded-3xl p-6 border shadow-[0_8px_40px_rgba(0,0,0,0.45)] ${
                      isDark ? "bg-ramadan-dark-elevated border-white/5" : "bg-ramadan-light-surface border-ramadan-light-surfaceSoft"
                    }`}>
                      <WorkoutPanel />
                    </div>
                  </Reveal>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="community"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35 }}
            >
              <CommunityPrayerBoard />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <footer className="text-center py-10 text-sm opacity-25">
        Made with intention & du'a for the Ummah 🤲
      </footer>

      {/* Floating Prayer Times Widget */}
      <PrayerTimesWidget />
    </div>
  );
}