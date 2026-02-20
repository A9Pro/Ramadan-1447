// src/components/MobileNav/MobileNav.jsx
import { useState } from "react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
  { id: "dhikr",       label: "Dhikr",      emoji: "📿" },
  { id: "prayer",      label: "Prayer",      emoji: "🕌" },
  { id: "quran",       label: "Quran",       emoji: "📖" },
  { id: "recitations", label: "Recite",      emoji: "🎵" },
  { id: "sunnah",      label: "Sunnah",      emoji: "☀️" },
  { id: "ramadan",     label: "Ramadan",     emoji: "🌙" },
  { id: "community",   label: "Community",   emoji: "🤲" },
];

// Calculate orbital positions in a sphere/arc around the moon button
// Spread items in a semicircle going upward and leftward from bottom-right
function getOrbitPosition(index, total) {
  // Arc from 150° to 270° (left side + top), in degrees
  const startAngle = 145;
  const endAngle   = 285;
  const angle = startAngle + (index / (total - 1)) * (endAngle - startAngle);
  const rad   = (angle * Math.PI) / 180;
  const r     = 130; // orbit radius in px
  return {
    x: Math.cos(rad) * r,
    y: Math.sin(rad) * r,
  };
}

// ─── Desktop Sphere Nav ───────────────────────────────────────────────────────
function DesktopSphereNav({ activeSection, onNavigate }) {
  const [open, setOpen] = useState(false);

  const handleSelect = (id) => {
    onNavigate(id);
    setOpen(false);
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 hidden md:block">
      {/* Orbital items */}
      <AnimatePresence>
        {open && NAV_ITEMS.map((item, i) => {
          const { x, y } = getOrbitPosition(i, NAV_ITEMS.length);
          const isActive = activeSection === item.id;
          return (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: 0, y: 0, scale: 0.3 }}
              animate={{ opacity: 1, x, y: -y, scale: 1 }}
              exit={{ opacity: 0, x: 0, y: 0, scale: 0.3 }}
              transition={{
                type: "spring",
                stiffness: 280,
                damping: 22,
                delay: i * 0.04,
              }}
              onClick={() => handleSelect(item.id)}
              title={item.label}
              className="absolute bottom-0 right-0 flex flex-col items-center gap-1 group"
              style={{ transformOrigin: "center center" }}
            >
              {/* Orb */}
              <div className={`
                relative w-12 h-12 rounded-full flex items-center justify-center
                border backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.5)]
                transition-all duration-200 group-hover:scale-110
                ${isActive
                  ? "bg-amber-400/25 border-amber-400/60 shadow-[0_0_20px_rgba(201,169,110,0.4)]"
                  : "bg-[#041C2C]/80 border-white/15 group-hover:border-amber-400/40 group-hover:bg-amber-400/10"
                }
              `}>
                {/* Glossy highlight */}
                <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-5 h-2 bg-white/15 rounded-full blur-sm" />
                <span className="text-lg relative z-10">{item.emoji}</span>
                {isActive && (
                  <motion.div
                    layoutId="desktop-active-ring"
                    className="absolute inset-[-3px] rounded-full border-2 border-amber-400/60"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </div>
              {/* Label */}
              <span className={`
                text-[9px] font-semibold uppercase tracking-wider leading-none
                transition-colors px-1.5 py-0.5 rounded-full
                ${isActive
                  ? "text-amber-400 bg-amber-400/10"
                  : "opacity-50 group-hover:opacity-90 group-hover:text-amber-400/80"
                }
              `}>
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </AnimatePresence>

      {/* Connecting orbit ring — decorative */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-0 right-0 w-[260px] h-[260px] -translate-x-[109px] translate-y-[109px] rounded-full border border-amber-400/8 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Moon trigger button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        onClick={() => setOpen(!open)}
        className={`
          relative w-14 h-14 rounded-full flex items-center justify-center
          border shadow-[0_8px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl
          transition-all duration-300 z-10
          ${open
            ? "bg-amber-400/20 border-amber-400/50 shadow-[0_0_40px_rgba(201,169,110,0.3)]"
            : "bg-[#041C2C]/90 border-white/15 hover:border-amber-400/40"
          }
        `}
      >
        {/* Glossy sheen */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-7 h-3 bg-white/10 rounded-full blur-sm pointer-events-none" />

        <motion.span
          animate={{ rotate: open ? 360 : 0, scale: open ? 1.15 : 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="text-2xl relative z-10"
        >
          🌙
        </motion.span>

        {/* Pulse ring when closed */}
        {!open && (
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full border border-amber-400/30 pointer-events-none"
          />
        )}
      </motion.button>

      {/* Close backdrop on outside click */}
      {open && (
        <div
          className="fixed inset-0 z-[-1]"
          onClick={() => setOpen(false)}
        />
      )}
    </div>
  );
}

// ─── Mobile Bottom Bar ────────────────────────────────────────────────────────
function MobileBottomNav({ activeSection, onNavigate }) {
  const [visible, setVisible] = useState(true);
  const lastY = { current: 0 };
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (current) => {
    if (current < 60) {
      setVisible(true);
    } else if (current > lastY.current + 8) {
      setVisible(false);
    } else if (current < lastY.current - 4) {
      setVisible(true);
    }
    lastY.current = current;
  });

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden"
      animate={{ y: visible ? 0 : "110%" }}
      transition={{ type: "spring", stiffness: 380, damping: 38, mass: 0.8 }}
    >
      <div className="absolute inset-0 bg-[#041C2C]/90 backdrop-blur-xl border-t border-white/8" />
      <div className="relative flex items-center justify-around px-0.5 py-2 pb-[env(safe-area-inset-bottom)]">
        {NAV_ITEMS.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.88 }}
              onClick={() => { setVisible(true); onNavigate(item.id); }}
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

// ─── Exported component — renders both, each hidden on the other breakpoint ──
export default function MobileNav({ activeSection, onNavigate }) {
  return (
    <>
      <MobileBottomNav activeSection={activeSection} onNavigate={onNavigate} />
      <DesktopSphereNav activeSection={activeSection} onNavigate={onNavigate} />
    </>
  );
}