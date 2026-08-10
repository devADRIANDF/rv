/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        page: "#F5F6F5",
        surface: "#FFFFFF",
        line: "#E7E9E8",
        teal: "#0DAFA4",
        tealDark: "#0A8C83",
        tealSoft: "#E3F5F3",
        ink: "#1B1F1E",
        mist: "#767C7A",
        coral: "#E0563F",
      },
      fontFamily: {
        display: ["'Poppins'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
