// src/components/Ramadan/RamadanPanel.jsx
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, Pause, Volume2, VolumeX, Music2, Upload,
  ChevronDown, ChevronUp, Moon, Star, Sunset
} from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const QUNUT = [
  {
    arabic: "اللَّهُمَّ اهْدِنَا فِيمَنْ هَدَيْتَ",
    transliteration: "Allāhummah-dinā fīman hadayt",
    translation: "O Allah, guide us among those whom You have guided",
  },
  {
    arabic: "وَعَافِنَا فِيمَنْ عَافَيْتَ",
    transliteration: "Wa 'āfinā fīman 'āfayt",
    translation: "Grant us wellness among those whom You have granted wellness",
  },
  {
    arabic: "وَتَوَلَّنَا فِيمَنْ تَوَلَّيْتَ",
    transliteration: "Wa tawallanā fīman tawallayt",
    translation: "Befriend us among those whom You have befriended",
  },
  {
    arabic: "وَبَارِكْ لَنَا فِيمَا أَعْطَيْتَ",
    transliteration: "Wa bārik lanā fīmā a'ṭayt",
    translation: "Bless us in what You have bestowed upon us",
  },
  {
    arabic: "وَقِنَا شَرَّ مَا قَضَيْتَ",
    transliteration: "Wa qinā sharra mā qaḍayt",
    translation: "And protect us from the evil of what You have decreed",
  },
  {
    arabic: "فَإِنَّكَ تَقْضِي وَلَا يُقْضَىٰ عَلَيْكَ",
    transliteration: "Fa innaka taqḍī wa lā yuqḍā 'alayk",
    translation: "For indeed You decree and none can decree against You",
  },
  {
    arabic: "وَإِنَّهُ لَا يَذِلُّ مَنْ وَالَيْتَ",
    transliteration: "Wa innahu lā yadhillu man wālayt",
    translation: "Verily, he whom You befriend is never humiliated",
  },
  {
    arabic: "وَلَا يَعِزُّ مَنْ عَادَيْتَ",
    transliteration: "Wa lā ya'izzu man 'ādayt",
    translation: "And he whom You oppose is never honoured",
  },
  {
    arabic: "تَبَارَكْتَ رَبَّنَا وَتَعَالَيْتَ",
    transliteration: "Tabārakta Rabbanā wa ta'ālayt",
    translation: "Blessed are You, our Lord, and Most Exalted",
  },
  {
    arabic: "نَسْتَغْفِرُكَ وَنَتُوبُ إِلَيْكَ",
    transliteration: "Nastaghfiruka wa natūbu ilayk",
    translation: "We seek Your forgiveness and we repent to You",
  },
  {
    arabic: "وَصَلَّى اللَّهُ عَلَى النَّبِيِّ الأُمِّيِّ وَعَلَى آلِهِ وَصَحْبِهِ وَسَلَّمَ",
    transliteration: "Wa ṣallallāhu 'alan-nabiyyil-ummiyyi wa 'alā ālihi wa ṣaḥbihi wa sallam",
    translation: "And may Allah's peace and blessings be upon the Prophet, his family and companions",
  },
];

