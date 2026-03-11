/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        customBlue: '#08B3E2',
        customGreen: '#1F544B',
        indigo: {
          50: '#e0f7fc',
          100: '#b3eef9',
          200: '#80e5f6',
          300: '#4ddcf3',
          400: '#33d5ef',
          500: '#1acde8',
          600: '#08b3e2',
          700: '#07a5cc',
          800: '#0689b3',
          900: '#047a9e',
        },
      },
      boxShadow: {
        'custom-blue': '0 4px 70px rgba(8, 179, 226, 0.3)',
      },
    },
  },
  plugins: [],
};
