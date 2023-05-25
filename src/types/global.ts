export {}

declare global {
	interface Window {
		__RUNTIME_CONFIG__: {
			REACT_APP_GOOGLE_MAPS_API_KEY: string
			FULLCALENDAR_LICENSE_KEY: string
			REACT_APP_SENTRY_ENV: string
			REACT_APP_SENTRY_DSN: string
			REACT_APP_GOOGLE_OAUTH_CLIENT_ID: string
			REACT_APP_MS_OAUTH_CLIENT_ID: string
		}
	}
}
