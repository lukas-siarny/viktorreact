import { isArray } from 'lodash'
import { useCallback, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

interface IQueryParams {
	[key: string]: any
}

interface IQueryParamsInitial {
	[key: string]: ParamType
}

enum PARAM_TYPE {
	ARRAY = 'ARRAY',
	STRING = 'STRING'
}

type ParamType<ValueType = any> = {
	paramType: PARAM_TYPE
	value?: ValueType | null
}

const serializeInitialParams = (initialValues?: IQueryParamsInitial) =>
	Object.entries(initialValues || {}).reduce((acc, [key, value]) => {
		if (value.value === undefined) {
			// odstrani query parameter zo searchParams
			return { ...acc }
		}
		if (value.value === null || (isArray(value.value) && !value.value.length)) {
			// nastavi mu prazdnu hodnotu, eg. &foo=, resp. &foo
			return {
				...acc,
				[key]: {
					paramType: value.paramType,
					value: ''
				}
			}
		}
		return {
			...acc,
			[key]: value
		}
	}, {} as IQueryParams)

const getInitialParams = (initialValues?: IQueryParamsInitial, URLSearchParams?: URLSearchParams) =>
	Object.entries(initialValues || {}).reduce((acc, [key, value]) => {
		switch (value.paramType) {
			case PARAM_TYPE.ARRAY: {
				const paramTyme = {
					paramType: value.paramType,
					value: value.value
				}
				const hasURLParam = URLSearchParams?.has(key)
				const URLValue = URLSearchParams?.getAll(key)
				// ak sa pri inite v URL nenachadza hodnota, initneme default
				if (!hasURLParam) {
					return { ...acc, [key]: { ...paramTyme, value: value.value } }
				}
				/**
				 * v pripade, ze volame metodu getAll(), tak to vzdy vrati pole
				 * ak je v URLcke query parameter foo=, tak URLValue = ['']
				 * ak je hodnota prazdny string, initnme ako null
				 */
				if (URLValue && URLValue[0] === '') {
					return { ...acc, [key]: { ...paramTyme, value: null } }
				}
				// inak initneme co sa nachadza v URL
				return { ...acc, [key]: { ...paramTyme, value: URLValue } }
			}
			case PARAM_TYPE.STRING:
			default: {
				const paramTyme = {
					paramType: value.paramType,
					value: value.value
				}
				const hasURLParam = URLSearchParams?.has(key)
				const URLValue = URLSearchParams?.get(key)
				// ak sa pri inite v URL nenachadza hodnota, initneme default
				if (!hasURLParam) {
					return { ...acc, [key]: { ...paramTyme, value: value.value } }
				}
				// ak je hodnota prazdny string, initnme ako null
				if (URLValue === '') {
					return { ...acc, [key]: { ...paramTyme, value: null } }
				}
				// inak initneme co sa nachadza v URL
				return { ...acc, [key]: { ...paramTyme, value: URLValue } }
			}
		}
	}, {} as IQueryParamsInitial)

const mapInitialValuesToQueryReturnValues = (initialValues?: IQueryParamsInitial): IQueryParams => {
	return Object.entries(initialValues || {}).reduce((acc, [key, value]) => {
		return {
			...acc,
			[key]: value.value
		}
	}, {} as IQueryParams)
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
			[key]: value
		}
	}, {} as IQueryParams)

export const ArrayParam = (param?: string[] | null): ParamType => {
	return {
		paramType: PARAM_TYPE.ARRAY,
		value: param
	}
}

export const StringParam = (param?: string | null): ParamType => {
	return {
		paramType: PARAM_TYPE.STRING,
		value: param
	}
}

const useQueryParams = (queryParamsInitial?: IQueryParamsInitial): [IQueryParams, (newValues: IQueryParams) => void] => {
	// prekonvertujeme initial objekt (ktory obsahuje informacie o type query parametru - Array x String) do jednoduchsie objektu key:value vhodneho pre useSearchParams hook
	const intialValuesForSearchParams = mapInitialValuesToQueryReturnValues(serializeInitialParams(queryParamsInitial))
	const [searchParams, setSearchParams] = useSearchParams(intialValuesForSearchParams)

	// tieto hodnoty uz obsahuju aj zohladene query parametre z URLcky
	const storedInitialValues = useRef(getInitialParams(queryParamsInitial, searchParams))

	// do query nastavime zjednoduseny objekt bez typov, aby sa potom pri volani setQueryParams v komponente nemusli vsade posielat informacie o type, ale len jednoduchy key:value objekt
	const [query, setQuery] = useState<IQueryParams | undefined>(mapInitialValuesToQueryReturnValues(storedInitialValues.current))

	const setQueryParams = useCallback(
		(newValues?: IQueryParams) => {
			setSearchParams(serializeParams(newValues))
			setQuery(newValues)
		},
		[setSearchParams]
	)

	return [query || {}, setQueryParams]
}

export default useQueryParams
