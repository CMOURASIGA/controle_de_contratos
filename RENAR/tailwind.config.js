import tailwindcssAnimate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{js,ts,tsx,mdx}",
    "./src/components/**/*.{js,ts,tsx,mdx}",
  ],
  theme: {
    extend: {
      brand: {
        "gray-10": "#F5F5F5",
        "gray-20": "#E3E3E3",
        "gray-100": "#004c99",
        "gray-400": "#0130A4",
        "gray-500": "#032884",
        "gray-600": "#666666",
        "blue-50": "#F7FAFF",
        "blue-60": "#e5edff",
        "blue-500": "#004c99",
        "blue-600": "#1f2c4d",
        "green-100": "#25CF60",
        "green-200": "#1BB952",
        "green-300": "#0F9E41",
        "gold-100": "#AD841F",
        "gold-400": "#977115",
        "gold-500": "#79590D",
        "gold-600": "#4E3906",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
    },
    fontFamily: {
      sans: ["Montserrat", "sans-serif"],
    },
    plugins: [tailwindcssAnimate],
  },
};
