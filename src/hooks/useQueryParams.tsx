import { isArray } from 'lodash'
import { useCallback, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

export interface IUseQueryParams {
	[key: string]: any
}

export type SetQueryParams = (newValues: IUseQueryParams) => void

interface IUseQueryParamsInitial {
	[key: string]: ParamType
}

enum PARAM_TYPE {
	ARRAY = 'ARRAY',
	STRING = 'STRING',
	BOOLEAN = 'BOOLEAN',
	NUMBER = 'NUMBER'
}

type ParamType<ValueType = any> = {
	paramType: PARAM_TYPE
	value?: ValueType | null
}

// vystup z tejto funkcie ide do useSearchParams hooku
// do neho potrebujeme prekonvertovat hodnoty na stringy a v pripade undefined ich uplne odstranit
const serializeInitialParams = (initialValues?: IUseQueryParamsInitial) =>
	Object.entries(initialValues || {}).reduce((acc, [key, value]) => {
		if (value.value === undefined) {
			// odstrani query parameter zo searchParams
			return { ...acc }
		}
		if (value.value === null || (value.paramType === PARAM_TYPE.ARRAY && isArray(value.value) && !value.value.length)) {
			// nastavi mu prazdnu hodnotu, napr. &foo=, resp. &foo
			return {
				...acc,
				[key]: {
					paramType: value.paramType,
					value: ''
				}
			}
		}
		if ((value.paramType === PARAM_TYPE.NUMBER && typeof value.value === 'number') || (value.paramType === PARAM_TYPE.BOOLEAN && typeof value.value === 'boolean')) {
			return {
				...acc,
				[key]: {
					paramType: value.paramType,
					value: String(value.value)
				}
			}
		}
		return {
			...acc,
			[key]: value
		}
	}, {} as IUseQueryParams)

// z vystupom z tejto funkcie sa dalej pracuje v komponetoch
// vystupne hodnoty budu mat typy podla typov zadefinonvaych v inicializacnom objekte
const getInitialParams = (initialValues?: IUseQueryParamsInitial, URLSearchParams?: URLSearchParams) =>
	Object.entries(initialValues || {}).reduce((acc, [key, value]) => {
		const paramTyme = {
			paramType: value.paramType,
			value: value.value
		}

		const hasURLParam = URLSearchParams?.has(key)

		// v pripade pola je potrebne pouzit getAll() metodu, aby sme ziskali vsetky hodnoty
		if (value.paramType === PARAM_TYPE.ARRAY) {
			const URLValueArray = URLSearchParams?.getAll(key)
			// ak sa pri inite v URL nenachadza hodnota, initneme default
			if (!hasURLParam) {
				return { ...acc, [key]: { ...paramTyme, value: value.value } }
			}
			/**
			 * v pripade, ze volame metodu getAll(), tak to vzdy vrati pole
			 * ak je v URLcke query parameter foo=, tak URLValue = ['']
			 * ak je hodnota prazdny string, initnme ako null
			 */
			if (URLValueArray && URLValueArray[0] === '') {
				return { ...acc, [key]: { ...paramTyme, value: null } }
			}
			// inak initneme co sa nachadza v URL
			return { ...acc, [key]: { ...paramTyme, value: URLValueArray } }
		}

		let URLValue: string | number | boolean | undefined | null = URLSearchParams?.get(key)
		// ak sa pri inite v URL nenachadza hodnota, initneme default
		if (!hasURLParam) {
			return { ...acc, [key]: { ...paramTyme, value: value.value } }
		}
		// ak je hodnota prazdny string, initnme ako null
		if (URLValue === '') {
			return { ...acc, [key]: { ...paramTyme, value: null } }
		}

		// prekonvertujeme na number ak sa jedna o type number
		if (value.paramType === PARAM_TYPE.NUMBER) {
			if (!Number.isNaN(URLValue)) {
				URLValue = Number(URLValue)
			}
		}

		if (value.paramType === PARAM_TYPE.BOOLEAN) {
			if (URLValue === 'true') {
				URLValue = true
			}
			if (URLValue === 'false') {
				URLValue = false
			}
		}
		// inak initneme co sa nachadza v URL
		return { ...acc, [key]: { ...paramTyme, value: URLValue } }
	}, {} as IUseQueryParamsInitial)

const mapInitialParamsToReturnParams = (initialParams?: IUseQueryParamsInitial): IUseQueryParams => {
	return Object.entries(initialParams || {}).reduce((acc, [key, value]) => {
		return {
			...acc,
			[key]: value.value
		}
	}, {} as IUseQueryParams)
}

// vystup z tejto funkcie ide do useSearchParams hooku
// do neho potrebujeme prekonvertovat hodnoty na stringy a v pripade undefined ich uplne odstranit
export const serializeParams = (params?: IUseQueryParams) =>
	Object.entries(params || {}).reduce((acc, [key, value]) => {
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
		if (typeof value === 'number' || typeof value === 'boolean') {
			return {
				...acc,
				[key]: String(value)
			}
		}
		return {
			...acc,
			[key]: value
		}
	}, {} as IUseQueryParams)

export const ArrayParam = (value?: string[] | null): ParamType => {
	return {
		paramType: PARAM_TYPE.ARRAY,
		value
	}
}

export const StringParam = (value?: string | null): ParamType => {
	return {
		paramType: PARAM_TYPE.STRING,
		value
	}
}

export const BooleanParam = (value?: boolean | null): ParamType => {
	return {
		paramType: PARAM_TYPE.BOOLEAN,
		value
	}
}

export const NumberParam = (value?: number | null): ParamType => {
	return {
		paramType: PARAM_TYPE.NUMBER,
		value
	}
}

/**
 * v inicializacnom objekte je vzdy potrebne zadefinovat typ query parametra (zatial mame len StringParam(initValue) a ArrayParam(initValue))
 * { foo: StringParam(), baz: ArrayParam(['init value 1', 'init value 2']) }
 * obalit inicializacne hodnoty do typovych funkcii je potrebne kvoli tomu, aby sme vedeli spravne rozparsovat query parameter
 * tento hook uz potom vrati objekt v tvare: { foo: undefined, baz: ['init value 1', 'init value 2'] }
 * zaroven vrati setovaciu funkciu pre update query parameterov
 * { foo: undefined } => odstrani queryParam foo z URL
 * { foo: '' } || { foo: [] } || { foo: null } => &foo=
 */
const useQueryParams = (queryParamsInitial?: IUseQueryParamsInitial): [IUseQueryParams, (newValues: IUseQueryParams) => void] => {
	// prekonvertujeme initial objekt (ktory obsahuje informacie o type query parametru - Array x String) do jednoduchsieho objektu key:value vhodneho pre useSearchParams hook
	const intialValuesForSearchParams = mapInitialParamsToReturnParams(serializeInitialParams(queryParamsInitial))
	const [searchParams, setSearchParams] = useSearchParams(intialValuesForSearchParams)

	// tieto hodnoty uz obsahuju aj zohladene query parametre z URLcky
	const storedInitialValues = useRef(getInitialParams(queryParamsInitial, searchParams))

	// do query nastavime zjednoduseny objekt bez typov, aby sa potom pri volani setQueryParams v komponente nemusli vsade posielat informacie o type, ale len jednoduchy key:value objekt
	const [query, setQuery] = useState<IUseQueryParams | undefined>(mapInitialParamsToReturnParams(storedInitialValues.current))

	// console.log({ intialValuesForSearchParams, queryParamsInitial, query })

	const setQueryParams = useCallback(
		(newValues?: IUseQueryParams) => {
			setSearchParams(serializeParams(newValues))
			setQuery(newValues)
		},
		[setSearchParams]
	)

	return [query || {}, setQueryParams]
}

export default useQueryParams