const RAMADAN_DUAS = [
  {
    title: "Seeing the Ramadan Moon",
    arabic: "اللَّهُمَّ أَهِلَّهُ عَلَيْنَا بِالْأَمْنِ وَالْإِيمَانِ وَالسَّلَامَةِ وَالْإِسْلَامِ رَبِّي وَرَبُّكَ اللَّهُ",
    transliteration: "Allāhumma ahillahu 'alaynā bil-amni wal-īmāni was-salāmati wal-islāmi, Rabbī wa Rabbukallāh",
    translation: "O Allah, bring this crescent upon us with security, faith, safety and Islam. My Lord and your Lord is Allah",
    note: "Recited upon sighting the new moon of Ramadan",
  },
  {
    title: "First 10 Nights — Mercy",
    arabic: "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ",
    transliteration: "Yā Ḥayyu yā Qayyūmu bi-raḥmatika astaghīth",
    translation: "O Ever-Living, O Self-Sustaining, by Your mercy I seek help",
    note: "رحمة — Rahmah (Days 1–10)",
  },
  {
    title: "Middle 10 Nights — Forgiveness",
    arabic: "أَسْتَغْفِرُ اللَّهَ رَبِّي مِنْ كُلِّ ذَنْبٍ وَأَتُوبُ إِلَيْهِ",
    transliteration: "Astaghfirullāha Rabbī min kulli dhanbin wa atūbu ilayh",
    translation: "I seek forgiveness from Allah, my Lord, for every sin and I repent to Him",
    note: "مغفرة — Maghfirah (Days 11–20)",
  },
  {
    title: "Last 10 Nights — Laylat al-Qadr",
    arabic: "اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي",
    transliteration: "Allāhumma innaka 'afuwwun tuḥibbul-'afwa fa'fu 'annī",
    translation: "O Allah, You are Forgiving and You love forgiveness, so forgive me",
    note: "عتق — 'Itq (Days 21–30) — The dua of Aisha (RA) taught by the Prophet ﷺ",
  },
  {
    title: "Acceptance of Fasting",
    arabic: "اللَّهُمَّ تَقَبَّلْ مِنَّا صِيَامَنَا وَقِيَامَنَا وَرُكُوعَنَا وَسُجُودَنَا",
    transliteration: "Allāhumma taqabbal minnā ṣiyāmanā wa qiyāmanā wa rukū'anā wa sujūdanā",
    translation: "O Allah, accept from us our fasting, our night prayers, our bowing, and our prostrations",
    note: null,
  },
  {
    title: "Freedom from the Fire",
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ رَحْمَتَكَ وَمَغْفِرَتَكَ وَعِتْقًا مِنَ النَّارِ",
    transliteration: "Allāhumma innī as'aluka raḥmataka wa maghfirataka wa 'itqan minan-nār",
    translation: "O Allah, I ask You for Your mercy, Your forgiveness, and freedom from the Fire",
    note: null,
  },
  {
    title: "Dua for the Ummah",
    arabic: "رَبَّنَا اغْفِرْ لَنَا وَلِإِخْوَانِنَا الَّذِينَ سَبَقُونَا بِالْإِيمَانِ",
    transliteration: "Rabbanagh-fir lanā wa li-ikhwāninā alladhīna sabaqūnā bil-īmān",
    translation: "Our Lord, forgive us and our brothers who preceded us in faith",
    note: "Quran 59:10",
  },
];

const IFTAR_DUAS = [
  {
    title: "Dua at Iftar (Short — most known)",
    arabic: "اللَّهُمَّ لَكَ صُمْتُ وَعَلَىٰ رِزْقِكَ أَفْطَرْتُ",
    transliteration: "Allāhumma laka ṣumtu wa 'alā rizqika afṭart",
    translation: "O Allah, I fasted for You and I break my fast with Your provision",
    note: "Narrated by Abu Dawud",
  },
  {
    title: "Dua at Iftar (Full — Abu Dawud)",
    arabic: "ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللَّهُ",
    transliteration: "Dhahaba aẓ-ẓama'u wab-tallatil-'urūqu wa thabatal-ajru inshā'Allāh",
    translation: "The thirst is gone, the veins are moistened, and the reward is established, if Allah wills",
    note: "Narrated by Abu Dawud — recited by the Prophet ﷺ at Iftar",
  },
  {
    title: "Bismillah before eating",
    arabic: "بِسْمِ اللَّهِ وَعَلَى بَرَكَةِ اللَّهِ",
    transliteration: "Bismillāhi wa 'alā barakatillāh",
    translation: "In the name of Allah and with the blessings of Allah",
    note: null,
  },
  {
    title: "Gratitude after Iftar",
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ",
    transliteration: "Alḥamdulillāhil-ladhī aṭ'amanā wa saqānā wa ja'alanā muslimīn",
    translation: "Praise be to Allah who fed us, gave us drink, and made us Muslims",
    note: null,
  },
  {
    title: "Dua of the fasting person (mercy)",
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ بِرَحْمَتِكَ الَّتِي وَسِعَتْ كُلَّ شَيْءٍ أَنْ تَغْفِرَ لِي",
    transliteration: "Allāhumma innī as'aluka bi-raḥmatikal-latī wasi'at kulla shay'in an taghfira lī",
    translation: "O Allah, I ask You by Your mercy which encompasses all things, to forgive me",
    note: "Ibn Majah",
  },
  {
    title: "Niyyah — Suhoor intention",
    arabic: "وَبِصَوْمِ غَدٍ نَوَيْتُ مِنْ شَهْرِ رَمَضَانَ",
    transliteration: "Wa bi-ṣawmi ghadin nawaytu min shahri Ramaḍān",
    translation: "I intend to keep the fast of tomorrow in the month of Ramadan",
    note: "Said at Suhoor time",
  },
];

