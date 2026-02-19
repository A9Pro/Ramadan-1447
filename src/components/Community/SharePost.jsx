// src/components/Community/SharePost.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, MessageCircle, Twitter, Copy, Check, X } from "lucide-react";

export default function SharePost({ post, onClose }) {
  const [copied, setCopied] = useState(false);

  const text = `🤲 ${post.category} — from the Ramadan 1447 Community Prayer Board\n\n"${post.message}"\n\nJoin us at muslim-gd.vercel.app`;
  const encodedText = encodeURIComponent(text);

  const shareOptions = [
    {
      label: "WhatsApp",
      emoji: "💬",
      color: "border-green-400/30 bg-green-400/8 text-green-400 hover:bg-green-400/15",
      onClick: () => window.open(`https://wa.me/?text=${encodedText}`, "_blank"),
    },
    {
      label: "Twitter / X",
      emoji: "🐦",
      color: "border-sky-400/30 bg-sky-400/8 text-sky-400 hover:bg-sky-400/15",
      onClick: () => window.open(`https://twitter.com/intent/tweet?text=${encodedText}`, "_blank"),
    },
    {
      label: "Telegram",
      emoji: "✈️",
      color: "border-blue-400/30 bg-blue-400/8 text-blue-400 hover:bg-blue-400/15",
      onClick: () => window.open(`https://t.me/share/url?url=https://muslim-gd.vercel.app&text=${encodedText}`, "_blank"),
    },
    {
      label: copied ? "Copied!" : "Copy text",
      emoji: copied ? "✅" : "📋",
      color: copied
        ? "border-amber-400/30 bg-amber-400/10 text-amber-400"
        : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10",
      onClick: async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
    },
  ];

  // Native share API (mobile)
  const handleNativeShare = async () => {
    if (!navigator.share) return;
    try {
      await navigator.share({ title: "Ramadan Prayer Board", text });
    } catch {}
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
      />

      {/* Sheet */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.96 }}
        transition={{ type: "spring", stiffness: 320, damping: 30 }}
        className="fixed inset-x-4 bottom-4 md:inset-auto md:left-1/2 md:-translate-x-1/2 md:bottom-8 md:w-[420px] z-50 rounded-3xl border border-white/10 bg-[#041C2C]/98 backdrop-blur-xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.7)]"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Share2 size={15} className="text-amber-400" />
            <h3 className="text-sm font-semibold text-amber-400">Share this du'a</h3>
          </div>
          <motion.button whileTap={{ scale: 0.93 }} onClick={onClose}
            className="p-1.5 rounded-xl border border-white/10 opacity-50 hover:opacity-100 transition-opacity">
            <X size={14} />
          </motion.button>
        </div>

        {/* Post preview */}
        <div className="rounded-2xl border border-white/8 bg-white/3 px-4 py-3 mb-5">
          <p className="text-xs text-amber-400/60 mb-1">{post.category}</p>
          <p className="text-sm opacity-60 leading-relaxed line-clamp-3">{post.message}</p>
        </div>

        {/* Native share (mobile) */}
        {typeof navigator !== "undefined" && navigator.share && (
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={handleNativeShare}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-amber-400/30 bg-amber-400/12 text-amber-400 text-sm font-medium mb-3 hover:bg-amber-400/20 transition-all"
          >
            <Share2 size={15} />
            Share via phone
          </motion.button>
        )}

        {/* Share options grid */}
        <div className="grid grid-cols-2 gap-2">
          {shareOptions.map((opt) => (
            <motion.button
              key={opt.label}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={opt.onClick}
              className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl border text-sm font-medium transition-all ${opt.color}`}
            >
              <span>{opt.emoji}</span>
              {opt.label}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </>
  );
}