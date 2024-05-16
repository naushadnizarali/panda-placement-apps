const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,component,app}/**/*!(*.stories|*.spec).{js,jsx,ts,tsx,html}'
    ),
    './src/**/*.{js,jsx,ts,tsx}',
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      screens: {
        'xs': { 'min': '200px', 'max': '640px' },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
