/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        "strong-lg":
          "0 10px 15px -3px rgba(0, 0, 0, 0.18), 0 5px 6px -2px rgba(0, 0, 0, 0.13)",
      },
    },
  },
  plugins: [require("daisyui")],
};
