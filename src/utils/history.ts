// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { createBrowserHistory } from 'history'
import { ROUTE_PREFIX } from './enums'

// eslint-disable-next-line import/prefer-default-export
export const history = createBrowserHistory()

// add route prefix to path
export const getPath = (i18nPath: string) => {
	const path = `${ROUTE_PREFIX}${i18nPath}`
	return path
}
