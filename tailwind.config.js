/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  // Dark mode driven by either the OS preference or an explicit data-theme.
  // Classes like dark:foo activate when `<html class="dark">` is set; we use
  // CSS variables underneath, so most existing utilities also auto-flip.
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // All palette names are backed by CSS variables defined in
        // src/styles/index.css. Variables carry semantic intent, so the
        // same class (e.g. bg-cream-50) is the "page background" in
        // both light and dark themes.
        cream: {
          50: "rgb(var(--color-cream-50) / <alpha-value>)",
          100: "rgb(var(--color-cream-100) / <alpha-value>)",
          200: "rgb(var(--color-cream-200) / <alpha-value>)",
        },
        sand: {
          100: "rgb(var(--color-sand-100) / <alpha-value>)",
          200: "rgb(var(--color-sand-200) / <alpha-value>)",
          300: "rgb(var(--color-sand-300) / <alpha-value>)",
        },
        clay: {
          400: "rgb(var(--color-clay-400) / <alpha-value>)",
          500: "rgb(var(--color-clay-500) / <alpha-value>)",
          600: "rgb(var(--color-clay-600) / <alpha-value>)",
          700: "rgb(var(--color-clay-700) / <alpha-value>)",
        },
        sage: {
          200: "rgb(var(--color-sage-200) / <alpha-value>)",
          400: "rgb(var(--color-sage-400) / <alpha-value>)",
          600: "rgb(var(--color-sage-600) / <alpha-value>)",
        },
        ink: {
          700: "rgb(var(--color-ink-700) / <alpha-value>)",
          800: "rgb(var(--color-ink-800) / <alpha-value>)",
          900: "rgb(var(--color-ink-900) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "'SF Pro Text'",
          "'SF Pro Display'",
          "'Segoe UI Variable Display'",
          "'Segoe UI'",
          "Roboto",
          "Nunito",
          "ui-sans-serif",
          "system-ui",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        arabic: ["'Amiri Quran'", "'Scheherazade New'", "'Noto Naskh Arabic'", "serif"],
      },
      borderRadius: {
        soft: "1rem",
        ios: "1.25rem",
      },
      boxShadow: {
        soft: "0 4px 16px -8px rgba(140, 95, 60, 0.18)",
        ios: "0 1px 2px rgba(60, 40, 25, 0.06), 0 8px 24px -12px rgba(60, 40, 25, 0.18)",
      },
      letterSpacing: {
        ios: "-0.01em",
      },
    },
  },
  plugins: [],
};
