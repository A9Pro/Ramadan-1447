// src/components/Community/CommunityPrayerBoard.jsx
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Send, Users, Sparkles, X } from "lucide-react";

const CATEGORIES = ["All", "Dua Request", "Guidance", "Gratitude", "Healing", "Family", "Hardship"];
const RESPONSES = ["🤲 Ameen", "❤️ In my du'a", "🌙 May Allah ease", "✨ SubhanAllah", "💪 Stay strong"];

function timeAgo(timestamp) {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function generateAnonymousName() {
  const adjectives = ["Sincere", "Humble", "Grateful", "Patient", "Hopeful", "Faithful", "Peaceful", "Devoted"];
  const nouns = ["Servant", "Believer", "Soul", "Heart", "Brother", "Sister", "Traveller", "Seeker"];
  return `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${nouns[Math.floor(Math.random() * nouns.length)]}`;
}

export default function CommunityPrayerBoard() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [expandedPost, setExpandedPost] = useState(null);
  const [newResponse, setNewResponse] = useState({});
  const [form, setForm] = useState({ category: "Dua Request", message: "", anonymous: true, name: "" });
  const [submitting, setSubmitting] = useState(false);
  const [myName] = useState(() => generateAnonymousName());
  const formRef = useRef(null);

  // Load posts from shared storage
  const loadPosts = async () => {
    try {
      const result = await window.storage.get("community-posts", true);
      if (result?.value) {
        setPosts(JSON.parse(result.value));
      }
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const savePosts = async (updatedPosts) => {
    try {
      await window.storage.set("community-posts", JSON.stringify(updatedPosts), true);
    } catch {}
  };

  useEffect(() => { loadPosts(); }, []);

  const handleSubmit = async () => {
    if (!form.message.trim()) return;
    setSubmitting(true);
    const newPost = {
      id: `post-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      category: form.category,
      message: form.message.trim(),
      author: form.anonymous ? myName : (form.name.trim() || myName),
      anonymous: form.anonymous,
      timestamp: Date.now(),
      reactions: {},
      responses: [],
    };
    const updated = [newPost, ...posts];
    setPosts(updated);
    await savePosts(updated);
    setForm({ category: "Dua Request", message: "", anonymous: true, name: "" });
    setShowForm(false);
    setSubmitting(false);
  };

  const handleReaction = async (postId, emoji) => {
    const updated = posts.map((p) => {
      if (p.id !== postId) return p;
      const reactions = { ...p.reactions };
      reactions[emoji] = (reactions[emoji] || 0) + 1;
      return { ...p, reactions };
    });
    setPosts(updated);
    await savePosts(updated);
  };

  const handleResponse = async (postId) => {
    const text = newResponse[postId]?.trim();
    if (!text) return;
    const updated = posts.map((p) => {
      if (p.id !== postId) return p;
      return {
        ...p,
        responses: [...(p.responses || []), {
          id: `resp-${Date.now()}`,
          author: myName,
          text,
          timestamp: Date.now(),
        }],
      };
    });
    setPosts(updated);
    await savePosts(updated);
    setNewResponse((prev) => ({ ...prev, [postId]: "" }));
  };

  const filtered = activeCategory === "All"
    ? posts
    : posts.filter((p) => p.category === activeCategory);

  const categoryColor = (cat) => {
    const map = {
      "Dua Request": "text-amber-400",
      "Guidance": "text-blue-400",
      "Gratitude": "text-emerald-400",
      "Healing": "text-rose-400",
      "Family": "text-purple-400",
      "Hardship": "text-orange-400",
    };
    return map[cat] || "text-ramadan-dark-accent";
  };

  return (
    <div className="min-h-screen relative">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl mb-8 p-10 border border-white/10 dark:border-white/10 border-black/10 bg-ramadan-dark-elevated dark:bg-ramadan-dark-elevated bg-ramadan-light-surface">
        <div className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9a96e' fill-opacity='1'%3E%3Cpath d='M30 0l8.66 15H21.34L30 0zm0 60l-8.66-15h17.32L30 60zM0 30l15-8.66V38.66L0 30zm60 0L45 38.66V21.34L60 30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-ramadan-dark-accent/20 border border-ramadan-dark-accent/30 flex items-center justify-center">
                <Users size={20} className="text-ramadan-dark-accent" />
              </div>
              <span className="text-xs uppercase tracking-widest opacity-50">Community</span>
            </div>
            <h1 className="text-4xl font-semibold text-ramadan-dark-accent dark:text-ramadan-dark-accent mb-2">
              Prayer Board
            </h1>
            <p className="opacity-50 text-sm leading-relaxed max-w-md">
              A space for the Ummah to share du'a requests, gratitude, and spiritual support. 
              Every post is met with the du'a of your brothers and sisters.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-ramadan-dark-accent/20 border border-ramadan-dark-accent/40 text-ramadan-dark-accent font-medium hover:bg-ramadan-dark-accent/30 transition-all self-start"
          >
            <Sparkles size={16} />
            Share a Request
          </motion.button>
        </div>

        {/* Stats */}
        <div className="relative z-10 flex gap-6 mt-8 pt-6 border-t border-white/10 dark:border-white/10 border-black/10">
          <div>
            <p className="text-2xl font-semibold text-ramadan-dark-accent">{posts.length}</p>
            <p className="text-xs opacity-40">Prayer Requests</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-ramadan-dark-accent">
              {posts.reduce((acc, p) => acc + (p.responses?.length || 0), 0)}
            </p>
            <p className="text-xs opacity-40">Responses</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-ramadan-dark-accent">
              {posts.reduce((acc, p) => acc + Object.values(p.reactions || {}).reduce((a, b) => a + b, 0), 0)}
            </p>
            <p className="text-xs opacity-40">Ameen's Given</p>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none mb-6">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveCategory(cat)}
              className={`relative flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                isActive
                  ? "border-ramadan-dark-accent/40 bg-ramadan-dark-accent/10 text-ramadan-dark-accent"
                  : "border-white/10 dark:border-white/10 border-black/10 opacity-50 hover:opacity-80"
              }`}
            >
              {cat}
              {isActive && (
                <motion.div
                  layoutId="community-filter-pill"
                  className="absolute inset-0 rounded-xl border border-ramadan-dark-accent/30"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Posts */}
      {loading ? (
        <div className="text-center py-20 opacity-40">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="w-8 h-8 border-2 border-current border-t-transparent rounded-full mx-auto mb-4"
          />
          Loading community posts...
        </div>
      ) : filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20 rounded-3xl border border-dashed border-white/20 dark:border-white/20 border-black/20"
        >
          <p className="text-4xl mb-4">🤲</p>
          <p className="font-medium opacity-60">No posts yet</p>
          <p className="text-sm opacity-40 mt-1">Be the first to share a prayer request</p>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowForm(true)}
            className="mt-4 text-sm text-ramadan-dark-accent underline underline-offset-2 opacity-70 hover:opacity-100"
          >
            Share now
          </motion.button>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {filtered.map((post, idx) => {
              const isExpanded = expandedPost === post.id;
              const totalReactions = Object.values(post.reactions || {}).reduce((a, b) => a + b, 0);
              return (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ delay: idx * 0.04 }}
                  className="rounded-3xl border border-white/10 dark:border-white/10 border-black/10 bg-ramadan-dark-elevated dark:bg-ramadan-dark-elevated bg-ramadan-light-surface overflow-hidden"
                >
                  <div className="p-6">
                    {/* Post header */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-ramadan-dark-accent/15 border border-ramadan-dark-accent/25 flex items-center justify-center text-sm font-semibold text-ramadan-dark-accent flex-shrink-0">
                          {post.author[0]}
                        </div>
                        <div>
                          <p className="text-sm font-medium opacity-80">{post.author}</p>
                          <p className="text-xs opacity-40">{timeAgo(post.timestamp)}</p>
                        </div>
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-full bg-black/10 dark:bg-white/10 font-medium ${categoryColor(post.category)}`}>
                        {post.category}
                      </span>
                    </div>

                    {/* Message */}
                    <p className="text-sm leading-relaxed opacity-70 mb-5">{post.message}</p>

                    {/* Quick reactions */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {RESPONSES.map((r) => (
                        <motion.button
                          key={r}
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.93 }}
                          onClick={() => handleReaction(post.id, r)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 dark:border-white/10 border-black/10 text-xs hover:border-ramadan-dark-accent/30 hover:bg-ramadan-dark-accent/5 transition-all"
                        >
                          <span>{r}</span>
                          {post.reactions?.[r] > 0 && (
                            <span className="text-ramadan-dark-accent font-medium">{post.reactions[r]}</span>
                          )}
                        </motion.button>
                      ))}

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setExpandedPost(isExpanded ? null : post.id)}
                        className="ml-auto flex items-center gap-1.5 text-xs opacity-50 hover:opacity-80 transition-opacity"
                      >
                        <MessageCircle size={14} />
                        {post.responses?.length > 0 ? `${post.responses.length} response${post.responses.length > 1 ? "s" : ""}` : "Respond"}
                      </motion.button>
                    </div>
                  </div>

                  {/* Expanded responses */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden border-t border-white/10 dark:border-white/10 border-black/10"
                      >
                        <div className="p-6 space-y-4">
                          {/* Existing responses */}
                          {post.responses?.length > 0 && (
                            <div className="space-y-3">
                              {post.responses.map((resp) => (
                                <div key={resp.id} className="flex gap-3">
                                  <div className="w-7 h-7 rounded-full bg-ramadan-dark-accent/10 border border-ramadan-dark-accent/20 flex items-center justify-center text-xs text-ramadan-dark-accent flex-shrink-0">
                                    {resp.author[0]}
                                  </div>
                                  <div className="flex-1 rounded-2xl bg-black/5 dark:bg-white/5 px-4 py-3">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="text-xs font-medium opacity-70">{resp.author}</span>
                                      <span className="text-xs opacity-30">{timeAgo(resp.timestamp)}</span>
                                    </div>
                                    <p className="text-sm opacity-60 leading-relaxed">{resp.text}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Write response */}
                          <div className="flex gap-3">
                            <div className="w-7 h-7 rounded-full bg-ramadan-dark-accent/20 border border-ramadan-dark-accent/30 flex items-center justify-center text-xs text-ramadan-dark-accent flex-shrink-0 mt-1">
                              {myName[0]}
                            </div>
                            <div className="flex-1 flex gap-2">
                              <input
                                value={newResponse[post.id] || ""}
                                onChange={(e) => setNewResponse((prev) => ({ ...prev, [post.id]: e.target.value }))}
                                onKeyDown={(e) => e.key === "Enter" && handleResponse(post.id)}
                                placeholder="Write a supportive message..."
                                className="flex-1 bg-black/5 dark:bg-white/5 border border-white/10 dark:border-white/10 border-black/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-ramadan-dark-accent/40 transition-all placeholder:opacity-30"
                              />
                              <motion.button
                                whileTap={{ scale: 0.93 }}
                                onClick={() => handleResponse(post.id)}
                                disabled={!newResponse[post.id]?.trim()}
                                className="p-2.5 rounded-xl bg-ramadan-dark-accent/20 border border-ramadan-dark-accent/30 text-ramadan-dark-accent disabled:opacity-30 hover:bg-ramadan-dark-accent/30 transition-all"
                              >
                                <Send size={15} />
                              </motion.button>
                            </div>
                          </div>
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
        {showForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowForm(false)}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              className="fixed inset-x-4 bottom-4 md:inset-auto md:left-1/2 md:-translate-x-1/2 md:bottom-8 md:w-[560px] z-50 rounded-3xl border border-white/10 dark:border-white/10 border-black/10 bg-ramadan-dark-elevated dark:bg-ramadan-dark-elevated bg-ramadan-light-surface p-6 shadow-2xl"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-lg font-semibold text-ramadan-dark-accent">Share with the Ummah</h3>
                  <p className="text-xs opacity-40 mt-0.5">Your post will be visible to the community</p>
                </div>
                <motion.button
                  whileTap={{ scale: 0.93 }}
                  onClick={() => setShowForm(false)}
                  className="p-2 rounded-xl border border-white/10 dark:border-white/10 border-black/10 opacity-50 hover:opacity-100 transition-opacity"
                >
                  <X size={16} />
                </motion.button>
              </div>

              {/* Category select */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none mb-4">
                {CATEGORIES.filter(c => c !== "All").map((cat) => (
                  <motion.button
                    key={cat}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setForm((f) => ({ ...f, category: cat }))}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                      form.category === cat
                        ? "border-ramadan-dark-accent/40 bg-ramadan-dark-accent/10 text-ramadan-dark-accent"
                        : "border-white/10 dark:border-white/10 border-black/10 opacity-50 hover:opacity-80"
                    }`}
                  >
                    {cat}
                  </motion.button>
                ))}
              </div>

              {/* Message textarea */}
              <textarea
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                placeholder="Share your du'a request, gratitude, or ask for guidance... The community is here for you."
                rows={4}
                className="w-full bg-black/5 dark:bg-white/5 border border-white/10 dark:border-white/10 border-black/10 rounded-2xl px-4 py-3 text-sm outline-none focus:border-ramadan-dark-accent/40 transition-all placeholder:opacity-30 resize-none mb-4"
              />

              {/* Anonymous toggle */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-sm font-medium opacity-70">Post anonymously</p>
                  <p className="text-xs opacity-40">Your name will show as "{myName}"</p>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setForm((f) => ({ ...f, anonymous: !f.anonymous }))}
                  className={`w-12 h-6 rounded-full border transition-all relative ${
                    form.anonymous
                      ? "bg-ramadan-dark-accent/30 border-ramadan-dark-accent/50"
                      : "bg-black/10 dark:bg-white/10 border-white/10 dark:border-white/10 border-black/10"
                  }`}
                >
                  <motion.div
                    animate={{ x: form.anonymous ? 24 : 2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className={`absolute top-0.5 w-5 h-5 rounded-full ${
                      form.anonymous ? "bg-ramadan-dark-accent" : "bg-current opacity-30"
                    }`}
                  />
                </motion.button>
              </div>

              {/* Submit */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleSubmit}
                disabled={!form.message.trim() || submitting}
                className="w-full py-3.5 rounded-2xl bg-ramadan-dark-accent/20 border border-ramadan-dark-accent/40 text-ramadan-dark-accent font-semibold hover:bg-ramadan-dark-accent/30 disabled:opacity-40 transition-all flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}
                    className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                  />
                ) : (
                  <>
                    <Heart size={16} />
                    Share with the Ummah
                  </>
                )}
              </motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}