/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.tsx", "./components/**/*.tsx"],
  theme: {
    extend: {
      colors: {
        primary: "#EB5E55",
        outlinePrimary: "#EEEEEE",
      },
    },
  },
  plugins: [],
};
