/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        amazon: {
          navy: '#131921',
          blue: '#232f3e',
          accent: '#febd69',
          yellow: '#ffd814',
          buy: '#ffa41c',
          page: '#eaeded'
        }
      }
    }
  },
  plugins: []
};
