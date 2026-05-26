/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Soft, warm, kid-friendly palette. No neon, no harsh contrasts.
        cream: {
          50: "#FFFBF3",
          100: "#FDF4E3",
          200: "#F8E7C6",
        },
        sand: {
          100: "#F2E4CB",
          200: "#E6CFA5",
          300: "#D4B585",
        },
        clay: {
          400: "#C99A6B",
          500: "#B07C4F",
          600: "#8C5F3C",
        },
        sage: {
          200: "#D7E4D1",
          400: "#9CB69A",
          600: "#5F7E62",
        },
        ink: {
          700: "#3D2F25",
          800: "#2A2018",
        },
      },
      fontFamily: {
        sans: [
          "Nunito",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        arabic: ["'Amiri Quran'", "'Scheherazade New'", "serif"],
      },
      borderRadius: {
        soft: "1rem",
      },
      boxShadow: {
        soft: "0 4px 16px -8px rgba(140, 95, 60, 0.18)",
      },
    },
  },
  plugins: [],
};
