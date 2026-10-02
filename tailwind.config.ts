import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#14171F",
        canvas: "#F6F5F1",
        muted: "#6B7280",
        teal: {
          DEFAULT: "#16A97B",
          deep: "#0E8964",
          tint: "#E4F5EE",
        },
        cobalt: {
          DEFAULT: "#2E5FE8",
          deep: "#1E44B8",
          tint: "#E8EDFC",
        },
        sand: "#EDEAE2",
      },
      fontFamily: {
        display: ["var(--font-baloo)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      maxWidth: {
        content: "1180px",
      },
      keyframes: {
        "rise-in": {
          "0%": { opacity: "0", transform: "translateY(22px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "rise-in": "rise-in 1.1s cubic-bezier(.16,1,.3,1) both",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(.16,1,.3,1)",
      },
    },
  },
  plugins: [],
};
export default config;
