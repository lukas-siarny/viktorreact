import { isArray } from 'lodash'

interface IQueryParams {
	[key: string]: any
}

const serializeParams = (values?: IQueryParams) =>
	Object.entries(values || {}).reduce((acc, [key, value]) => {
		if (value === undefined) {
			// odstrani query parameter zo searchParams
			return { ...acc }
		}
		if (value === null || (isArray(value) && !value.length)) {
			// nastavi mu prazdnu hodnotu
			return {
				...acc,
				[key]: ''
			}
		}
		return {
			...acc,
			key: value
		}
	}, {} as IQueryParams)

const useQueryParams = (queryParams?: IQueryParams) => {
	const serializedParams = serializeParams(queryParams)
	const [, setSearchParams] = useSearchParams(serializedParams)

	const setQueryParams = (newValues?: IQueryParams) => {
		setSearchParams(serializeParams(newValues))
	}

	return [queryParams, setQueryParams]
}

export default useQueryParams
