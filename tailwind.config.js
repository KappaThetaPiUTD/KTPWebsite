/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#008234",
        secondary: "#72E2AE",
        gray: "#9B9B9B",
      },
      fontFamily: {
        poppins: ["Poppins"],
        georgia: ["Georgia"],
        greek: ["Greek"],
      },
    },
  },
  plugins: [],
};
