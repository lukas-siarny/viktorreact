module.exports = {
	input: [
		'src/**/*.{ts,tsx}'
	],
	output: './',
	options: {
		debug: false,
		func: {
			list: ['t'],
			extensions: ['.js', '.jsx', '.ts', '.tsx']
		},
		sort: true,
		trans: false,
		removeUnusedKeys: true,
		lngs: ['sk', 'cs', 'en'],
		ns: [
			'loc'
		],
		defaultLng: 'sk',
		defaultNs: 'loc',
		defaultValue(lng, key) {
			if (lng === 'sk') {
				return key
			}

			return '_NEPRELOZENE_'
		},
		resource: {
			loadPath: './src/locales/{{lng}}/{{ns}}.json',
			savePath: './src/locales/{{lng}}/{{ns}}.json',
			jsonIndent: 2,
			lineEnding: '\n'
		},
		nsSeparator: ':',
		keySeparator: '|'
	}
}