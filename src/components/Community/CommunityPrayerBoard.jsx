// src/components/Community/CommunityPrayerBoard.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Send, Users, Sparkles, X, Share2, Trash2, Lock, Eye, EyeOff, Pencil } from "lucide-react";
import { db } from "../../firebase";
import SharePost from "./SharePost";
import {
  collection, addDoc, onSnapshot, updateDoc, deleteDoc,
  doc, arrayUnion, orderBy, query, serverTimestamp,
} from "firebase/firestore";

const CATEGORIES = ["All", "Dua Request", "Guidance", "Gratitude", "Healing", "Family", "Hardship"];
const RESPONSES = ["🤲 Ameen", "❤️ In my du'a", "🌙 May Allah ease", "✨ SubhanAllah", "💪 Stay strong"];
const ADJECTIVES = ["Sincere", "Humble", "Grateful", "Patient", "Hopeful", "Faithful", "Peaceful", "Devoted"];
const NOUNS = ["Servant", "Believer", "Soul", "Heart", "Brother", "Sister", "Traveller", "Seeker"];

function randomName() {
  return `${ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]} ${NOUNS[Math.floor(Math.random() * NOUNS.length)]}`;
}

function timeAgo(ts) {
  if (!ts) return "just now";
  const diff = Date.now() - (ts?.toMillis ? ts.toMillis() : ts);
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const categoryColor = (cat) => ({ "Dua Request": "text-amber-400", "Guidance": "text-blue-400", "Gratitude": "text-emerald-400", "Healing": "text-rose-400", "Family": "text-purple-400", "Hardship": "text-orange-400" })[cat] || "text-amber-400";
const categoryBg = (cat) => ({ "Dua Request": "bg-amber-400/10", "Guidance": "bg-blue-400/10", "Gratitude": "bg-emerald-400/10", "Healing": "bg-rose-400/10", "Family": "bg-purple-400/10", "Hardship": "bg-orange-400/10" })[cat] || "bg-amber-400/10";

async function hashSecret(word) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(word.toLowerCase().trim()));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

