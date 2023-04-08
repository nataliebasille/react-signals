/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Using modern `rgb`
        primary: 'rgb(var(--primary) / <alpha-value>)',
        primaryContrast: 'rgb(var(--primaryContrast) / <alpha-value>)',
        secondary: 'rgb(var(--secondary) / <alpha-value>)',
        secondaryContrast: 'rgb(var(--secondaryContrast) / <alpha-value>)',
        tertiary: 'rgb(var(--tertiary) / <alpha-value>)',
        tertiaryContrast: 'rgb(var(--tertiaryContrast) / <alpha-value>)',
        accent: 'rgb(var(--accent) / <alpha-value>)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
