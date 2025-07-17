/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    container: { 
      center: true, 
      padding: "1rem" 
    },
    extend: {
      colors: {
        primary: {
          50:  "#e0f7ff",
          100: "#b0ecff",
          200: "#80e0ff",
          300: "#4dd3ff",
          400: "#1ac6ff",
          500: "#00aff0",
          600: "#008acd",
          700: "#0066a1",
          800: "#004275",
          900: "#00284f"
        },
        "dark-bg": "#000000",
        "card-bg": "#0a0a0a"
      },
      fontFamily: { 
        sans: ["Inter", "ui-sans-serif", "system-ui"] 
      },
      borderRadius: { 
        md: "0.5rem" 
      },
      boxShadow: {
        card: "0 2px 6px 0 rgba(0,0,0,0.25)",
        btn:  "0 1px 3px 0 rgba(0,0,0,0.35)"
      }
    }
  },
  plugins: [require("@tailwindcss/forms")],
}

