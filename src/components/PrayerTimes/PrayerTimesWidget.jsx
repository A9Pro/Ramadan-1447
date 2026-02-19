// src/components/PrayerTimes/PrayerTimesWidget.jsx
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, BellOff, MapPin, ChevronDown, X, Settings, Loader, Navigation } from "lucide-react";

const PRAYERS = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];
const PRAYER_EMOJIS = { Fajr: "🌑", Sunrise: "🌅", Dhuhr: "☀️", Asr: "🌤️", Maghrib: "🌇", Isha: "🌙" };
const NOTIFY_PRAYERS = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"]; // Not Sunrise

function to12h(time24) {
  if (!time24) return "--:--";
  const [h, m] = time24.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
}

function getMinutesUntil(time24) {
  if (!time24) return null;
  const now = new Date();
  const [h, m] = time24.split(":").map(Number);
  const target = new Date();
  target.setHours(h, m, 0, 0);
  return Math.round((target - now) / 60000);
}

function getNextPrayer(times) {
  if (!times) return null;
  for (const prayer of NOTIFY_PRAYERS) {
    const mins = getMinutesUntil(times[prayer]);
    if (mins !== null && mins > 0) return { name: prayer, mins, time: times[prayer] };
  }
  return { name: "Fajr", mins: null, time: times?.Fajr };
}

