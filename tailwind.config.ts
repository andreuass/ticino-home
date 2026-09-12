import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#fdf6ec",
        terracotta: "#e07b4c",
        brown: {
          DEFAULT: "#3d2c1e",
          light: "#5a4433",
        },
        sage: {
          DEFAULT: "#8b9a7d",
          light: "#a8b599",
        },
      },
      fontFamily: {
        display: ["Cormorant Garamond", "Georgia", "serif"],
        mono: ["DM Mono", "Courier New", "monospace"],
      },
    },
  },
  plugins: [],
} satisfies Config;
