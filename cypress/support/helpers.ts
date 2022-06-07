export const generateRandomString = (length: number) =>
	Math.random()
		.toString(36)
		.replace(/[^a-z]+/g, '')
		.substr(0, length)

export const generateRandomInt = (digits: number) => Math.floor(10 ** (digits - 1) + Math.random() * 9 * 10 ** (digits - 1))