// ─── Audio Player ─────────────────────────────────────────────────────────────
function AudioPlayer() {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) { audioRef.current.pause(); setPlaying(false); }
    else { audioRef.current.play().then(() => setPlaying(true)).catch(() => setError(true)); }
  };

  const fmt = (s) => {
    if (!s || isNaN(s)) return "0:00";
    return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  };

  return (
    <div className="rounded-2xl border border-amber-400/25 bg-gradient-to-r from-amber-400/8 to-transparent p-4 mb-2">
      <audio ref={audioRef} src="/audio/qunut.mp3" preload="metadata"
        onTimeUpdate={() => setProgress(audioRef.current?.currentTime || 0)}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
        onEnded={() => { setPlaying(false); setProgress(0); }}
        onError={() => { setError(true); setPlaying(false); }}
        muted={muted}
      />

      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-xl bg-amber-400/15 border border-amber-400/25 flex items-center justify-center flex-shrink-0">
          <Music2 size={15} className="text-amber-400" />
        </div>
        <div className="flex-1">
          <p className="text-xs font-semibold text-amber-400">Al Qunūt Full Recitation</p>
          <p className="text-[10px] opacity-40">Mishary Rashid Al-Afasy</p>
        </div>
        <motion.button whileTap={{ scale: 0.9 }}
          onClick={() => setMuted(!muted)}
          className="p-1.5 rounded-xl border border-white/8 opacity-40 hover:opacity-80 transition-opacity">
          {muted ? <VolumeX size={12} /> : <Volume2 size={12} />}
        </motion.button>
      </div>

      {error ? (
        <div className="text-center py-1 space-y-2">
          <p className="text-[10px] text-amber-400/60">Audio file not yet uploaded</p>
          <button onClick={() => setShowUpload(!showUpload)}
            className="flex items-center gap-1.5 text-[10px] opacity-40 hover:opacity-70 mx-auto transition-opacity">
            <Upload size={9} /> How to add the audio
            {showUpload ? <ChevronUp size={9} /> : <ChevronDown size={9} />}
          </button>
          <AnimatePresence>
            {showUpload && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="text-left p-3 rounded-xl border border-white/8 bg-white/3 text-[10px] opacity-50 space-y-1.5">
                  <p className="font-medium opacity-80">Steps to add Al Qunūt audio:</p>
                  <p>1. Download an MP3 of Al Qunūt (Mishary Al-Afasy recommended)</p>
                  <p>2. Rename the file to <code className="bg-white/15 px-1 rounded">qunut.mp3</code></p>
                  <p>3. In your project, create the folder <code className="bg-white/15 px-1 rounded">public/audio/</code></p>
                  <p>4. Place <code className="bg-white/15 px-1 rounded">qunut.mp3</code> inside that folder</p>
                  <p>5. Run <code className="bg-white/15 px-1 rounded">git add . && git push</code> — the button activates instantly</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <motion.button whileTap={{ scale: 0.88 }} whileHover={{ scale: 1.06 }}
            onClick={togglePlay}
            className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all flex-shrink-0 ${
              playing
                ? "bg-amber-400/25 border-amber-400/60 text-amber-400"
                : "bg-amber-400/10 border-amber-400/30 text-amber-400/70 hover:bg-amber-400/20"
            }`}>
            {playing
              ? <Pause size={15} />
              : <Play size={15} className="ml-0.5" />
            }
          </motion.button>

          <div className="flex-1 space-y-1">
            <div className="relative h-2 rounded-full bg-white/10 cursor-pointer"
              onClick={(e) => {
                if (!audioRef.current || !duration) return;
                const pct = (e.clientX - e.currentTarget.getBoundingClientRect().left) / e.currentTarget.offsetWidth;
                audioRef.current.currentTime = pct * duration;
                setProgress(pct * duration);
              }}>
              <motion.div className="absolute left-0 top-0 h-full rounded-full bg-amber-400"
                style={{ width: duration ? `${(progress / duration) * 100}%` : "0%" }} />
              {/* Thumb */}
              {duration > 0 && (
                <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-amber-400 border-2 border-[#041C2C] shadow"
                  style={{ left: `calc(${(progress / duration) * 100}% - 6px)` }} />
              )}
            </div>
            <div className="flex justify-between">
              <span className="text-[9px] opacity-30">{fmt(progress)}</span>
              <span className="text-[9px] opacity-30">{fmt(duration)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Dua Card ─────────────────────────────────────────────────────────────────
function DuaCard({ item, index }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="rounded-2xl border border-white/8 bg-white/3 overflow-hidden"
    >
      {/* Header — always visible */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/3 transition-colors"
      >
        <div className="flex-1 min-w-0 pr-3">
          <p className="text-sm font-medium opacity-80">{item.title}</p>
          {item.note && <p className="text-[10px] opacity-35 mt-0.5 italic">{item.note}</p>}
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={14} className="opacity-40 flex-shrink-0" />
        </motion.div>
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-3 border-t border-white/8 pt-4">
              {/* Arabic */}
              <p
                className="text-xl leading-loose text-amber-400 text-right"
                dir="rtl"
                style={{ fontFamily: "'Noto Naskh Arabic', 'Amiri', 'Scheherazade New', serif", lineHeight: "2.4" }}
              >
                {item.arabic}
              </p>

              <div className="w-10 h-px bg-amber-400/20" />

              {/* Transliteration */}
              <p className="text-sm italic opacity-65 leading-relaxed">{item.transliteration}</p>

              {/* Translation */}
              <p className="text-xs opacity-40 leading-relaxed">"{item.translation}"</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Qunut Verse Card ─────────────────────────────────────────────────────────
function QunutCard({ verse, index, active, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      onClick={onClick}
      className={`rounded-2xl border px-5 py-4 space-y-2 cursor-pointer transition-all ${
        active
          ? "border-amber-400/40 bg-amber-400/8"
          : "border-white/8 bg-white/3 hover:bg-white/5"
      }`}
    >
      {/* Part number */}
      <div className="flex items-center gap-2 mb-1">
        <div className={`w-5 h-5 rounded-full text-[9px] font-bold flex items-center justify-center border ${
          active ? "bg-amber-400 border-amber-400 text-[#041C2C]" : "border-white/20 opacity-30"
        }`}>
          {index + 1}
        </div>
        {active && <span className="text-[10px] text-amber-400/60 uppercase tracking-widest">Reading</span>}
      </div>

      {/* Arabic */}
      <p
        className={`text-lg leading-loose text-right transition-colors ${active ? "text-amber-400" : "opacity-70"}`}
        dir="rtl"
        style={{ fontFamily: "'Noto Naskh Arabic', 'Amiri', 'Scheherazade New', serif", lineHeight: "2.2" }}
      >
        {verse.arabic}
      </p>

      <div className="w-8 h-px bg-amber-400/15" />

      {/* Transliteration */}
      <p className="text-xs italic opacity-55 leading-relaxed">{verse.transliteration}</p>

      {/* Translation */}
      <p className="text-xs opacity-35 leading-relaxed">"{verse.translation}"</p>
    </motion.div>
  );
}

// ─── Section Toggle ───────────────────────────────────────────────────────────
function SectionHeader({ icon: Icon, title, subtitle, color, open, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center gap-4 text-left group"
    >
      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 border ${color}`}>
        <Icon size={18} />
      </div>
      <div className="flex-1">
        <p className="text-base font-semibold">{title}</p>
        <p className="text-xs opacity-35">{subtitle}</p>
      </div>
      <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}
        className="opacity-30 group-hover:opacity-60 transition-opacity">
        <ChevronDown size={16} />
      </motion.div>
    </button>
  );
}

