/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Ensure this covers all your files
  ],
  theme: {
    extend: {},
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".scrollbar-hide": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
        },
        ".scrollbar-hide::-webkit-scrollbar": {
          display: "none",
        },
      });
    },
  ],
};
