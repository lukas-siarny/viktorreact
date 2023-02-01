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

	// public static navigate(delta: number) {
	// 	Navigator.navigation(delta)
	// }

	public static navigate(to: To, options?: NavigateOptions) {
		Navigator.navigation(to, options)
	}
}

export default Navigator
