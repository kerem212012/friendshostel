const {heroui} = require("@heroui/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
        // "./app/**/*.{js,ts,jsx,tsx}",
        // "./page/**/*.{js,ts,jsx,tsx}",
        // "./common/**/*.{js,ts,jsx,tsx}",
    ],
    plugins: [heroui()]
};