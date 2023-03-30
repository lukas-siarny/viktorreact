import { NavigateFunction, To, NavigateOptions } from 'react-router-dom'

class Navigator {
	private static navigation: NavigateFunction

	public static init(navigationFn: NavigateFunction) {
		if (!Navigator.navigation) {
			Navigator.navigation = navigationFn
		} else {
			// eslint-disable-next-line no-console
			console.warn('Navigator is already initialized')
		}
	}

	public static navigate(to: To, options?: NavigateOptions) {
		if (Navigator.navigation) {
			Navigator.navigation(to, options)
		} else {
			// eslint-disable-next-line no-console
			console.warn('Navigator is not yer initialized')
		}
	}
}

export default Navigator
