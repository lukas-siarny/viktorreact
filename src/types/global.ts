export {}

declare global {
	interface Window {
		__RUNTIME_CONFIG__: {
			GOOGLE_MAPS_API_KEY: string
		}
	}
}
