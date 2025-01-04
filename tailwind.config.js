/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
        fontFamily: {
            "mono": ["Archivo", "serif"]
        }
    },
},
plugins: [
  require('tailwindcss-animated')
],
}
