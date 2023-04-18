import { isArray } from 'lodash'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'

import { partialSafeParse } from '../utils/zodUtils'

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
 * @returns mergnu sa hodnoty, ktore su zadefiovane v URLcke s hodnotami z nasho objektu
 * mergnute hodnoty sa prekontroluju a vratia len validne podla schemy
 */
const mergeParamsWithUrlParams = <Schema extends z.ZodObject<any>>(schema: Schema, params: z.infer<Schema> = {}, URLSearchParams?: URLSearchParams): z.infer<Schema> => {
	const mergedAndConvertedParams = Object.keys(schema.shape || {}).reduce((acc, key) => {
		const hasURLParam = URLSearchParams?.has(key)
		const propertySchema = schema.shape[key]
		const innerSchema = getInnerSchema(propertySchema)
		const value = params[key]
		const hasKeyInParams = key in params

		// v pripade pola je potrebne pouzit getAll() metodu, aby sme ziskali vsetky hodnoty
		if (innerSchema instanceof z.ZodArray) {
			const URLValueArray = URLSearchParams?.getAll(key)
			// ak sa pri inite v URL nenachadza hodnota, initneme default (v pripade, ze sa taky key nachadzal v nasom objekte, inak vratime nezmeny objekt)
			if (!hasURLParam) {
				return hasKeyInParams ? { ...acc, [key]: value } : acc
			}

			let editedArr: (string | number | boolean)[] | undefined | null = URLValueArray

			if (URLValueArray && URLValueArray.length) {
				/**
				 * v pripade, ze volame metodu getAll(), tak to vzdy vrati pole
				 * ak je v URLcke query parameter foo=, tak URLValue = ['']
				 * ak je hodnota prazdny string, initnme ako null
				 */
				if (URLValueArray.length === 1 && URLValueArray[0] === '') {
					editedArr = null
				}

				// ak je shema zadefinovana ako pole ciselnych hodnot, tak validne hodnoty prekonvertujeme na cisla
				if (innerSchema.element instanceof z.ZodNumber) {
					editedArr = URLValueArray.reduce((arr, cv) => {
						if (cv) {
							return !Number.isNaN(cv) ? [...arr, Number(cv)] : arr
						}
						return arr
					}, [] as number[])
				}

				// ak je shema zadefinovana ako pole boolean hodnot, tak validne hodnoty prekonvertujeme na boolean
				if (innerSchema.element instanceof z.ZodBoolean) {
					editedArr = URLValueArray.reduce((arr, cv) => {
						let arrValue
						if (cv === 'true') {
							arrValue = true
						}
						if (cv === 'false') {
							arrValue = false
						}
						return arrValue !== undefined ? [...arr, arrValue] : arr
					}, [] as boolean[])
				}
			}

			// inak vrati hodnoty ktore su v URL
			return { ...acc, [key]: editedArr }
		}

		// ak sa pri inite v URL nenachadza hodnota, initneme default (v pripade, ze sa taky key nachadzal v nasom objekte, inak vratime nezmeny objekt)
		if (!hasURLParam) {
			return hasKeyInParams ? { ...acc, [key]: value } : acc
		}

		let URLValue: string | number | boolean | undefined | null = URLSearchParams?.get(key)

		// ak je hodnota prazdny string, initnme ako null
		if (URLValue === '') {
			return { ...acc, [key]: null }
		}

		// ak je shema zadefinovana ako cislena hodnota, tak validnu hodnotu prekonvertujeme na cislo
		if (innerSchema instanceof z.ZodNumber) {
			if (!Number.isNaN(URLValue)) {
				URLValue = Number(URLValue)
			}
		}

		// ak je shema zadefinovana ako boolean hodnota, tak validnu hodnotu prekonvertujeme na boolean
		if (innerSchema instanceof z.ZodBoolean) {
			if (URLValue === 'true') {
				URLValue = true
			}
			if (URLValue === 'false') {
				URLValue = false
			}
		}
		// inak vrati hodnoty ktore su v URL
		return { ...acc, [key]: URLValue }
	}, {} as z.infer<Schema>)

	// vrati len hodnoty validne podla schemy
	return partialSafeParse(schema, mergedAndConvertedParams).validData
}

