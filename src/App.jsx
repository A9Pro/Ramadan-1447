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

const PAGES = [
  { id: "home", label: "Dashboard", icon: LayoutDashboard },
  { id: "community", label: "Community", icon: Users },
];

export default function App() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });
  const [page, setPage] = useState("home");

  const isDark = theme === "dark";

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  return (
    <div
      className={`min-h-screen relative overflow-hidden transition-colors duration-500 ${
        isDark
          ? "bg-ramadan-dark-base text-ramadan-dark-text"
          : "bg-ramadan-light-base text-ramadan-light-text"
      }`}
    >
      <IslamicPattern />

      {/* Radial accent atmosphere */}
      <div
        className={`absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full blur-3xl opacity-20 pointer-events-none ${
          isDark ? "bg-ramadan-dark-accent" : "bg-ramadan-light-accent"
        }`}
      />

      {/* Theme Toggle */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        onClick={toggleTheme}
        className={`fixed top-6 right-6 z-50 p-3 rounded-full border transition-all ${
          isDark
            ? "bg-ramadan-dark-elevated border-ramadan-dark-surfaceSoft text-ramadan-dark-accent shadow-medium"
            : "bg-ramadan-light-surface border-ramadan-light-surfaceSoft text-ramadan-light-accent shadow-subtle"
        }`}
        aria-label="Toggle theme"
      >
        {isDark ? <Sun size={22} /> : <Moon size={22} />}
      </motion.button>

      {/* Nav */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex gap-1 p-1 rounded-2xl border backdrop-blur-md
        bg-white/10 dark:bg-black/20 border-white/20 dark:border-white/10 shadow-lg">
        {PAGES.map(({ id, label, icon: Icon }) => {
          const isActive = page === id;
          return (
            <motion.button
              key={id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setPage(id)}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "text-ramadan-dark-accent"
                  : "opacity-50 hover:opacity-80"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  className={`absolute inset-0 rounded-xl border ${
                    isDark
                      ? "bg-ramadan-dark-elevated border-ramadan-dark-surfaceSoft"
                      : "bg-ramadan-light-surface border-ramadan-light-surfaceSoft"
                  }`}
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
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14 pt-10"
        >
          <h1
            className={`text-5xl lg:text-6xl font-heading font-semibold tracking-tight ${
              isDark ? "text-ramadan-dark-accent" : "text-ramadan-light-accent"
            }`}
          >
            Ramadan 1447
          </h1>
          <p
            className={`mt-4 text-xl ${
              isDark ? "text-ramadan-dark-textMuted" : "text-ramadan-light-textMuted"
            }`}
          >
            {page === "home"
              ? "Sunnah-Focused Daily Timeline & Remembrance"
              : "Ummah Prayer Board — support & du'a together"}
          </p>
        </motion.header>

        {/* Page content */}
        <AnimatePresence mode="wait">
          {page === "home" ? (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
            >
              {/* Main Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
                {/* Left Section */}
                <div className="lg:col-span-8 space-y-10">
                  <Reveal>
                    <DhikrPanel />
                  </Reveal>

                  <Reveal>
                    <section
                      className={`rounded-3xl p-8 border ${
                        isDark
                          ? "bg-ramadan-dark-elevated border-ramadan-dark-surfaceSoft shadow-medium"
                          : "bg-ramadan-light-surface border-ramadan-light-surfaceSoft shadow-subtle"
                      }`}
                    >
                      <h2
                        className={`text-2xl font-semibold mb-6 ${
                          isDark ? "text-ramadan-dark-accent" : "text-ramadan-light-accent"
                        }`}
                      >
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
                <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-10">
                  <Reveal>
                    <div
                      className={`rounded-3xl p-6 border ${
                        isDark
                          ? "bg-ramadan-dark-elevated border-ramadan-dark-surfaceSoft shadow-medium"
                          : "bg-ramadan-light-surface border-ramadan-light-surfaceSoft shadow-subtle"
                      }`}
                    >
                      <QuranLearningPanel />
                    </div>
                  </Reveal>

                  <Reveal>
                    <div
                      className={`rounded-3xl p-6 border ${
                        isDark
                          ? "bg-ramadan-dark-elevated border-ramadan-dark-surfaceSoft shadow-medium"
                          : "bg-ramadan-light-surface border-ramadan-light-surfaceSoft shadow-subtle"
                      }`}
                    >
                      <SideRecitationsPanel />
                    </div>
                  </Reveal>

                  <Reveal>
                    <div
                      className={`rounded-3xl p-6 border ${
                        isDark
                          ? "bg-ramadan-dark-elevated border-ramadan-dark-surfaceSoft shadow-medium"
                          : "bg-ramadan-light-surface border-ramadan-light-surfaceSoft shadow-subtle"
                      }`}
                    >
                      <WorkoutPanel />
                    </div>
                  </Reveal>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="community"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
            >
              <CommunityPrayerBoard />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <footer
        className={`text-center py-10 text-sm ${
          isDark ? "text-ramadan-dark-textMuted" : "text-ramadan-light-textMuted"
        }`}
      >
        Made with intention & dua for the Ummah
      </footer>
    </div>
  );
}