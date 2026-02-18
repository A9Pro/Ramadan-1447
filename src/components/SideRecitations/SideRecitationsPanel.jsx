// src/components/SideRecitations/SideRecitationsPanel.jsx
import recitations from "./recitations.json";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Square, Play } from "lucide-react";

export default function SideRecitationsPanel() {
  const [selected, setSelected] = useState(recitations[0]);
  const [direction, setDirection] = useState(1);
  const [speaking, setSpeaking] = useState(false);
  const [supported] = useState(() => "speechSynthesis" in window);
  const utteranceRef = useRef(null);

  // Stop speech when changing recitation
  useEffect(() => {
    stopSpeaking();
  }, [selected]);

  // Cleanup on unmount
  useEffect(() => {
    return () => stopSpeaking();
  }, []);

  const handleSelect = (r) => {
    const newIndex = recitations.indexOf(r);
    const oldIndex = recitations.indexOf(selected);
    setDirection(newIndex > oldIndex ? 1 : -1);
    setSelected(r);
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setSpeaking(false);
  };

  const speak = () => {
    if (!supported) return;
    if (speaking) {
      stopSpeaking();
      return;
    }

    // Build text to speak: transliteration if available, else text
    const textToSpeak = selected.transliteration || selected.text || selected.arabic || "";
    if (!textToSpeak) return;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);

    // Try to find an Arabic voice for arabic text, else default
    const voices = window.speechSynthesis.getVoices();
    const arabicVoice = voices.find(
      (v) => v.lang.startsWith("ar") || v.name.toLowerCase().includes("arabic")
    );

    if (selected.arabic && arabicVoice) {
      // Speak Arabic text with arabic voice
      utterance.text = selected.arabic;
      utterance.voice = arabicVoice;
      utterance.lang = "ar-SA";
    } else {
      // Speak transliteration/english
      utterance.lang = "en-US";
      utterance.rate = 0.85;
      utterance.pitch = 1;
    }

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-2xl font-semibold text-amber-400">
            Side Recitations
          </h2>
          <p className="text-sm mt-1 opacity-40">Daily adhkar & supplications</p>
        </div>

        {/* Voice button */}
        {supported && (
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.93 }}
            onClick={speak}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
              speaking
                ? "border-amber-400/50 bg-amber-400/15 text-amber-400"
                : "border-white/10 opacity-50 hover:opacity-80"
            }`}
          >
            {speaking ? (
              <>
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                >
                  <Square size={12} className="fill-current" />
                </motion.div>
                Stop
              </>
            ) : (
              <>
                <Volume2 size={13} />
                Listen
              </>
            )}
          </motion.button>
        )}
      </div>

      {/* Tab Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none mb-5">
        {recitations.map((r, idx) => {
          const isActive = selected.name === r.name;
          return (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleSelect(r)}
              className={`relative flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                isActive
                  ? "border-amber-400/40 bg-amber-400/10 text-amber-400"
                  : "border-white/8 opacity-40 hover:opacity-70"
              }`}
            >
              {r.name}
              {isActive && (
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

      {/* Content Card */}
      <div className="relative overflow-hidden rounded-2xl border border-white/8 bg-white/3 min-h-[140px]">
        {/* Speaking waveform indicator */}
        <AnimatePresence>
          {speaking && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-3 right-3 flex items-center gap-0.5"
            >
              {[1, 2, 3, 4, 3].map((h, i) => (
                <motion.div
                  key={i}
                  animate={{ scaleY: [1, h, 1] }}
                  transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1, ease: "easeInOut" }}
                  className="w-0.5 bg-amber-400 rounded-full origin-bottom"
                  style={{ height: 12 }}
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
            <h3 className="font-semibold text-base opacity-90">{selected.name}</h3>

            {selected.arabic && (
              <p
                dir="rtl"
                className="text-right text-xl leading-loose opacity-80 font-arabic"
              >
                {selected.arabic}
              </p>
            )}

            <p className="text-sm leading-relaxed opacity-55">{selected.text}</p>

            {selected.transliteration && (
              <p className="text-xs italic opacity-35">{selected.transliteration}</p>
            )}

            {/* Audio file fallback */}
            {selected.audio && (
              <div className="pt-2 flex items-center gap-3">
                <Volume2 size={13} className="opacity-30 flex-shrink-0" />
                <audio
                  controls
                  src={selected.audio}
                  className="w-full h-8 opacity-60 hover:opacity-90 transition-opacity"
                />
              </div>
            )}

            {/* Voice recitation hint */}
            {!selected.audio && supported && !speaking && (
              <button
                onClick={speak}
                className="flex items-center gap-1.5 text-xs text-amber-400/50 hover:text-amber-400/80 transition-colors mt-1"
              >
                <Play size={11} />
                Tap "Listen" to hear this recitation
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