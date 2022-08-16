const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        text: {
          primary: colors.slate['800'],
          secondary: colors.slate['600'],
          'on-primary': colors.slate['100'],
          error: colors.red['500'],
        },
        brand: {
          primary: colors.slate['900'],
        },
        background: colors.white,
      },
    },
  },
  plugins: [],
}
