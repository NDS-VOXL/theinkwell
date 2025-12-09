// tailwind.config.ts
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
        // Main Background (Light Gray)
        surface: '#F5F5F5', 
        
        // Brand Color (Dark Teal)
        'inkwell-teal': '#00897B', 
        
        // Sidebar Background (Pure White as requested)
        'sidebar-bg': '#FFFFFF',
        
        // Text Colors
        'gray-text': '#8E8E8E',
      },
      borderRadius: {
        'sidebar': '60px', // Custom radius for the top-right corner
      }
    },
  },
  plugins: [],
};
export default config;