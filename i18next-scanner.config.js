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
		lngs: ['sk', 'en'],
		ns: [
			'paths',
			'loc'
		],
		defaultLng: 'sk',
		defaultNs: 'keep-empty',
		defaultValue(lng, ns, key) {
			if (lng === 'sk') {
				if (ns === 'paths') {
					return `/${key}`
				}
				return key
			}
			return '_NEPRELOZENE_'
		},
		resource: {
			loadPath: 'public/locales/{{lng}}/{{ns}}.json',
			savePath: 'public/locales/{{lng}}/{{ns}}.json',
			jsonIndent: 2,
			lineEnding: '\n'
		},
		nsSeparator: ':',
		keySeparator: '.'
	}
}
