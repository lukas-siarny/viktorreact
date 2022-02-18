import decode from 'jwt-decode'

export const ACCESS_TOKEN_KEY = 'access_token'
export const COMPANY_BRANCH_ID = 'company_branch_id'

export const clearCompanyBranchID = () => sessionStorage.removeItem(COMPANY_BRANCH_ID)
export const getCompanyBranchID = () => sessionStorage.getItem(COMPANY_BRANCH_ID)
export const setCompanyBranchID = (companyBranchID: number | string) => sessionStorage.setItem(COMPANY_BRANCH_ID, `${companyBranchID}`)

export const clearAccessToken = () => localStorage.removeItem(ACCESS_TOKEN_KEY)
export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY)
export const setAccessToken = (token: string) => localStorage.setItem(ACCESS_TOKEN_KEY, token)

export const isLoggedIn = () => {
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
