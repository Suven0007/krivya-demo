import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#25191e",
        plum: "#5f183c",
        rose: "#c23766",
        blush: "#f7dbe3",
        petal: "#fff5f6",
        mist: "#eef7f4",
        sage: "#6e8d7d",
        ribbon: "#f6bf56",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Arial", "sans-serif"],
        serif: ["var(--font-playfair)", "Georgia", "serif"],
      },
      boxShadow: {
        soft: "0 18px 60px rgba(95, 24, 60, 0.13)",
      },
    },
  },
  plugins: [],
};

export default config;
