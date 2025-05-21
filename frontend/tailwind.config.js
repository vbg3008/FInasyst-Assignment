/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#3498db",
          dark: "#2980b9",
        },
        secondary: {
          DEFAULT: "#2ecc71",
          dark: "#27ae60",
        },
        danger: {
          DEFAULT: "#e74c3c",
          dark: "#c0392b",
        },
        warning: {
          DEFAULT: "#f39c12",
          dark: "#d35400",
        },
      },
    },
  },
  // Tailwind CSS v4 specific options
  future: {
    // Enable all future features
    hoverOnlyWhenSupported: true,
  },
  // Tailwind CSS v4 specific plugins
  plugins: [],
};