// ─── Main Panel ───────────────────────────────────────────────────────────────
export default function RamadanPanel() {
  const [activeQunut, setActiveQunut] = useState(0);
  const [sectionsOpen, setSectionsOpen] = useState({
    qunut: true,
    ramadan: false,
    iftar: false,
  });

  const toggle = (key) =>
    setSectionsOpen((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="min-h-screen space-y-6">

      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl border border-white/8 bg-ramadan-dark-elevated p-8 shadow-[0_8px_40px_rgba(0,0,0,0.45)]">
        <div className="absolute top-[-80px] right-[-80px] w-[300px] h-[300px] bg-amber-400/8 blur-[100px] rounded-full pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/15 border border-amber-400/25 flex items-center justify-center">
              <Moon size={18} className="text-amber-400" />
            </div>
            <span className="text-xs uppercase tracking-widest opacity-40">Ramadan 1447</span>
          </div>
          <h1 className="text-3xl font-semibold text-amber-400 mb-1">Ramadan Companion</h1>
          <p className="opacity-40 text-sm leading-relaxed max-w-md">
            Al Qunūt in full, Ramadan duas for every phase, and duas for breaking your fast.
            May Allah accept from us all. 🌙
          </p>
        </div>
      </div>

      {/* ── Al Qunūt ─────────────────────────────────────────────────────── */}
      <div className="rounded-3xl border border-white/8 bg-ramadan-dark-elevated shadow-[0_8px_40px_rgba(0,0,0,0.3)] overflow-hidden">
        <div className="p-6">
          <SectionHeader
            icon={Star}
            title="Al Qunūt"
            subtitle="Full supplication — 11 verses with Arabic, transliteration & translation"
            color="bg-amber-400/10 border-amber-400/25 text-amber-400"
            open={sectionsOpen.qunut}
            onToggle={() => toggle("qunut")}
          />
        </div>

        <AnimatePresence>
          {sectionsOpen.qunut && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 space-y-4 border-t border-white/8 pt-5">
                {/* Audio player */}
                <AudioPlayer />

                {/* Instructions */}
                <p className="text-[10px] opacity-30 text-center">
                  Tap each verse to highlight it while listening
                </p>

                {/* Verses */}
                <div className="space-y-3">
                  {QUNUT.map((verse, idx) => (
                    <QunutCard
                      key={idx}
                      verse={verse}
                      index={idx}
                      active={activeQunut === idx}
                      onClick={() => setActiveQunut(idx)}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Ramadan Duas ─────────────────────────────────────────────────── */}
      <div className="rounded-3xl border border-white/8 bg-ramadan-dark-elevated shadow-[0_8px_40px_rgba(0,0,0,0.3)] overflow-hidden">
        <div className="p-6">
          <SectionHeader
            icon={Moon}
            title="Ramadan Duas"
            subtitle="Duas for every phase — moon sighting, mercy, forgiveness, Laylat al-Qadr"
            color="bg-blue-400/10 border-blue-400/25 text-blue-400"
            open={sectionsOpen.ramadan}
            onToggle={() => toggle("ramadan")}
          />
        </div>

        <AnimatePresence>
          {sectionsOpen.ramadan && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 space-y-3 border-t border-white/8 pt-5">
                {RAMADAN_DUAS.map((item, idx) => (
                  <DuaCard key={idx} item={item} index={idx} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Breaking Fast / Iftar ────────────────────────────────────────── */}
      <div className="rounded-3xl border border-white/8 bg-ramadan-dark-elevated shadow-[0_8px_40px_rgba(0,0,0,0.3)] overflow-hidden">
        <div className="p-6">
          <SectionHeader
            icon={Sunset}
            title="Iftar & Breaking Fast"
            subtitle="Duas for Iftar, Suhoor niyyah, and gratitude after eating"
            color="bg-orange-400/10 border-orange-400/25 text-orange-400"
            open={sectionsOpen.iftar}
            onToggle={() => toggle("iftar")}
          />
        </div>

        <AnimatePresence>
          {sectionsOpen.iftar && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 space-y-3 border-t border-white/8 pt-5">
                {IFTAR_DUAS.map((item, idx) => (
                  <DuaCard key={idx} item={item} index={idx} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom spacer for mobile nav */}
      <div className="h-6" />
    </div>
  );
}