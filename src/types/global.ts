export {}

declare global {
	interface Window {
		__RUNTIME_CONFIG__: {
			REACT_APP_GOOGLE_MAPS_API_KEY: string,
			FULLCALENDAR_LICENSE_KEY: string
		}
	}
}
