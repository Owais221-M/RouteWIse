/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,jsx,mdx}",
    "./components/**/*.{js,jsx,mdx}",
    "./pages/**/*.{js,jsx,mdx}"
  ],
  theme: {
    extend: {}
  },
  plugins: []
};

export default config;
