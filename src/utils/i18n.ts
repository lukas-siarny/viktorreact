import i18n from 'i18next'
import Backend from 'i18next-chained-backend'
import LocalStorageBackend from 'i18next-localstorage-backend'
import XHR from 'i18next-xhr-backend'
import { initReactI18next } from 'react-i18next'

import { NAMESPACE } from './enums'

i18n.use(Backend)
	.use(initReactI18next)
	.init({
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
		defaultNS: 'keep-empty',
		fallbackLng: 'sk',
		interpolation: {
			escapeValue: false
		},
		lng: 'sk',
		load: 'languageOnly',
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

export default i18n
