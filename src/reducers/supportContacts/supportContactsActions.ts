/* eslint-disable import/no-cycle */
// types
import { ThunkResult } from '../index'
import { IResetStore } from '../generalTypes'

// utils
import { getReq } from '../../utils/request'
import { normalizeQueryParams } from '../../utils/helper'
import { SUPPORT_CONTACTS, SUPPORT_CONTACT, SET_SUPPORT_CONTACT_OPTIONS } from './supportContactsTypes'
import { LANGUAGE, DEFAULT_LANGUAGE } from '../../utils/enums'
import i18n from '../../utils/i18n'

// types
import { Paths } from '../../types/api'

export type ISupportContactsActions = IResetStore | IGetSupportContacts | IGetSupportContact | IGetSupportContactsOptions

interface IGetSupportContacts {
	type: SUPPORT_CONTACTS
	payload: ISupportContactsPayload
}

export interface IGetSupportContactsQueryParams {
	countryCode?: string | undefined | null
}

export interface IGetSupportContact {
	type: SUPPORT_CONTACT
	payload: ISupportContactPayload
}

export interface IGetSupportContactsOptions {
	type: typeof SET_SUPPORT_CONTACT_OPTIONS
	payload: ISupportContactOptionsPayload
}

export interface ISupportContactsTableData {
	key: number
	supportContactID: number
	country: {
		nameLocalizations: {
			language: string
			value: string | null
		}[]
		flag?: string
		code: string
	}
	city: string
	street: string
	streetNumber: string
	zipCode: string
}

export interface ISupportContactOption {
	key: string | number
	label: string
	value: string | number
	flag?: string
}

export interface ISupportContactsPayload {
	data: Paths.GetApiB2BAdminEnumsSupportContacts.Responses.$200 | null
	tableData?: ISupportContactsTableData[]
	options: ISupportContactOption[]
}

export interface ISupportContactPayload {
	data: Paths.GetApiB2BAdminEnumsSupportContactsSupportContactId.Responses.$200 | null
}

export interface ISupportContactOptionsPayload {
	options: ISupportContactOption[]
}

export const getSupportContactsOptions =
	(currentLng = DEFAULT_LANGUAGE, data: Paths.GetApiB2BAdminEnumsSupportContacts.Responses.$200 | null): ThunkResult<Promise<ISupportContactOptionsPayload>> =>
	async (dispatch) => {
		let payload = {} as ISupportContactOptionsPayload

		const options: ISupportContactOption[] =
			data?.supportContacts?.map((item: any) => {
				const countryCode = item.country.code
				const countryTranslation = item.country.nameLocalizations.find((translation: any) => translation.language === currentLng)

				return {
					key: item.id,
					label: countryTranslation?.value || countryCode,
					value: countryCode,
					flag: item.country.flag
				}
			}) || []

		payload = {
			options
		}

		dispatch({ type: SET_SUPPORT_CONTACT_OPTIONS, payload })

		return payload
	}

export const getSupportContacts =
	(queryParams?: IGetSupportContactsQueryParams): ThunkResult<Promise<ISupportContactsPayload>> =>
	async (dispatch) => {
		let payload = {} as ISupportContactsPayload
		try {
			dispatch({ type: SUPPORT_CONTACTS.SUPPORT_CONTACTS_START })
			const { data } = await getReq('/api/b2b/admin/enums/support-contacts/', { ...normalizeQueryParams(queryParams) })
			const tableData: ISupportContactsTableData[] = data.supportContacts.map((item) => {
				const tableItem = {
					key: item.id,
					supportContactID: item.id,
					country: {
						nameLocalizations: item.country?.nameLocalizations,
						flag: item.country?.flag,
						code: item.country?.code
					},
					city: item.address?.city || '-',
					street: item.address?.street || '-',
					streetNumber: item.address?.streetNumber || '-',
					zipCode: item.address?.zipCode || '-'
				}
				return tableItem
			})

			const { options } = await dispatch(getSupportContactsOptions((i18n.language as LANGUAGE) || DEFAULT_LANGUAGE, data))

			payload = {
				data,
				tableData,
				options
			}

			dispatch({ type: SUPPORT_CONTACTS.SUPPORT_CONTACTS_DONE, payload })
		} catch (err) {
			dispatch({ type: SUPPORT_CONTACTS.SUPPORT_CONTACTS_FAIL })
			// eslint-disable-next-line no-console
			console.error(err)
		}

		return payload
	}

export const getSupportContact =
	(supportContactID?: number): ThunkResult<Promise<ISupportContactPayload>> =>
	async (dispatch) => {
		let payload = {} as ISupportContactPayload

		if (!supportContactID) {
			dispatch({ type: SUPPORT_CONTACT.SUPPORT_CONTACT_DONE, payload })
			return payload
		}

		try {
			dispatch({ type: SUPPORT_CONTACT.SUPPORT_CONTACT_START })
			const { data } = await getReq('/api/b2b/admin/enums/support-contacts/{supportContactID}', { supportContactID })

			payload = {
				data
			}
			dispatch({ type: SUPPORT_CONTACT.SUPPORT_CONTACT_DONE, payload })
		} catch (err) {
			dispatch({ type: SUPPORT_CONTACT.SUPPORT_CONTACT_FAIL })
			// eslint-disable-next-line no-console
			console.error(err)
		}

		return payload
	}