/**
 * @param params objekt s hodnotami roznych typov (string, number, boolean, undefined, null, string[], number[])
 * @returns editované hodnoty vhodné pre useSearchParams hook
 * do neho potrebujeme prekonvertovat hodnoty na 'string' | string[], v pripade 'undefined' ich uplne odstranit a v pripade 'null' upravit na ''
 */
export const serializeParams = <T extends object>(params?: T): URLSearchParams => {
	const searchParams = new URLSearchParams()
	Object.entries(params || {}).forEach(([key, value]) => {
		if (value === undefined) {
			// odstrani query parameter zo searchParams
			return
		}

		if (value === null) {
			// nastavi do URLcky prazdnu hodnotu, napr. &foo=, resp. &foo
			searchParams.append(key, '')
			return
		}

		if (isArray(value)) {
			if (!value.length) {
				// nastavi do URLcky prazdnu hodnotu, napr. &foo=, resp. &foo
				searchParams.append(key, '')
				return
			}

			// upravy hodnoty v poli na stringy
			const stringArr = value.reduce((arr, cv) => {
				if (cv === undefined || cv === null) {
					return arr
				}
				return [...arr, z.coerce.string().parse(cv)]
			}, [] as string[])

			searchParams.append(key, stringArr)
			return
		}

		// upravy zvysne hodnoty na stringy
		searchParams.append(key, z.coerce.string().parse(value))
	})
	return searchParams
}

export const formatObjToQuery = <T extends object>(queryObj: T): string => `?${serializeParams(queryObj).toString()}`

/**
 * wrapper nad useSearchParams hookom z react-routera, ktory umoznuje pracovat s hodnotami parametrov roznych typov (string, string[], number, number[] boolean, boolean[], undefined, null)
 * (useSearchParams hook pracuje len so string, string[] a undefined)
 * @param schema ZOD schema
 * @param initialValues inicializacny objekt, ktory by mal byt validny podla ZOD schemy
 * @param globalConfig NavigateOptions
 * @returns query objekt generickeho typu T, ktory by mal byt validny podla ZOD schemy
 * v pripade, ze sa pri inicializacii v URLcke nachadzaju nejake hodnoty, tak vrati nase inicializacne hodnoty mergnute s tymito hodnotami
 */
const useQueryParams = <Schema extends z.ZodObject<any>>(
	schema: Schema,
	initialParams?: z.infer<Schema>,
	globalConfig: NavigateOptions = { replace: true }
): [z.infer<Schema>, (newValues: z.infer<Schema>, config?: NavigateOptions) => void] => {
	// upravime nase inicializacne hodnoty do tvaru vhodneho pre useSearchParams hook a upravene hodnoty vyincializujeme
	type SchemaInferedType = z.infer<Schema>
	const [searchParams, setSearchParams] = useSearchParams(serializeParams<SchemaInferedType>(initialParams))

	const getParamsMergedWithURLParams = () => mergeParamsWithUrlParams<Schema>(schema, initialParams, searchParams)

	// do query, ktoru vracia nas hook ulozime mergnute hodnoty z nasho inicialneho objektu s hodnotami z URLcky, ktore vratil useSearchParams hook
	const [query, setQuery] = useState<SchemaInferedType>(getParamsMergedWithURLParams())

	const init = useRef(true)
	const onDemand = useRef(false)

	const setQueryParams = useCallback(
		(newValues: SchemaInferedType, config?: NavigateOptions) => {
			onDemand.current = true
			setSearchParams(serializeParams<SchemaInferedType>(newValues), config || globalConfig)
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

	return [query || {}, setQueryParams]
}

export default useQueryParams
