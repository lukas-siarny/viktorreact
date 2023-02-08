module.exports = {
	extends: ['@goodrequest/eslint-config-typescript-react'],
	plugins: ['chai-friendly'],
	parserOptions: {
		project: 'tsconfig.eslint.json',
		tsconfigRootDir: __dirname,
		sourceType: 'module'
	},
	rules: {
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-empty-interface': 'off',
		'react/jsx-no-useless-fragment': 'off',
		'@typescript-eslint/no-unused-vars': 'warn',
		'no-underscore-dangle': 'warn'
	}
}
