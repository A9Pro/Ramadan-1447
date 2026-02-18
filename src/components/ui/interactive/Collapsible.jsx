"use client"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"

export default function Collapsible({ title, children }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-emerald-200 dark:border-emerald-800 py-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center text-left font-semibold text-emerald-800 dark:text-emerald-300"
      >
        {title}
        <span>{open ? "−" : "+"}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="overflow-hidden mt-3 text-gray-600 dark:text-gray-300"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
