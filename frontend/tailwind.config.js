/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        soft: "0 10px 30px rgba(2, 6, 23, 0.08)",
        glow: "0 0 0 1px rgba(79, 70, 229, 0.18), 0 10px 30px rgba(79, 70, 229, 0.12)",
      },
    },
  },
  plugins: [],
}
