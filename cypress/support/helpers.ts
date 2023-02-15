export const generateRandomString = (length: number) =>
	Math.random()
		.toString(36)
		.replace(/[^a-z]+/g, '')
		.substr(0, length)

export const generateRandomInt = (digits: number) => Math.floor(10 ** (digits - 1) + Math.random() * 9 * 10 ** (digits - 1))

/* export const getCategoryById = (category: any, serviceCategoryID: string) => {
	let result = null
	if (category?.category?.id === serviceCategoryID) {
		return category
	}
	if (category?.category?.children) {
		// eslint-disable-next-line no-return-assign
		category.category.children.some((node: any) => (result = getCategoryById(node, serviceCategoryID)))
	}
	return result
} */
