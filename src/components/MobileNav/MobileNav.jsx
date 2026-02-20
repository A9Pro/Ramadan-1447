// src/components/MobileNav/MobileNav.jsx
import { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

const NAV_ITEMS = [
  { id: "dhikr",       label: "Dhikr",      emoji: "📿" },
  { id: "prayer",      label: "Prayer",      emoji: "🕌" },
  { id: "quran",       label: "Quran",       emoji: "📖" },
  { id: "recitations", label: "Recite",      emoji: "🎵" },
  { id: "sunnah",      label: "Sunnah",      emoji: "☀️" },
  { id: "ramadan",     label: "Ramadan",     emoji: "🌙" },
  { id: "community",   label: "Community",   emoji: "🤲" },
];

export default function MobileNav({ activeSection, onNavigate }) {
  const [visible, setVisible] = useState(true);
  const lastY = { current: 0 };
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (current) => {
    if (current < 60) {
      setVisible(true);
    } else if (current > lastY.current + 8) {
      setVisible(false);      // scrolling down → hide
    } else if (current < lastY.current - 4) {
      setVisible(true);       // scrolling up → show
    }
    lastY.current = current;
  });

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden"
      animate={{ y: visible ? 0 : "110%" }}
      transition={{ type: "spring", stiffness: 380, damping: 38, mass: 0.8 }}
    >
      {/* Blur backdrop */}
      <div className="absolute inset-0 bg-[#041C2C]/90 backdrop-blur-xl border-t border-white/8" />

      <div className="relative flex items-center justify-around px-0.5 py-2 pb-[env(safe-area-inset-bottom)]">
        {NAV_ITEMS.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.88 }}
              onClick={() => {
                setVisible(true);   // always re-show on tap
                onNavigate(item.id);
              }}
              className="flex flex-col items-center gap-0.5 px-1.5 py-2 rounded-2xl relative min-w-[40px]"
            >
              {isActive && (
                <motion.div
                  layoutId="mobile-nav-pill"
                  className="absolute inset-0 rounded-2xl bg-amber-400/12 border border-amber-400/20"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="text-base relative z-10">{item.emoji}</span>
              <span className={`text-[8px] font-medium relative z-10 transition-colors leading-none ${
                isActive ? "text-amber-400" : "opacity-35"
              }`}>
                {item.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="mobile-nav-dot"
                  className="absolute -top-0.5 w-1 h-1 rounded-full bg-amber-400"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}