/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ramadan: {
          dark: {
            base: "#071a26",
            elevated: "#0f2a3a",
            surface: "#163447",
            surfaceSoft: "#1f4a63",
            accent: "#d4a373",
            accentSoft: "#e6c9a8",
            text: "#f8fafc",
            textMuted: "#9fb7c3",
          },
          light: {
            base: "#f7f1e6",
            elevated: "#fdfaf4",
            surface: "#ffffff",
            surfaceSoft: "#f2e9dc",
            accent: "#6b8e23",
            accentSoft: "#8aa65a",
            text: "#1f2937",
            textMuted: "#5f6f5f",
          },
        },
      },

      borderRadius: {
        "3xl": "1.5rem",
        "4xl": "2rem",
      },

      boxShadow: {
        subtle: "0 4px 12px rgba(0,0,0,0.05)",
        medium: "0 10px 25px rgba(0,0,0,0.08)",
        deep: "0 20px 40px rgba(0,0,0,0.12)",
      },

      fontFamily: {
        arabic: ["Amiri", "serif"],
        heading: ["Plus Jakarta Sans", "sans-serif"],
      },

      animation: {
        "gentle-pulse": "gentlePulse 2s ease-in-out infinite",
      },

      keyframes: {
        gentlePulse: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.85 },
        },
      },
    },
  },
  plugins: [],
};
