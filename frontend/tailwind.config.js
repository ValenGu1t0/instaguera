/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}", 
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}", 
  ],
  theme: {
    extend: {
      fontFamily: {
        /* sans: ["var(--font-roboto)", "sans-serif"], */
        montserrat: ["var(--font-montserrat)"],
        tattoo: ["var(--font-great-vibes)"],
      },
    },
  },
  plugins: [],
};