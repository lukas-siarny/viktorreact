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
		fallbackNS: 'loc',
		removeUnusedKeys: true,
		lngs: ['sk', 'en'],
		fallbackLng: 'sk',
		ns: ['loc'],
		defaultLng: 'sk',
		defaultNs: 'keep-empty',
		defaultValue(lng, ns, key) {
			if (ns === 'paths') {
				return `/${key}`
			}

			if (lng === 'sk') {
				return key
			}
			// NOTE: pre dalsie jazyky nastvi null a potom pouzije fallback EN ak je _NEPRELOZENE_
			return null
		},
		resource: {
			loadPath: 'public/locales/{{lng}}/{{ns}}.json',
			savePath: 'public/locales/{{lng}}/{{ns}}.json',
			jsonIndent: 2,
			lineEnding: '\n'
		},
		nsSeparator: ':',
		keySeparator: '|'
	}
}
