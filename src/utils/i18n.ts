import i18n from 'i18next'
import Backend from 'i18next-chained-backend'
import LocalStorageBackend from 'i18next-localstorage-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import XHR from 'i18next-xhr-backend'
import { initReactI18next } from 'react-i18next'

// locales
import 'dayjs/locale/sk'
import 'dayjs/locale/cs'
import 'dayjs/locale/en'
import 'dayjs/locale/hu'
import 'dayjs/locale/ro'
import 'dayjs/locale/bg'

import { NAMESPACE, LANGUAGE, DEFAULT_LANGUAGE } from './enums'

i18n.use(Backend)
	.use(initReactI18next)
	.use(LanguageDetector)
	.init({
		returnNull: false,
		backend: {
			backendOptions: [
				{
					expirationTime: process.env.NODE_ENV === 'development' ? 0 : 0, // 7*24*60*60*1000 // 1 week
					prefix: 'i18next_res_'
				},
				{
					loadPath: '/locales/{{lng}}/{{ns}}.json',
					queryStringParams: { v: process.env.REACT_APP_VERSION }
				}
			],
			backends: [
				LocalStorageBackend, // primary
				XHR // fallback
			]
		},
		debug: process.env.NODE_ENV === 'development',
		detection: {
			// order and from where user language should be detected
			order: ['querystring', 'localStorage', 'path', 'navigator'],
			// keys or params to lookup language from
			lookupFromPathIndex: 0,
			lookupQuerystring: 'lang'
		},
		defaultNS: 'keep-empty',
		fallbackLng: DEFAULT_LANGUAGE,
		interpolation: {
			escapeValue: false
		},
		load: 'languageOnly',
		supportedLngs: Object.values(LANGUAGE),
		ns: Object.values(NAMESPACE),
		nsSeparator: ':',
		keySeparator: '|',
		react: {
			bindI18n: 'languageChanged loaded',
			bindI18nStore: 'added removed',
			nsMode: 'default',
			useSuspense: true
		}
	})

// export const ACCEPT_LANGUAGE_HEADER = () => currentLocale.ISO_639

export default i18n
