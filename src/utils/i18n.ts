import i18n from 'i18next'
import Backend from 'i18next-chained-backend'
import LocalStorageBackend from 'i18next-localstorage-backend'
import XHR from 'i18next-xhr-backend'
import { initReactI18next } from 'react-i18next'

i18n.use(Backend)
	.use(initReactI18next)
	.init({
		returnNull: false,
		backend: {
			backendOptions: [
				{
					expirationTime: 0, // 7*24*60*60*1000 // 1 week
					prefix: 'i18next_res_'
				},
				{
					loadPath: '/locales/{{lng}}/{{ns}}.json'
				}
			],
			backends: [
				LocalStorageBackend, // primary
				XHR // fallback
			]
		},
		detection: {
			// order and from where user language should be detected
			order: ['querystring', 'path', 'localStorage'],
			lookupFromPathIndex: 0,
			lookupQuerystring: 'lng'
		},
		defaultNS: 'keep-empty',
		fallbackLng: 'sk',
		interpolation: {
			escapeValue: false
		},
		load: 'languageOnly',
		supportedLngs: ['sk', 'en'],
		ns: ['loc'],
		nsSeparator: ':',
		keySeparator: '|',
		react: {
			bindI18n: 'languageChanged loaded',
			bindI18nStore: 'added removed',
			nsMode: 'default'
		}
	})

export default i18n
