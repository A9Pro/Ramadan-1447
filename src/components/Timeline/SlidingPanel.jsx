// src/components/ui/SlidingPanel.jsx
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function SlidingPanel({ isOpen, onClose, children, title }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed top-0 right-0 h-full w-96 z-50 flex flex-col border-l border-white/10 dark:border-white/10 border-black/10 bg-ramadan-dark-elevated dark:bg-ramadan-dark-elevated bg-ramadan-light-surface shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 dark:border-white/10 border-black/10">
              {title && (
                <h2 className="text-lg font-semibold text-ramadan-dark-accent dark:text-ramadan-dark-accent">
                  {title}
                </h2>
              )}
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                onClick={onClose}
                className="ml-auto p-2 rounded-xl border border-white/10 dark:border-white/10 border-black/10 opacity-50 hover:opacity-100 transition-opacity"
              >
                <X size={18} />
              </motion.button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}