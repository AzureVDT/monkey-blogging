/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                grayf1: "#F1F1F3",
                primary: "#1DC071",
                secondary: "#A4D96C",
            },
        },
    },
    plugins: [],
};
