"use client"
import { useState } from "react"

export default function DhikrRing({ goal = 33 }) {
  const [count, setCount] = useState(0)

  const percentage = (count / goal) * 100
  const strokeDashoffset = 440 - (440 * percentage) / 100

  return (
    <div className="flex flex-col items-center gap-4">
      <svg width="160" height="160">
        <circle
          cx="80"
          cy="80"
          r="70"
          stroke="#e5e7eb"
          strokeWidth="10"
          fill="transparent"
        />
        <circle
          cx="80"
          cy="80"
          r="70"
          stroke="#10b981"
          strokeWidth="10"
          fill="transparent"
          strokeDasharray="440"
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90 80 80)"
        />
      </svg>

      <div className="text-3xl font-semibold text-emerald-700 dark:text-emerald-400">
        {count}
      </div>

      <button
        onClick={() => setCount(count < goal ? count + 1 : 0)}
        className="px-6 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white transition-all duration-300 shadow-md"
      >
        Tap Dhikr
      </button>
    </div>
  )
}
