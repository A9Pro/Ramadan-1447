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

// Arc from 100° (nearly straight up) to 180° (straight left)
// All positions stay within viewport when anchor is bottom-right corner
const ORBIT_R = 160;
const ARC_START = 100;
const ARC_END = 180;

function getOrbit(index, total) {
  const angle = ARC_START + (index / (total - 1)) * (ARC_END - ARC_START);
  const rad = (angle * Math.PI) / 180;
  return {
    x: Math.cos(rad) * ORBIT_R,           // negative = left
    y: -Math.sin(rad) * ORBIT_R,          // negative = up (screen coords)
    angle,                                  // used to orient label outward
  };
}

// ─── Desktop Orbit Nav ────────────────────────────────────────────────────────
function DesktopSphereNav({ activeSection, onNavigate }) {
  const [open, setOpen] = useState(false);

  const handleSelect = (id) => {
    onNavigate(id);
    setOpen(false);
  };

  return (
    <>
      <div className="fixed bottom-8 right-8 z-50 hidden md:block" style={{ width: 56, height: 56 }}>

        {/* Decorative orbit ring — quarter circle */}
        <AnimatePresence>
          {open && (
            <motion.svg
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.4 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              width={ORBIT_R * 2 + 60}
              height={ORBIT_R * 2 + 60}
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                pointerEvents: "none",
                overflow: "visible",
              }}
            >
              {/* Faint arc path */}
              <path
                d={`M ${-(ORBIT_R - 2)} 0 A ${ORBIT_R} ${ORBIT_R} 0 0 1 ${Math.cos((ARC_START * Math.PI) / 180) * ORBIT_R} ${-Math.sin((ARC_START * Math.PI) / 180) * ORBIT_R}`}
                fill="none"
                stroke="rgba(201,169,110,0.12)"
                strokeWidth="1"
                strokeDasharray="4 6"
              />
            </motion.svg>
          )}
        </AnimatePresence>

        {/* Orbital nav items */}
        <AnimatePresence>
          {open && NAV_ITEMS.map((item, i) => {
            const { x, y, angle } = getOrbit(i, NAV_ITEMS.length);
            const isActive = activeSection === item.id;

            // Label direction: push label further away from center
            // angle 100° → label goes up; angle 180° → label goes left
            const labelRad = (angle * Math.PI) / 180;
            const labelDx = Math.cos(labelRad) * 34;   // offset from orb center
            const labelDy = -Math.sin(labelRad) * 34;

            return (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: 0, y: 0, scale: 0.2 }}
                animate={{ opacity: 1, x, y, scale: 1 }}
                exit={{
                  opacity: 0, x: 0, y: 0, scale: 0.2,
                  transition: { delay: (NAV_ITEMS.length - 1 - i) * 0.03, duration: 0.2 }
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 24,
                  delay: i * 0.05,
                }}
                onClick={() => handleSelect(item.id)}
                className="absolute bottom-0 right-0 group"
                style={{
                  // Centre the orb on its calculated position
                  marginBottom: -24,
                  marginRight: -24,
                }}
              >
                {/* Orb */}
                <div className={`
                  relative w-12 h-12 rounded-full flex items-center justify-center
                  border backdrop-blur-xl transition-all duration-200
                  shadow-[0_4px_24px_rgba(0,0,0,0.55)]
                  group-hover:scale-115
                  ${isActive
                    ? "bg-amber-400/25 border-amber-400/60 shadow-[0_0_22px_rgba(201,169,110,0.5)]"
                    : "bg-[#041C2C]/85 border-white/15 group-hover:border-amber-400/35 group-hover:bg-amber-400/8"
                  }
                `}>
                  {/* Gloss sheen */}
                  <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-5 h-2 bg-white/15 rounded-full blur-[3px] pointer-events-none" />
                  <span className="text-xl relative z-10 select-none">{item.emoji}</span>

                  {/* Active glow ring */}
                  {isActive && (
                    <motion.div
                      layoutId="desktop-orb-ring"
                      className="absolute inset-[-3px] rounded-full border-2 border-amber-400/55"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </div>

                {/* Label — floats outward from orb along the radius */}
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: i * 0.05 + 0.1 }}
                  className={`
                    absolute pointer-events-none whitespace-nowrap
                    text-[9px] font-bold uppercase tracking-widest
                    px-2 py-0.5 rounded-full border backdrop-blur-sm
                    ${isActive
                      ? "text-amber-400 border-amber-400/30 bg-[#041C2C]/80"
                      : "opacity-60 border-white/10 bg-[#041C2C]/70 group-hover:opacity-100 group-hover:text-amber-300"
                    }
                  `}
                  style={{
                    // Position label along the outward radial direction from orb
                    left: "50%",
                    top: "50%",
                    transform: `translate(calc(-50% + ${labelDx}px), calc(-50% + ${labelDy - 34}px))`,
                  }}
                >
                  {item.label}
                </motion.span>
              </motion.button>
            );
          })}
        </AnimatePresence>

        {/* 🌙 Moon trigger */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setOpen(!open)}
          className={`
            relative w-14 h-14 rounded-full flex items-center justify-center
            border shadow-[0_8px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl z-10
            transition-all duration-300
            ${open
              ? "bg-amber-400/20 border-amber-400/55 shadow-[0_0_40px_rgba(201,169,110,0.3)]"
              : "bg-[#041C2C]/92 border-white/15 hover:border-amber-400/40"
            }
          `}
        >
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-7 h-3 bg-white/10 rounded-full blur-sm pointer-events-none" />

          <motion.span
            animate={{ rotate: open ? 360 : 0, scale: open ? 1.2 : 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="text-2xl relative z-10 select-none"
          >
            🌙
          </motion.span>

          {/* Breathing pulse ring when closed */}
          {!open && (
            <motion.div
              animate={{ scale: [1, 1.6, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full border border-amber-400/25 pointer-events-none"
            />
          )}
        </motion.button>
      </div>

      {/* Click-outside to close */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 hidden md:block"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Mobile Bottom Bar ────────────────────────────────────────────────────────
function MobileBottomNav({ activeSection, onNavigate }) {
  const [visible, setVisible] = useState(true);
  const lastY = { current: 0 };
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (current) => {
    if (current < 60) setVisible(true);
    else if (current > lastY.current + 8) setVisible(false);
    else if (current < lastY.current - 4) setVisible(true);
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

// ─── Export ───────────────────────────────────────────────────────────────────
export default function MobileNav({ activeSection, onNavigate }) {
  return (
    <>
      <MobileBottomNav activeSection={activeSection} onNavigate={onNavigate} />
      <DesktopSphereNav activeSection={activeSection} onNavigate={onNavigate} />
    </>
  );
}