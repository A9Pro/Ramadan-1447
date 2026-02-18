"use client"
import { useState } from "react"

export default function CommunityPage() {
  const [requests, setRequests] = useState([])
  const [text, setText] = useState("")

  function submitRequest() {
    if (!text.trim()) return
    setRequests([...requests, { text, replies: [] }])
    setText("")
  }

  return (
    <div className="max-w-4xl mx-auto py-20 px-6">
      <h1 className="text-4xl font-bold text-emerald-800 dark:text-emerald-400 mb-10">
        Community Du'a & Spiritual Support
      </h1>

      <div className="mb-10">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share your prayer request..."
          className="w-full p-4 rounded-xl border border-emerald-200 dark:border-emerald-700 bg-white/70 dark:bg-white/5 backdrop-blur"
        />
        <button
          onClick={submitRequest}
          className="mt-4 px-6 py-2 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition"
        >
          Post Request
        </button>
      </div>

      <div className="space-y-6">
        {requests.map((r, i) => (
          <div key={i} className="p-6 rounded-2xl bg-white/70 dark:bg-white/5 backdrop-blur shadow">
            {r.text}
          </div>
        ))}
      </div>
    </div>
  )
}
