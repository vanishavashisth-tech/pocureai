/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        surface: "var(--surface)",
        ink: "var(--ink)",
        muted: "var(--muted)",
        action: "var(--action)",
        navy: "var(--navy)",
        verified: "var(--verified)",
        conflict: "var(--conflict)",
        review: "var(--review)",
        line: "var(--line)",
        warning: "var(--warning)",
        header: "#091c3f", // Deep Government Navy
        "nic-maroon": "#800000",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      boxShadow: {
        soft: "0 2px 8px rgba(9, 28, 63, 0.05)",
      },
      borderRadius: {
        md: "0.25rem", // Sharper borders for govt look
        lg: "0.375rem",
      }
    },
  },
  plugins: [],
};