export default function PrayerTimesWidget() {
  const [open, setOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [times, setTimes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [city, setCity] = useState(() => localStorage.getItem("prayerCity") || "");
  const [cityInput, setCityInput] = useState("");
  const [locationMode, setLocationMode] = useState(() => localStorage.getItem("prayerLocationMode") || "gps");
  const [notifEnabled, setNotifEnabled] = useState(() => localStorage.getItem("prayerNotif") === "true");
  const [notifMinutes, setNotifMinutes] = useState(() => parseInt(localStorage.getItem("prayerNotifMins") || "10"));
  const [notifPermission, setNotifPermission] = useState(() => "Notification" in window ? Notification.permission : "denied");
  const [now, setNow] = useState(new Date());
  const timersRef = useRef([]);

  // Tick clock every minute
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(interval);
  }, []);

  // Fetch by GPS
  const fetchByGPS = useCallback(async (lat, lng) => {
    setLoading(true);
    setError(null);
    try {
      const date = new Date();
      const d = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
      const res = await fetch(
        `https://api.aladhan.com/v1/timings/${d}?latitude=${lat}&longitude=${lng}&method=2`
      );
      const data = await res.json();
      if (data.code === 200) {
        const t = data.data.timings;
        setTimes({
          Fajr: t.Fajr,
          Sunrise: t.Sunrise,
          Dhuhr: t.Dhuhr,
          Asr: t.Asr,
          Maghrib: t.Maghrib,
          Isha: t.Isha,
        });
        setCity(data.data.meta.timezone || "Your Location");
        localStorage.setItem("prayerCity", data.data.meta.timezone || "");
      } else {
        setError("Could not load prayer times.");
      }
    } catch {
      setError("Network error. Check connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch by city name
  const fetchByCity = useCallback(async (cityName) => {
    if (!cityName.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const date = new Date();
      const d = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
      const res = await fetch(
        `https://api.aladhan.com/v1/timingsByCity/${d}?city=${encodeURIComponent(cityName)}&country=&method=2`
      );
      const data = await res.json();
      if (data.code === 200) {
        const t = data.data.timings;
        setTimes({
          Fajr: t.Fajr,
          Sunrise: t.Sunrise,
          Dhuhr: t.Dhuhr,
          Asr: t.Asr,
          Maghrib: t.Maghrib,
          Isha: t.Isha,
        });
        setCity(cityName);
        localStorage.setItem("prayerCity", cityName);
        localStorage.setItem("prayerLocationMode", "city");
      } else {
        setError("City not found. Try another name.");
      }
    } catch {
      setError("Network error. Check connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-detect GPS
  const detectGPS = useCallback(() => {
    if (!navigator.geolocation) {
      setError("GPS not supported on this device.");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchByGPS(pos.coords.latitude, pos.coords.longitude),
      () => {
        setError("Location access denied. Enter city manually.");
        setLoading(false);
      }
    );
  }, [fetchByGPS]);

  // On mount — load times
  useEffect(() => {
    if (locationMode === "gps") {
      detectGPS();
    } else if (city) {
      fetchByCity(city);
    }
  }, []);

  // Schedule notifications
  const scheduleNotifications = useCallback(() => {
    // Clear old timers
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    if (!times || !notifEnabled || notifPermission !== "granted") return;

    NOTIFY_PRAYERS.forEach((prayer) => {
      const time = times[prayer];
      if (!time) return;
      const mins = getMinutesUntil(time);
      if (mins === null) return;

      const fireInMs = (mins - notifMinutes) * 60000;
      if (fireInMs <= 0) return;

      const timer = setTimeout(() => {
        new Notification(`🕌 ${prayer} in ${notifMinutes} minutes`, {
          body: `Prayer time: ${to12h(time)}. Take a moment to prepare. 🤲`,
          icon: "/vite.svg",
          badge: "/vite.svg",
          tag: `prayer-${prayer}`,
          requireInteraction: true,
        });
      }, fireInMs);

      timersRef.current.push(timer);
    });
  }, [times, notifEnabled, notifPermission, notifMinutes]);

  useEffect(() => {
    scheduleNotifications();
    return () => timersRef.current.forEach(clearTimeout);
  }, [scheduleNotifications]);

  // Request notification permission
  const requestPermission = async () => {
    if (!("Notification" in window)) return;
    const result = await Notification.requestPermission();
    setNotifPermission(result);
    if (result === "granted") {
      setNotifEnabled(true);
      localStorage.setItem("prayerNotif", "true");
    }
  };

  const toggleNotif = async () => {
    if (notifPermission !== "granted") {
      await requestPermission();
    } else {
      const next = !notifEnabled;
      setNotifEnabled(next);
      localStorage.setItem("prayerNotif", String(next));
    }
  };

  const handleMinutesChange = (mins) => {
    setNotifMinutes(mins);
    localStorage.setItem("prayerNotifMins", String(mins));
  };

  const handleCitySubmit = (e) => {
    e.preventDefault();
    setLocationMode("city");
    localStorage.setItem("prayerLocationMode", "city");
    fetchByCity(cityInput);
    setCityInput("");
    setShowSettings(false);
  };

  const handleGPSDetect = () => {
    setLocationMode("gps");
    localStorage.setItem("prayerLocationMode", "gps");
    detectGPS();
    setShowSettings(false);
  };

  const nextPrayer = getNextPrayer(times);

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className="mb-3 w-72 rounded-3xl border border-white/10 bg-[#041C2C]/95 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-white/8 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-amber-400/60 mb-0.5">Prayer Times</p>
                <div className="flex items-center gap-1.5">
                  <MapPin size={11} className="text-amber-400/50" />
                  <p className="text-xs opacity-40 truncate max-w-[160px]">{city || "No location set"}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-1.5 rounded-xl border border-white/8 opacity-40 hover:opacity-80 transition-opacity"
                >
                  <Settings size={13} />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-xl border border-white/8 opacity-40 hover:opacity-80 transition-opacity"
                >
                  <X size={13} />
                </motion.button>
              </div>
            </div>

            {/* Settings Panel */}
            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden border-b border-white/8"
                >
                  <div className="p-4 space-y-4">
                    {/* Location Options */}
                    <div>
                      <p className="text-xs opacity-40 uppercase tracking-wider mb-2">Location</p>
                      <div className="space-y-2">
                        <motion.button
                          whileTap={{ scale: 0.97 }}
                          onClick={handleGPSDetect}
                          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl border border-amber-400/20 bg-amber-400/8 text-amber-400 text-xs font-medium"
                        >
                          <Navigation size={12} />
                          Use my GPS location
                        </motion.button>
                        <form onSubmit={handleCitySubmit} className="flex gap-2">
                          <input
                            value={cityInput}
                            onChange={(e) => setCityInput(e.target.value)}
                            placeholder="Enter city name..."
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs outline-none focus:border-amber-400/40 placeholder:opacity-30"
                          />
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            className="px-3 py-2 rounded-xl bg-amber-400/20 border border-amber-400/30 text-amber-400 text-xs font-medium"
                          >
                            Set
                          </motion.button>
                        </form>
                      </div>
                    </div>

                    {/* Notification Settings */}
                    <div>
                      <p className="text-xs opacity-40 uppercase tracking-wider mb-2">Notifications</p>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs opacity-60">
                          {notifPermission === "granted"
                            ? notifEnabled ? "Alerts enabled" : "Alerts disabled"
                            : "Permission required"}
                        </span>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={toggleNotif}
                          className={`w-10 h-5 rounded-full border relative transition-all ${
                            notifEnabled && notifPermission === "granted"
                              ? "bg-amber-400/30 border-amber-400/50"
                              : "bg-white/10 border-white/10"
                          }`}
                        >
                          <motion.div
                            animate={{ x: notifEnabled && notifPermission === "granted" ? 20 : 2 }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            className={`absolute top-0.5 w-4 h-4 rounded-full ${
                              notifEnabled && notifPermission === "granted" ? "bg-amber-400" : "bg-white/30"
                            }`}
                          />
                        </motion.button>
                      </div>

                      {/* Minutes selector */}
                      <div>
                        <p className="text-xs opacity-40 mb-2">Notify me before prayer:</p>
                        <div className="flex gap-2">
                          {[5, 10, 15, 20].map((m) => (
                            <motion.button
                              key={m}
                              whileTap={{ scale: 0.93 }}
                              onClick={() => handleMinutesChange(m)}
                              className={`flex-1 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                                notifMinutes === m
                                  ? "border-amber-400/50 bg-amber-400/15 text-amber-400"
                                  : "border-white/10 opacity-40 hover:opacity-70"
                              }`}
                            >
                              {m}m
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Next Prayer Highlight */}
            {nextPrayer && !loading && (
              <div className="px-5 py-3 bg-amber-400/8 border-b border-amber-400/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs opacity-40 mb-0.5">Next prayer</p>
                    <p className="text-sm font-semibold text-amber-400">
                      {PRAYER_EMOJIS[nextPrayer.name]} {nextPrayer.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-amber-400">{to12h(nextPrayer.time)}</p>
                    {nextPrayer.mins !== null && (
                      <p className="text-xs opacity-40">
                        in {nextPrayer.mins < 60
                          ? `${nextPrayer.mins}m`
                          : `${Math.floor(nextPrayer.mins / 60)}h ${nextPrayer.mins % 60}m`}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Prayer Times List */}
            <div className="px-4 py-3 space-y-1">
              {loading ? (
                <div className="flex items-center justify-center py-6 gap-2 opacity-40">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  >
                    <Loader size={16} />
                  </motion.div>
                  <span className="text-xs">Loading prayer times...</span>
                </div>
              ) : error ? (
                <div className="py-4 text-center">
                  <p className="text-xs text-red-400/70 mb-2">{error}</p>
                  <button
                    onClick={() => setShowSettings(true)}
                    className="text-xs text-amber-400/60 underline underline-offset-2"
                  >
                    Set location
                  </button>
                </div>
              ) : times ? (
                PRAYERS.map((prayer) => {
                  const time = times[prayer];
                  const minsUntil = getMinutesUntil(time);
                  const isPast = minsUntil !== null && minsUntil < 0;
                  const isNext = nextPrayer?.name === prayer;
                  const isSunrise = prayer === "Sunrise";

                  return (
                    <div
                      key={prayer}
                      className={`flex items-center justify-between px-3 py-2 rounded-2xl transition-all ${
                        isNext
                          ? "bg-amber-400/10 border border-amber-400/20"
                          : "hover:bg-white/5"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">{PRAYER_EMOJIS[prayer]}</span>
                        <span className={`text-sm font-medium ${isPast ? "opacity-25" : isNext ? "text-amber-400" : "opacity-70"}`}>
                          {prayer}
                        </span>
                        {isSunrise && (
                          <span className="text-xs opacity-30 italic">no adhan</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm tabular-nums ${isPast ? "opacity-25" : isNext ? "text-amber-400 font-semibold" : "opacity-60"}`}>
                          {to12h(time)}
                        </span>
                        {notifEnabled && !isSunrise && !isPast && notifPermission === "granted" && (
                          <Bell size={10} className="text-amber-400/40" />
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-4 text-center">
                  <p className="text-xs opacity-40 mb-2">No location set</p>
                  <button
                    onClick={() => setShowSettings(true)}
                    className="text-xs text-amber-400/60 underline underline-offset-2"
                  >
                    Set location to load times
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            {notifEnabled && notifPermission === "granted" && (
              <div className="px-5 pb-4 pt-1">
                <p className="text-xs opacity-30 text-center">
                  🔔 Notifying {notifMinutes} min before each prayer
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setOpen(!open)}
        className={`relative flex items-center gap-2.5 px-4 py-3 rounded-2xl border shadow-[0_8px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-all ${
          open
            ? "bg-amber-400/20 border-amber-400/40 text-amber-400"
            : "bg-[#041C2C]/90 border-white/10 text-amber-400/80 hover:border-amber-400/30"
        }`}
      >
        {/* Pulse dot when times loaded */}
        {times && !open && (
          <motion.div
            animate={{ scale: [1, 1.4, 1], opacity: [0.8, 0.3, 0.8] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400"
          />
        )}

        {notifEnabled && notifPermission === "granted" ? (
          <Bell size={16} />
        ) : (
          <BellOff size={16} className="opacity-50" />
        )}

        <span className="text-sm font-medium">
          {loading ? "Loading..." : nextPrayer ? `${nextPrayer.name} ${to12h(nextPrayer.time)}` : "Prayer Times"}
        </span>

        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={14} className="opacity-50" />
        </motion.div>
      </motion.button>
    </div>
  );
}