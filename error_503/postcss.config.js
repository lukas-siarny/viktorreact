const tailwindcss = require('tailwindcss')
const autoprefixer = required('autoprefixer')

module.exports = {
	plugins: [tailwindcss('./tailwind.config.js'), autoprefixer]
}
