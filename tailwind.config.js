/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: "#080B18",
        primary: "#8B5CF6",
        secondary: "#22D3EE",
        tertiary: "#34D399",
        background: "#080B18",
        card: "#11182B",
        "card-hover": "#17213A",
        border: "#25304A",
      },

      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },

      boxShadow: {
        glow: "0 0 25px rgba(139, 92, 246, 0.25)",
        "glow-cyan": "0 0 25px rgba(34, 211, 238, 0.20)",
      },

      backgroundImage: {
        "hero-gradient":
          "radial-gradient(ellipse at top, rgba(124, 58, 237, 0.18), transparent 60%)",
        "brand-gradient":
          "linear-gradient(to right, #8B5CF6, #22D3EE, #34D399)",
      },
    },
  },
  plugins: [],
};