import { isArray } from 'lodash'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ZodTypeAny } from 'zod'

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
const serializeInitialParams = <T extends {}>(initialValues?: IUseQueryParamsInitial) =>
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
	}, {} as T)

// merguju sa query parametre z URLcky s query parametrami zadefinovanymi v inicialnom objekte
const mergeInitialValuesWithURLParams = (initialValues?: IUseQueryParamsInitial, URLSearchParams?: URLSearchParams) =>
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

// vrati zjednoduseny objekt bez informacii o typoch query parametrov
const reduceInitialParams = <T extends {}>(initialParams?: IUseQueryParamsInitial): T => {
	return Object.entries(initialParams || {}).reduce((acc, [key, value]) => {
		return {
			...acc,
			[key]: value.value
		}
	}, {} as T)
}

// vystup z tejto funkcie ide do useSearchParams hooku
// do neho potrebujeme prekonvertovat hodnoty na stringy a v pripade undefined ich uplne odstranit
export const serializeParams = <T extends {}>(params?: T) =>
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
const useQueryParams = <T extends {}>(
	schema: ZodTypeAny,
	queryParamsInitial?: IUseQueryParamsInitial,
	globalConfig: NavigateOptions = { replace: true }
): [T, (newValues: T, config?: NavigateOptions) => void] => {
	// prekonvertujeme initial objekt (ktory obsahuje informacie o type query parametru - Array x String) do jednoduchsieho objektu key:value vhodneho pre useSearchParams hook
	const intialValuesForSearchParams = reduceInitialParams<T>(serializeInitialParams<T>(queryParamsInitial))
	const [searchParams, setSearchParams] = useSearchParams(intialValuesForSearchParams)

	const getMergedInitialQueryParamsWithURLparams = () => reduceInitialParams<T>(mergeInitialValuesWithURLParams(queryParamsInitial, searchParams))

	// do query nastavime zjednoduseny objekt bez typov, aby sa potom pri volani setQueryParams v komponente nemusli vsade posielat informacie o type, ale len jednoduchy key:value objekt
	const [query, setQuery] = useState<T | undefined>(getMergedInitialQueryParamsWithURLparams())

	const init = useRef(true)
	const onDemand = useRef(false)

	const setQueryParams = useCallback(
		(newValues?: T, config?: NavigateOptions) => {
			onDemand.current = true
			setSearchParams(serializeParams(newValues), config || globalConfig)
			setQuery(newValues)
		},
		[setSearchParams, globalConfig]
	)

	useEffect(() => {
		// tento useEffect zabezpeci update query aj pri zmene parametrov v URL cez navigaciu v prehliadaci (v pripade, ze je { replace: false } a kazda zmena sa uklada do historie)
		// pri prvom inite sa to nastavi rovno v state, takze je potrebne sledovat az dalsie zmeny
		// pri pouziti setovacej funkcie setQuery je potrebne tiez zabranit aby sa nenastavovala query duplicitne
		if (init.current || onDemand.current) {
			init.current = false
			onDemand.current = false
			return
		}
		setQuery(getMergedInitialQueryParamsWithURLparams())
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchParams])

	return [query || ({} as T), setQueryParams]
}

export default useQueryParams
