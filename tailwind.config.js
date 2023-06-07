module.exports = {
	content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}',
	'node_modules/flowbite-vue/**/*.{js,jsx,ts,tsx}',
    'node_modules/flowbite/**/*.{js,jsx,ts,tsx}',
	"./node_modules/tw-elements/dist/js/**/*.js"],
	darkMode: 'class', // or 'media' or 'class'
	theme: {
		extend: {},
	},
	variants: {
		extend: {},
	},
	plugins: [
		require('@tailwindcss/forms'),
		require('@tailwindcss/aspect-ratio'),
		require('@tailwindcss/typography'),
		require('flowbite/plugin'),
		require("tw-elements/dist/plugin.cjs")
	],
};
