// eslint-disable-next-line import/prefer-default-export
export const mock = (success: any, timeout: number, data: any = '') => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			if (success) {
				resolve(data)
			} else {
				// eslint-disable-next-line prefer-promise-reject-errors
				reject({ message: 'Error' })
			}
		}, timeout)
	})
}