// ─── Identity Modal ───────────────────────────────────────────────────────────
function IdentityModal({ onSave, onDismiss }) {
  const [mode, setMode] = useState("anonymous");
  const [name, setName] = useState("");
  const [secret, setSecret] = useState("");
  const [showSecret, setShowSecret] = useState(false);
  const [error, setError] = useState("");
  const [suggested] = useState(randomName);

  const handleSave = async () => {
    const finalName = mode === "anonymous" ? (name.trim() || suggested) : name.trim();
    if (mode === "named" && !name.trim()) { setError("Please enter your name."); return; }
    if (!secret.trim() || secret.trim().length < 4) { setError("Secret word must be at least 4 characters."); return; }
    const hashed = await hashSecret(secret);
    onSave({ name: finalName, secretHash: hashed, anonymous: mode === "anonymous" });
  };

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onDismiss}
        className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.96 }}
        transition={{ type: "spring", stiffness: 320, damping: 30 }}
        className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:inset-auto md:left-1/2 md:-translate-x-1/2 md:top-1/2 md:w-[480px] z-50 rounded-3xl border border-white/10 bg-[#041C2C]/98 backdrop-blur-xl p-7 shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
      >
        <button onClick={onDismiss}
          className="absolute top-4 right-4 p-1.5 rounded-xl border border-white/10 opacity-40 hover:opacity-80 transition-opacity">
          <X size={14} />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-400/15 border border-amber-400/25 flex items-center justify-center mx-auto mb-3">
            <Users size={22} className="text-amber-400" />
          </div>
          <h3 className="text-lg font-semibold text-amber-400">Set up your identity</h3>
          <p className="text-xs opacity-40 mt-1">Choose how you appear on the Prayer Board</p>
        </div>

        <div className="flex gap-2 mb-5 p-1 rounded-2xl bg-white/5 border border-white/8">
          {["anonymous", "named"].map((m) => (
            <button key={m} onClick={() => setMode(m)}
              className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all ${
                mode === m ? "bg-amber-400/20 border border-amber-400/30 text-amber-400" : "opacity-40 hover:opacity-70"
              }`}>
              {m === "anonymous" ? "🎭 Stay Anonymous" : "✍️ Use My Name"}
            </button>
          ))}
        </div>

        <div className="space-y-3 mb-5">
          <div>
            <label className="text-xs opacity-40 mb-1.5 block">
              {mode === "anonymous" ? "Anonymous name (optional)" : "Your name *"}
            </label>
            <input value={name} onChange={(e) => setName(e.target.value)}
              placeholder={mode === "anonymous" ? suggested : "Enter your name..."}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-400/40 transition-all placeholder:opacity-30"
            />
            {mode === "anonymous" && <p className="text-xs opacity-25 mt-1">Leave blank to use "{suggested}"</p>}
          </div>
          <div>
            <label className="text-xs opacity-40 mb-1.5 flex items-center gap-1.5">
              <Lock size={10} /> Secret word * <span className="opacity-60">(needed to delete your posts)</span>
            </label>
            <div className="relative">
              <input type={showSecret ? "text" : "password"} value={secret}
                onChange={(e) => setSecret(e.target.value)}
                placeholder="Choose a secret word..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 pr-10 text-sm outline-none focus:border-amber-400/40 transition-all placeholder:opacity-30"
              />
              <button onClick={() => setShowSecret(!showSecret)}
                className="absolute right-3 top-1/2 -translate-y-1/2 opacity-30 hover:opacity-70">
                {showSecret ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            <p className="text-xs opacity-25 mt-1">Remember this — we never store it in plain text.</p>
          </div>
        </div>

        {error && <p className="text-xs text-red-400/80 mb-3 text-center">{error}</p>}

        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={handleSave}
          className="w-full py-3.5 rounded-2xl bg-amber-400/15 border border-amber-400/30 text-amber-400 font-semibold hover:bg-amber-400/25 transition-all">
          Continue to Prayer Board →
        </motion.button>
      </motion.div>
    </>
  );
}

// ─── Delete Modal ─────────────────────────────────────────────────────────────
function DeleteModal({ post, onConfirm, onClose }) {
  const [input, setInput] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!input.trim()) { setError("Enter your secret word."); return; }
    setLoading(true);
    const hashed = await hashSecret(input);
    if (hashed === post.secretHash) { await onConfirm(); }
    else { setError("Incorrect secret word. Only the author can delete this post."); }
    setLoading(false);
  };

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose} className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 320, damping: 30 }}
        className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:inset-auto md:left-1/2 md:-translate-x-1/2 md:top-1/2 md:w-[400px] z-50 rounded-3xl border border-white/10 bg-[#041C2C]/98 backdrop-blur-xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-2xl bg-red-400/10 border border-red-400/20 flex items-center justify-center">
            <Trash2 size={16} className="text-red-400" />
          </div>
          <div>
            <p className="text-sm font-semibold">Delete this post?</p>
            <p className="text-xs opacity-40">Enter your secret word to confirm</p>
          </div>
          <motion.button whileTap={{ scale: 0.93 }} onClick={onClose}
            className="ml-auto p-1.5 rounded-xl border border-white/10 opacity-50 hover:opacity-100">
            <X size={14} />
          </motion.button>
        </div>

        <div className="rounded-2xl border border-white/8 bg-white/3 px-4 py-3 mb-4">
          <p className="text-xs opacity-50 line-clamp-2">{post.message}</p>
        </div>

        <div className="relative mb-3">
          <input type={showInput ? "text" : "password"} value={input}
            onChange={(e) => { setInput(e.target.value); setError(""); }}
            placeholder="Your secret word..."
            onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 pr-10 text-sm outline-none focus:border-red-400/40 transition-all placeholder:opacity-30"
          />
          <button onClick={() => setShowInput(!showInput)}
            className="absolute right-3 top-1/2 -translate-y-1/2 opacity-30 hover:opacity-70">
            {showInput ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>

        {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-xs text-red-400/80 mb-3 text-center">{error}</motion.p>}

        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-white/10 text-sm opacity-50 hover:opacity-80 transition-opacity">Cancel</button>
          <motion.button whileTap={{ scale: 0.97 }} onClick={handleConfirm} disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-red-400/15 border border-red-400/30 text-red-400 text-sm font-medium hover:bg-red-400/25 disabled:opacity-40 transition-all flex items-center justify-center gap-2">
            {loading
              ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full" />
              : <><Trash2 size={13} /> Delete</>}
          </motion.button>
        </div>
      </motion.div>
    </>
  );
}

// ─── Main Board ───────────────────────────────────────────────────────────────
export default function CommunityPrayerBoard() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [expandedPost, setExpandedPost] = useState(null);
  const [newResponse, setNewResponse] = useState({});
  const [sharePost, setSharePost] = useState(null);
  const [deletePost, setDeletePost] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ category: "Dua Request", message: "" });
  const [pendingAction, setPendingAction] = useState(null); // what to do after identity saved

  const [identity, setIdentity] = useState(() => {
    try { return JSON.parse(localStorage.getItem("communityIdentity")) || null; }
    catch { return null; }
  });
  const [showIdentityModal, setShowIdentityModal] = useState(false);

  // ── Identity gate — call before any action that needs identity ──────────────
  const requireIdentity = (action) => {
    if (identity) return true;      // already set up, proceed
    setPendingAction(action);       // remember what they wanted
    setShowIdentityModal(true);     // show modal
    return false;
  };

  const handleSaveIdentity = (id) => {
    setIdentity(id);
    localStorage.setItem("communityIdentity", JSON.stringify(id));
    setShowIdentityModal(false);
    // resume the action they were trying to do
    if (pendingAction === "post") { setShowForm(true); }
    else if (typeof pendingAction === "object" && pendingAction?.type === "reply") {
      setExpandedPost(pendingAction.postId);
    }
    setPendingAction(null);
  };

  // No useEffect auto-showing — modal is ONLY triggered by user action
  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setPosts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, () => setLoading(false));
    return () => unsub();
  }, []);

  const handleSubmit = async () => {
    if (!form.message.trim() || submitting || !identity) return;
    setSubmitting(true);
    try {
      await addDoc(collection(db, "posts"), {
        category: form.category,
        message: form.message.trim(),
        author: identity.anonymous ? `${identity.name} (anon)` : identity.name,
        anonymous: identity.anonymous,
        secretHash: identity.secretHash,
        timestamp: serverTimestamp(),
        reactions: {},
        responses: [],
      });
      setForm({ category: "Dua Request", message: "" });
      setShowForm(false);
    } catch (e) { console.error(e); }
    finally { setSubmitting(false); }
  };

  const handleReaction = async (postId, emoji) => {
    const post = posts.find((p) => p.id === postId);
    const current = post?.reactions?.[emoji] || 0;
    await updateDoc(doc(db, "posts", postId), { [`reactions.${emoji}`]: current + 1 });
  };

  const handleResponse = async (postId) => {
    const text = newResponse[postId]?.trim();
    if (!text || !identity) return;
    await updateDoc(doc(db, "posts", postId), {
      responses: arrayUnion({ id: `r-${Date.now()}`, author: identity.anonymous ? `${identity.name} (anon)` : identity.name, text, timestamp: Date.now() }),
    });
    setNewResponse((prev) => ({ ...prev, [postId]: "" }));
  };

  const handleDeleteConfirmed = async () => {
    if (!deletePost) return;
    await deleteDoc(doc(db, "posts", deletePost.id));
    setDeletePost(null);
  };

  const filtered = activeCategory === "All" ? posts : posts.filter((p) => p.category === activeCategory);
  const totalAmeen = posts.reduce((acc, p) => acc + Object.values(p.reactions || {}).reduce((a, b) => a + b, 0), 0);

  return (
    <div className="min-h-screen">
      <AnimatePresence>
        {showIdentityModal && (
          <IdentityModal
            onSave={handleSaveIdentity}
            onDismiss={() => { setShowIdentityModal(false); setPendingAction(null); }}
          />
        )}
      </AnimatePresence>

      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl mb-8 p-10 border border-white/8 bg-ramadan-dark-elevated shadow-[0_8px_40px_rgba(0,0,0,0.45)]">
        <div className="absolute inset-0 opacity-5 pointer-events-none"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9a96e' fill-opacity='1'%3E%3Cpath d='M30 0l8.66 15H21.34L30 0zm0 60l-8.66-15h17.32L30 60zM0 30l15-8.66V38.66L0 30zm60 0L45 38.66V21.34L60 30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}
        />
        <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] bg-amber-400/8 blur-[120px] rounded-full pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-400/15 border border-amber-400/25 flex items-center justify-center">
                <Users size={20} className="text-amber-400" />
              </div>
              <span className="text-xs uppercase tracking-widest opacity-40">Community</span>
            </div>
            <h1 className="text-4xl font-semibold text-amber-400 mb-2">Prayer Board</h1>
            <p className="opacity-40 text-sm leading-relaxed max-w-md">
              A space for the Ummah to share du'a requests, gratitude, and spiritual support. 🤲
            </p>
          </div>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => { if (requireIdentity("post")) setShowForm(true); }}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-400/15 border border-amber-400/30 text-amber-400 font-medium hover:bg-amber-400/25 transition-all self-start"
          >
            <Sparkles size={16} /> Share a Request
          </motion.button>
        </div>

        <div className="relative z-10 flex gap-8 mt-8 pt-6 border-t border-white/8">
          {[
            { label: "Prayer Requests", value: posts.length },
            { label: "Responses", value: posts.reduce((acc, p) => acc + (p.responses?.length || 0), 0) },
            { label: "Ameen's Given", value: totalAmeen },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-2xl font-semibold text-amber-400">{value}</p>
              <p className="text-xs opacity-35">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Identity badge — only visible once set */}
      {identity && (
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-white/8 bg-white/3">
            <div className="w-6 h-6 rounded-full bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-xs text-amber-400 font-bold">
              {identity.name[0]}
            </div>
            <span className="text-xs opacity-40">Posting as</span>
            <span className="text-xs text-amber-400/70 font-medium">{identity.name}</span>
            {identity.anonymous && <span className="text-xs opacity-25">· anonymous</span>}
          </div>
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowIdentityModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/8 text-xs opacity-40 hover:opacity-70 transition-opacity">
            <Pencil size={11} /> Change
          </motion.button>
        </div>
      )}

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none mb-6">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <motion.button key={cat} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => setActiveCategory(cat)}
              className={`relative flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                isActive ? "border-amber-400/40 bg-amber-400/10 text-amber-400" : "border-white/8 opacity-40 hover:opacity-70"
              }`}>
              {cat}
              {isActive && <motion.div layoutId="community-filter-pill"
                className="absolute inset-0 rounded-xl border border-amber-400/30"
                transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
            </motion.button>
          );
        })}
      </div>

      {/* Posts */}
      {loading ? (
        <div className="text-center py-20 opacity-40">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="w-8 h-8 border-2 border-amber-400/40 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-sm">Loading community posts...</p>
        </div>
      ) : filtered.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="text-center py-20 rounded-3xl border border-dashed border-white/15">
          <p className="text-4xl mb-4">🤲</p>
          <p className="font-medium opacity-50">No posts yet</p>
          <p className="text-sm opacity-30 mt-1">Be the first to share a prayer request</p>
          <motion.button whileTap={{ scale: 0.97 }}
            onClick={() => { if (requireIdentity("post")) setShowForm(true); }}
            className="mt-4 text-sm text-amber-400/60 underline underline-offset-2 hover:text-amber-400">
            Share now
          </motion.button>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {filtered.map((post, idx) => {
              const isExpanded = expandedPost === post.id;
              return (
                <motion.div key={post.id}
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }} transition={{ delay: Math.min(idx * 0.04, 0.3) }}
                  className="rounded-3xl border border-white/8 bg-ramadan-dark-elevated overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-amber-400/15 border border-amber-400/25 flex items-center justify-center text-sm font-bold text-amber-400 flex-shrink-0">
                          {post.author?.[0] || "A"}
                        </div>
                        <div>
                          <p className="text-sm font-medium opacity-75">{post.author}</p>
                          <p className="text-xs opacity-30">{timeAgo(post.timestamp)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${categoryColor(post.category)} ${categoryBg(post.category)}`}>
                          {post.category}
                        </span>
                        <motion.button whileTap={{ scale: 0.9 }} onClick={() => setDeletePost(post)}
                          className="p-1.5 rounded-xl border border-white/8 opacity-25 hover:opacity-60 hover:border-red-400/30 hover:text-red-400 transition-all">
                          <Trash2 size={12} />
                        </motion.button>
                      </div>
                    </div>

                    <p className="text-sm leading-relaxed opacity-65 mb-5">{post.message}</p>

                    <div className="flex items-center gap-2 flex-wrap">
                      {RESPONSES.map((r) => (
                        <motion.button key={r} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }}
                          onClick={() => handleReaction(post.id, r)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs transition-all ${
                            post.reactions?.[r] > 0
                              ? "border-amber-400/30 bg-amber-400/8 text-amber-400"
                              : "border-white/8 opacity-50 hover:opacity-80 hover:border-amber-400/20"
                          }`}>
                          <span>{r}</span>
                          {post.reactions?.[r] > 0 && <span className="font-semibold">{post.reactions[r]}</span>}
                        </motion.button>
                      ))}

                      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        onClick={() => setSharePost(post)}
                        className="flex items-center gap-1.5 text-xs opacity-40 hover:opacity-70 transition-opacity">
                        <Share2 size={13} /> Share
                      </motion.button>

                      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          if (isExpanded) { setExpandedPost(null); return; }
                          // Require identity before opening reply box
                          if (requireIdentity({ type: "reply", postId: post.id })) setExpandedPost(post.id);
                        }}
                        className="ml-auto flex items-center gap-1.5 text-xs opacity-40 hover:opacity-70 transition-opacity">
                        <MessageCircle size={14} />
                        {post.responses?.length > 0 ? `${post.responses.length} response${post.responses.length > 1 ? "s" : ""}` : "Respond"}
                      </motion.button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
                        className="overflow-hidden border-t border-white/8">
                        <div className="p-6 space-y-4">
                          {post.responses?.length > 0 && (
                            <div className="space-y-3">
                              {post.responses.map((resp) => (
                                <div key={resp.id} className="flex gap-3">
                                  <div className="w-7 h-7 rounded-full bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-xs text-amber-400 flex-shrink-0">
                                    {resp.author?.[0] || "A"}
                                  </div>
                                  <div className="flex-1 rounded-2xl bg-white/5 px-4 py-3">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="text-xs font-medium opacity-60">{resp.author}</span>
                                      <span className="text-xs opacity-25">{timeAgo(resp.timestamp)}</span>
                                    </div>
                                    <p className="text-sm opacity-55 leading-relaxed">{resp.text}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                          {identity && (
                            <div className="flex gap-3">
                              <div className="w-7 h-7 rounded-full bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-xs text-amber-400 flex-shrink-0 mt-1">
                                {identity.name[0]}
                              </div>
                              <div className="flex-1 flex gap-2">
                                <input value={newResponse[post.id] || ""}
                                  onChange={(e) => setNewResponse((prev) => ({ ...prev, [post.id]: e.target.value }))}
                                  onKeyDown={(e) => e.key === "Enter" && handleResponse(post.id)}
                                  placeholder="Write a supportive message..."
                                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-400/40 transition-all placeholder:opacity-25"
                                />
                                <motion.button whileTap={{ scale: 0.93 }} onClick={() => handleResponse(post.id)}
                                  disabled={!newResponse[post.id]?.trim()}
                                  className="p-2.5 rounded-xl bg-amber-400/15 border border-amber-400/25 text-amber-400 disabled:opacity-30 hover:bg-amber-400/25 transition-all">
                                  <Send size={15} />
                                </motion.button>
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* New Post Modal */}
      <AnimatePresence>
        {showForm && identity && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowForm(false)} className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              className="fixed inset-x-4 bottom-4 md:inset-auto md:left-1/2 md:-translate-x-1/2 md:bottom-8 md:w-[560px] z-50 rounded-3xl border border-white/10 bg-[#041C2C]/98 backdrop-blur-xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.7)]"
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-lg font-semibold text-amber-400">Share with the Ummah</h3>
                  <p className="text-xs opacity-35 mt-0.5">
                    Posting as <span className="text-amber-400/70">{identity.name}</span>
                    {identity.anonymous && <span className="opacity-50"> · anonymous</span>}
                  </p>
                </div>
                <motion.button whileTap={{ scale: 0.93 }} onClick={() => setShowForm(false)}
                  className="p-2 rounded-xl border border-white/10 opacity-50 hover:opacity-100 transition-opacity">
                  <X size={16} />
                </motion.button>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none mb-4">
                {CATEGORIES.filter((c) => c !== "All").map((cat) => (
                  <motion.button key={cat} whileTap={{ scale: 0.95 }}
                    onClick={() => setForm((f) => ({ ...f, category: cat }))}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                      form.category === cat
                        ? `${categoryBg(cat)} ${categoryColor(cat)} border-current/40`
                        : "border-white/8 opacity-40 hover:opacity-70"
                    }`}>
                    {cat}
                  </motion.button>
                ))}
              </div>

              <textarea value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                placeholder="Share your du'a request, gratitude, or ask for guidance... 🤲"
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm outline-none focus:border-amber-400/40 transition-all placeholder:opacity-25 resize-none mb-5"
              />

              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={handleSubmit} disabled={!form.message.trim() || submitting}
                className="w-full py-3.5 rounded-2xl bg-amber-400/15 border border-amber-400/30 text-amber-400 font-semibold hover:bg-amber-400/25 disabled:opacity-30 transition-all flex items-center justify-center gap-2">
                {submitting
                  ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                  : <><Heart size={16} /> Share with the Ummah</>}
              </motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {sharePost && <SharePost post={sharePost} onClose={() => setSharePost(null)} />}
      </AnimatePresence>
      <AnimatePresence>
        {deletePost && <DeleteModal post={deletePost} onConfirm={handleDeleteConfirmed} onClose={() => setDeletePost(null)} />}
      </AnimatePresence>
    </div>
  );
}