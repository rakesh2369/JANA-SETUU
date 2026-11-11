import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#F0F4F8",
          100: "#D9E2EC",
          200: "#BCCCDC",
          300: "#9FB3C8",
          400: "#627D98",
          500: "#486581",
          600: "#334E68",
          700: "#243B53",
          800: "#1B365D",
          900: "#0F2537",
          950: "#091724",
        },
        teal: {
          50: "#F0FDFA",
          100: "#CCFBF1",
          200: "#99F6E4",
          300: "#5EEAD4",
          400: "#2DD4BF",
          500: "#14B8A6",
          600: "#0D9488",
          700: "#0F766E",
          800: "#115E59",
          900: "#134E4A",
          950: "#042F2E",
        },
        saffron: {
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
          700: "#B45309",
          800: "#92400E",
          900: "#78350F",
        },
        ivory: {
          50: "#FCFBF7",
          100: "#FAF9F5",
          200: "#F4F1EA",
          300: "#EAE5DB",
          400: "#DFD8CB",
          500: "#D1C7B7",
        },
      },
      fontFamily: {
        sans: ["Aptos", "Segoe UI Variable Text", "Segoe UI", "sans-serif"],
        display: ["Aptos Display", "Segoe UI Variable Display", "Trebuchet MS", "sans-serif"],
        telugu: ["Noto Sans Telugu", "Gautami", "Vani", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
