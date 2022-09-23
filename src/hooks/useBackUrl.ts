import { useEffect, useState } from 'react'
import qs from 'qs'
import { get, split } from 'lodash'
import { StringParam, useQueryParams } from 'use-query-params'

import { decodeBackDataQuery } from '../utils/helper'
import { BACK_DATA_QUERY } from '../utils/enums'

/**
 * @param fallbackUrl Ak v adrese prehliadača chýba ?backUrl nastav ?backUrl=fallbackUrl
 */
export default <BackData>(fallbackUrl?: string, queryName: string = BACK_DATA_QUERY) => {
	const [decodedBackUrl, setDecodedBackUrl] = useState<string | undefined>()
	const [parsedBackData, setParsedBackData] = useState<BackData>()

	const [query] = useQueryParams({
		// NOTE: fix - pri pouziti withDefault sa resetovala backURL pri preklikavani tabou a nastavil s fallback aj ked mala exiustovat backURL
		backUrl: StringParam
	})

	useEffect(() => {
		if (query.backUrl) {
			const decodedUrl = atob(query.backUrl as any)
			setDecodedBackUrl(decodedUrl)
		} else if (!decodedBackUrl && fallbackUrl) {
			// NOTE: Ak nenastavi decodedBackUrl (neexistuje backUr;) a zaroven existuje fallback presmerovanie tak presmeruj na danu routu
			setDecodedBackUrl(fallbackUrl)
		}
	}, [decodedBackUrl, fallbackUrl, query.backUrl])

	// NOTE: Vyparsuj dáta z ?backUrl
	useEffect(() => {
		try {
			if (decodedBackUrl && queryName) {
				const backDataQuery = get(qs.parse(split(decodedBackUrl, '?')[1] || ''), queryName)
				const data = typeof backDataQuery === 'string' ? decodeBackDataQuery(backDataQuery) : null
				if (data) {
					setParsedBackData(data)
				}
			}
		} catch (err) {
			// eslint-disable-next-line no-console
			console.error(err)
		}
	}, [decodedBackUrl, queryName])

	return [decodedBackUrl, parsedBackData] as const
}
