/** @type {import('tailwindcss').Config} */
module.exports = { // <-- Sửa "export default" thành "module.exports ="
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Thêm các dòng này để định nghĩa animation
      animation: {
        textShine: 'textShine 3s linear infinite',
      },
      keyframes: {
        textShine: {
          'to': {
            backgroundPosition: '200% center',
          },
        },
      },
    },
  },
  plugins: [],
}