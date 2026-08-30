import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        wowzer: {
          primary: '#0052cc',
          dark: '#003d99',
          darker: '#001f4d',
          light: '#cce1ff',
          lighter: '#e8f0fe',
          text: '#1a1a2e',
          muted: '#555555',
        }
      },
      fontFamily: {
        heading: ['var(--font-montserrat)', 'sans-serif'],
        sans: ['var(--font-open-sans)', 'sans-serif'],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
