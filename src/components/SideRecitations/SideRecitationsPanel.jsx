// src/components/SideRecitations/SideRecitationsPanel.jsx
import recitations from "./recitations.json";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, Square, Play, Mic } from "lucide-react";

export default function SideRecitationsPanel() {
  const [selected, setSelected] = useState(recitations[0]);
  const [direction, setDirection] = useState(1);
  const [speaking, setSpeaking] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [speechSupported] = useState(() => "speechSynthesis" in window);
  const audioRef = useRef(null);
  const utteranceRef = useRef(null);

  useEffect(() => {
    stopAll();
  }, [selected]);

  useEffect(() => {
    return () => stopAll();
  }, []);

  const stopAll = () => {
    // Stop speech
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setSpeaking(false);
    // Stop audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setAudioPlaying(false);
  };

  const handleSelect = (r) => {
    const newIndex = recitations.indexOf(r);
    const oldIndex = recitations.indexOf(selected);
    setDirection(newIndex > oldIndex ? 1 : -1);
    setSelected(r);
  };

  // For Ayat al-Kursi — play real Mishary audio
  const playAudio = () => {
    if (audioPlaying) {
      stopAll();
      return;
    }
    if (!audioRef.current) return;
    audioRef.current.play();
    setAudioPlaying(true);
    audioRef.current.onended = () => setAudioPlaying(false);
  };

  // For others — use Arabic Web Speech
  const speakArabic = () => {
    if (!speechSupported) return;
    if (speaking) {
      stopAll();
      return;
    }

    const text = selected.arabic || selected.transliteration || selected.text;
    if (!text) return;

    window.speechSynthesis.cancel();

    // Wait for voices to load
    const doSpeak = () => {
      const voices = window.speechSynthesis.getVoices();
      const arabicVoice =
        voices.find((v) => v.lang === "ar-SA") ||
        voices.find((v) => v.lang.startsWith("ar")) ||
        voices.find((v) => v.name.toLowerCase().includes("arabic"));

      const utterance = new SpeechSynthesisUtterance(selected.arabic || text);
      utterance.lang = "ar-SA";
      utterance.rate = 0.75;
      utterance.pitch = 1;
      if (arabicVoice) utterance.voice = arabicVoice;

      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    };

    // Voices might not be loaded yet
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = doSpeak;
    } else {
      doSpeak();
    }
  };

  const isActive = speaking || audioPlaying;
  const hasRealAudio = !!selected.audio;

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-2xl font-semibold text-amber-400">Side Recitations</h2>
          <p className="text-sm mt-1 opacity-40">Daily adhkar & supplications</p>
        </div>

        {/* Listen button */}
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.93 }}
          onClick={hasRealAudio ? playAudio : speakArabic}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
            isActive
              ? "border-amber-400/50 bg-amber-400/15 text-amber-400"
              : "border-white/10 opacity-50 hover:opacity-80"
          }`}
        >
          {isActive ? (
            <>
              <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ repeat: Infinity, duration: 0.7 }}>
                <Square size={11} className="fill-current" />
              </motion.div>
              Stop
            </>
          ) : (
            <>
              <Volume2 size={13} />
              {hasRealAudio ? "Al-Afasy" : "Listen"}
            </>
          )}
        </motion.button>
      </div>

      {/* Reciter badge for Ayat al-Kursi */}
      <AnimatePresence>
        {selected.reciter && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="flex items-center gap-2 mb-4 px-3 py-1.5 rounded-xl border border-amber-400/20 bg-amber-400/8 w-fit"
          >
            <Mic size={11} className="text-amber-400" />
            <span className="text-xs text-amber-400/70">{selected.reciter}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden audio element for Mishary tracks */}
      {selected.audio && (
        <audio ref={audioRef} src={selected.audio} preload="none" />
      )}

      {/* Tab Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none mb-5">
        {recitations.map((r, idx) => {
          const isSelected = selected.name === r.name;
          return (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleSelect(r)}
              className={`relative flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                isSelected
                  ? "border-amber-400/40 bg-amber-400/10 text-amber-400"
                  : "border-white/8 opacity-40 hover:opacity-70"
              }`}
            >
              {r.name}
              {r.audio && (
                <span className="ml-1 text-amber-400/50 text-xs">♪</span>
              )}
              {isSelected && (
                <motion.div
                  layoutId="recitation-pill"
                  className="absolute inset-0 rounded-xl border border-amber-400/30"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Content */}
      <div className="relative overflow-hidden rounded-2xl border border-white/8 bg-white/3 min-h-[160px]">

        {/* Waveform while playing */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-3 right-3 flex items-end gap-0.5 h-4"
            >
              {[2, 4, 3, 5, 2, 4, 3].map((h, i) => (
                <motion.div
                  key={i}
                  animate={{ scaleY: [0.3, 1, 0.3] }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.7 + i * 0.05,
                    delay: i * 0.08,
                    ease: "easeInOut",
                  }}
                  className="w-0.5 rounded-full bg-amber-400 origin-bottom"
                  style={{ height: h * 3 }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={selected.name}
            custom={direction}
            initial={{ opacity: 0, x: direction * 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -24 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="p-5 space-y-3"
          >
            <h3 className="font-semibold text-sm opacity-60 uppercase tracking-wider">
              {selected.name}
            </h3>

            {selected.arabic && (
              <p dir="rtl" className="text-right text-xl leading-loose opacity-85 font-arabic">
                {selected.arabic}
              </p>
            )}

            <p className="text-sm leading-relaxed opacity-50">{selected.text}</p>

            {selected.transliteration && (
              <p className="text-xs italic opacity-30 leading-relaxed">
                {selected.transliteration}
              </p>
            )}

            {selected.note && (
              <div className="mt-3 px-3 py-2 rounded-xl border border-amber-400/15 bg-amber-400/5">
                <p className="text-xs opacity-50 leading-relaxed">📖 {selected.note}</p>
              </div>
            )}

            {/* Tap hint */}
            {!isActive && (
              <button
                onClick={hasRealAudio ? playAudio : speakArabic}
                className="flex items-center gap-1.5 text-xs text-amber-400/40 hover:text-amber-400/70 transition-colors"
              >
                <Play size={10} />
                {hasRealAudio ? "Play Mishary Al-Afasy recitation" : "Listen in Arabic"}
              </button>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-1.5 mt-4">
        {recitations.map((r, idx) => (
          <button
            key={idx}
            onClick={() => handleSelect(r)}
            className={`rounded-full transition-all ${
              selected.name === r.name
                ? "w-4 h-1.5 bg-amber-400"
                : "w-1.5 h-1.5 bg-current opacity-20"
            }`}
          />
        ))}
      </div>
    </div>
  );
}