import decode from 'jwt-decode'

export const ACCESS_TOKEN_KEY = 'access_token'
export const REFRESH_TOKEN_KEY = 'refresh_token'

export const clearAccessToken = () => localStorage.removeItem(ACCESS_TOKEN_KEY)
export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY)
export const setAccessToken = (token: string) => localStorage.setItem(ACCESS_TOKEN_KEY, token)

export const clearRefreshToken = () => localStorage.removeItem(REFRESH_TOKEN_KEY)
export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY)
export const setRefreshToken = (token: string) => localStorage.setItem(REFRESH_TOKEN_KEY, token)

export const isLoggedIn = (): boolean => {
	try {
		const token = getAccessToken()
		if (!token) {
			return false
		}
		decode(token)

		return true
	} catch (error) {
		return false
	}
}

export const hasRefreshToken = (): boolean => {
	try {
		const token = getRefreshToken()
		if (!token) {
			return false
		}
		decode(token)

		return true
	} catch (error) {
		return false
	}
}
