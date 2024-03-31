/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        ".no-scrollbar::-webkit-scrollbar": {
          display: "none",
          width: "0"
        },
        ".scrollbar::-webkit-scrollbar": {
          width: "5px",
        },
        ".scrollbar::-webkit-scrollbar-track": {
          // background: "orange",
        },
        ".scrollbar::-webkit-scrollbar-thumb": {
          "background-color": "gray",
          // "border-radius": "20px",     
          // "border": "3px solid orange"
        },
        ".no-scrollbar": {
          "-ms-overflow-style": "none" /* IE and Edge */,
          "scrollbar-width": "none" /* Firefox */,
        },
      };
      
      addUtilities(newUtilities);
    },
  ],
};
