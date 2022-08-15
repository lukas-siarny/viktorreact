/* eslint-disable import/no-cycle */
import { map } from 'lodash'

// types
import { LANGUAGES } from './languagesTypes'
import { ThunkResult } from '../index'
import { IResetStore } from '../generalTypes'

// utils
import { getReq } from '../../utils/request'
import { ISelectOptionItem, ILanguage } from '../../types/interfaces'
import i18n from '../../utils/i18n'
import { DEFAULT_LANGUAGE } from '../../utils/enums'
import { sortData } from '../../utils/helper'

export type ILanguagesActions = IResetStore | IGetLanguages

interface IGetLanguages {
	type: LANGUAGES
	payload: ILanguagesPayload
}

interface IEnumerationOptionItem extends ISelectOptionItem {
	flag?: string
}

export interface ILanguagesPayload {
	data: ILanguage[] | null
	enumerationsOptions: IEnumerationOptionItem[]
}

export const getSalonLanguages = (): ThunkResult<Promise<ILanguagesPayload>> => async (dispatch) => {
	let payload: ILanguagesPayload = {} as ILanguagesPayload

	try {
		dispatch({ type: LANGUAGES.LANGUAGES_LOAD_START })
		const { data } = await getReq('/api/b2b/admin/enums/languages/', undefined, undefined, undefined, undefined, true)

		const currentLng = i18n.language || DEFAULT_LANGUAGE

		const enumerationsOptions: ISelectOptionItem[] = map(data.languages, (item) => {
			const countryTranslation = item.nameLocalizations.find((translation: any) => translation.language === currentLng)
			const fallbackTranslation = item.nameLocalizations.find((translation) => translation.language === DEFAULT_LANGUAGE)

			return {
				key: `language_${item.id}`,
				label: countryTranslation?.value || fallbackTranslation?.value || '-',
				value: item.id,
				extra: {
					image: item.image?.resizedImages.thumbnail || item.image?.original
				}
			}
		}).sort((a, b) => sortData(a.label, b.label))

		payload = {
			data: data.languages,
			enumerationsOptions
		}

		dispatch({ type: LANGUAGES.LANGUAGES_LOAD_DONE, payload })
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error(error)
		dispatch({ type: LANGUAGES.LANGUAGES_LOAD_FAIL })
	}
	return payload
}