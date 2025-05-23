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
        primary: "#00542C",
        gray: "#9B9B9B",
        white: "#fffff", //white
        black: "#000000", //black
        accent: "#1B2128" //accent black

      },
      fontFamily: {
        poppins: ["Public Sans"],
        georgia: ["Georgia"],
        greek: ["Greek"],
      },
      fontSize: {
        header1: "56px",
        header2: "40px",
        header3: "28px",
        header4: "20px",
        paragraph: "14px",
        small: "12px",
      },
    },
  },
  plugins: [],
};
