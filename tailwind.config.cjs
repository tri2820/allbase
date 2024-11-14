/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        neutral: {
          970: '#050505', // A bit lighter than #0a0a0a
        },
      },
    }
  },
  plugins: [
    // default prefix is "ui"
		require("@kobalte/tailwindcss"),
    require('@tailwindcss/typography')
  ]
};
