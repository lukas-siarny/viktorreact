import { isArray } from 'lodash'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { z, ZodTypeAny } from 'zod'

/**
 * @param schema ZOD schema
 * @returns vrati typ schemy // eg z.ZodArray z.ZodNumber, z.ZodString
 */
const getInnerSchema = (schema: any): z.ZodTypeAny => {
	if (schema && schema.unwrap) {
		return getInnerSchema(schema.unwrap())
	}

	return schema
}

/**
 * @param schema ZOD schema
 * @param params objekt, ktory by mal byt validny podla ZOD schemy
 * @param URLSearchParams hodnoty, ktore vratil useSearchParams hook po vyiinicalizovani s nasimi upravenymi inicialnymi hodnotami cez serializeParams() funkciu
 * @returns mergnu sa hodnoty, ktore su zadefiovane v URLcke s hodnotami z nasho inicialneho objektu
 */
const mergeParamsWithUrlParams = <T extends {}>(schema: any, params?: T, URLSearchParams?: URLSearchParams): T => {
	return Object.entries(params || {}).reduce((acc, [key, value]) => {
		const hasURLParam = URLSearchParams?.has(key)
		const propertySchema = schema.shape[key as keyof T]
		const innerSchema = getInnerSchema(propertySchema)

		// v pripade pola je potrebne pouzit getAll() metodu, aby sme ziskali vsetky hodnoty
		if (innerSchema instanceof z.ZodArray) {
			const URLValueArray = URLSearchParams?.getAll(key)
			// ak sa pri inite v URL nenachadza hodnota, initneme default
			if (!hasURLParam) {
				return { ...acc, [key]: value }
			}
			/**
			 * v pripade, ze volame metodu getAll(), tak to vzdy vrati pole
			 * ak je v URLcke query parameter foo=, tak URLValue = ['']
			 * ak je hodnota prazdny string, initnme ako null
			 */
			if (URLValueArray && URLValueArray[0] === '') {
				return { ...acc, [key]: null }
			}
			// TODO: este pozriet ze ocakvam number, boolean v poli
			// inak initneme co sa nachadza v URL
			return { ...acc, [key]: URLValueArray }
		}

		// ak sa pri inite v URL nenachadza hodnota, initneme default
		if (!hasURLParam) {
			return { ...acc, [key]: value }
		}

		let URLValue: string | number | boolean | undefined | null = URLSearchParams?.get(key)

		// ak je hodnota prazdny string, initnme ako null
		if (URLValue === '') {
			return { ...acc, [key]: null }
		}

		if (innerSchema instanceof z.ZodNumber) {
			if (!Number.isNaN(URLValue)) {
				URLValue = Number(URLValue)
			}
		}

		if (innerSchema instanceof z.ZodBoolean) {
			if (URLValue === 'true') {
				URLValue = true
			}
			if (URLValue === 'false') {
				URLValue = false
			}
		}
		// inak initneme co sa nachadza v URL
		return { ...acc, [key]: URLValue }
	}, {} as T)
}

/**
 * @param params objekt s hodnotami roznych typov (string, number, boolean, undefined, null, string[], number[])
 * @returns editované hodnoty vhodné pre useSearchParams hook
 * do neho potrebujeme prekonvertovat hodnoty na 'string' | string[], v pripade 'undefined' ich uplne odstranit a v pripade 'null' upravit na ''
 */
const serializeParams = <T extends object>(params?: T): T | undefined => {
	return Object.entries(params || {}).reduce((acc, [key, value]) => {
		if (value === undefined) {
			// odstrani query parameter zo searchParams
			return acc
		}

		if (value === null) {
			// nastavi od URLcky prazdnu hodnotu, napr. &foo=, resp. &foo
			return { ...acc, [key]: '' }
		}

		if (isArray(value)) {
			if (!value.length) {
				// nastavi od URLcky prazdnu hodnotu, napr. &foo=, resp. &foo
				return { ...acc, [key]: '' }
			}

			// upravy hodnoty v poli na stringy
			value.reduce((arr, cv) => {
				if (cv === undefined || cv === null) {
					return arr
				}
				return [...arr, z.coerce.string().parse(cv)]
			}, [])
		}

		// upravy zvysne hodnoty na stringy
		return { ...acc, value: z.coerce.string().parse(value) }
	}, {} as T)
}

/**
 * wrapper nad useSearchParams hookom z react-routera, ktory umoznuje pracovat s hodnotami parametrov roznych typov (string, string[], number, number[] boolean, boolean[], undefined, null)
 * (useSearchParams hook pracuje so string, string[])
 * @param schema ZOD schema
 * @param initialValues inicializacny objekt, ktory by mal byt validny podla ZOD schemy
 * @param globalConfig NavigateOptions
 * @returns query objekt generickeho typu T, ktory by mal byt validny podla ZOD schemy (teda mal by byt vytvoreny ako z.infer<typeof ZODschema>)
 * v pripade, ze sa pri inicializacii v URLcke nachadzaju nejake hodnoty, tak vrati nase inicializacne hodnoty mergnute s tymito hodnotami
 * POZOR! atributy, ktore sa nenachadzaju v inicializacnom objekte budu pri mergovani odignorovane
 * teda aj v pripade, ze nechceme parametru nastavit hodnotu, je potrebne ho vyinicializovat => { parameter: undefined }
 */
const useQueryParams = <T extends {}>(
	schema: ZodTypeAny,
	initialParams?: T,
	globalConfig: NavigateOptions = { replace: true }
): [T, (newValues: T, config?: NavigateOptions) => void] => {
	// upravime nase inicializacne hodnoty do tvaru vhodneho pre useSearchParams hook a upravene hodnoty vyincializujeme
	const [searchParams, setSearchParams] = useSearchParams(serializeParams<T>(initialParams))

	const getParamsMergedWithURLParams = () => mergeParamsWithUrlParams(schema, initialParams, searchParams)

	// do query, ktoru vracia nas hook ulozime mergnute hodnoty z nasho inicialneho objektu s hodnotami z URLcky, ktore vratil useSearchParams hook
	const [query, setQuery] = useState<T | undefined>(getParamsMergedWithURLParams())

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
		/**
		 * tento useEffect zabezpeci update query aj pri zmene parametrov v URL cez navigaciu v prehliadaci (v pripade, ze je { replace: false } a kazda zmena sa uklada do historie)
		 * pri prvom inite sa to nastavi rovno v state, takze je potrebne sledovat az dalsie zmeny
		 * pri pouziti setovacej funkcie setQuery je potrebne tiez zabranit aby sa nenastavovala query duplicitne
		 */
		if (init.current || onDemand.current) {
			init.current = false
			onDemand.current = false
			return
		}
		setQuery(getParamsMergedWithURLParams())
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchParams])

	return [(query || {}) as any, setQueryParams]
}

export default useQueryParams
