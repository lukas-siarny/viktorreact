import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

import { APP_LANGUAGE, DEFAULT_APP_LANGUAGE } from './enums'

i18n.use(initReactI18next)
	.use(LanguageDetector)
	.init({
		resources: {
			bg: { loc: require('../locales/bg/loc.json') },
			cs: { loc: require('../locales/cs/loc.json') },
			en: { loc: require('../locales/en/loc.json') },
			hu: { loc: require('../locales/hu/loc.json') },
			it: { loc: require('../locales/it/loc.json') },
			ro: { loc: require('../locales/ro/loc.json') },
			sk: { loc: require('../locales/sk/loc.json') }
		},
		debug: process.env.NODE_ENV === 'development',
		detection: {
			order: ['querystring', 'localStorage', 'path', 'navigator'],
			lookupFromPathIndex: 0,
			lookupQuerystring: 'lang'
		},
		defaultNS: 'loc',
		fallbackLng: DEFAULT_APP_LANGUAGE,
		interpolation: {
			escapeValue: false
		},
		load: 'languageOnly',
		supportedLngs: Object.values(APP_LANGUAGE),
		ns: ['loc'],
		nsSeparator: ':',
		keySeparator: '|',
		react: {
			bindI18n: 'languageChanged loaded',
			bindI18nStore: 'added removed',
			nsMode: 'default',
			useSuspense: true
		}
	})

export default i18n
