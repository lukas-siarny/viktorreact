import { isEmpty } from 'lodash'
/* eslint-disable import/no-cycle */
// types
import { ThunkResult } from '../index'
import { IResetStore } from '../generalTypes'

// utils
import { getReq } from '../../utils/request'
import { normalizeQueryParams } from '../../utils/helper'
import { SUPPORT_CONTACTS, SUPPORT_CONTACT, SET_SUPPORT_CONTACT_OPTIONS } from './supportContactsTypes'
import { LANGUAGE, DEFAULT_LANGUAGE } from '../../utils/enums'

// assets
import SK_Flag from '../../assets/flags/SK.svg'
import CZ_Flag from '../../assets/flags/CZ.svg'
import RO_Flag from '../../assets/flags/RO.svg'
import HU_Flag from '../../assets/flags/HU.svg'
import i18n from '../../utils/i18n'

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
			value: string
		}[]
		flag: string
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

// TODO: inteface
export interface ISupportContactsPayload {
	data: {} | null
	tableData?: ISupportContactsTableData[]
	options: ISupportContactOption[]
}

// TODO: interface
export interface ISupportContactPayload {
	data: {} | null
}

export interface ISupportContactOptionsPayload {
	options: ISupportContactOption[]
}

const mockupData = {
	supportContacts: [
		{
			id: 1,
			emails: ['lukas.siarny@goodrequest.com', 'lukas.siarny@gmail.com'],
			phones: ['+421 902 110 244'],
			note: 'Poznamka',
			address: {
				countryCode: 'SK',
				zipCode: '05201',
				city: 'Spišská Nová Ves',
				street: 'Brezová',
				streetNumber: '22'
			},
			country: {
				code: 'SK',
				name: 'Slovenská Republika',
				nameLocalizations: [
					{
						language: 'sk',
						value: 'Slovenská Republika'
					},
					{
						language: 'cz',
						value: 'Slovenská Řěpublika'
					},
					{
						language: 'hu',
						value: 'Szlovák Köztársaság'
					},
					{
						language: 'ro',
						value: 'Republica Slovaca'
					}
				],
				flag: SK_Flag as unknown as string,
				phonePrefix: '+421'
			}
		},
		{
			id: 2,
			emails: ['lukas.siarny@goodrequest.com', 'lukas.siarny@gmail.com'],
			phones: ['+421 902 110 244'],
			note: 'Poznamka',
			address: {
				countryCode: 'CZ',
				zipCode: '05201',
				city: 'Spišská Nová Ves',
				street: 'Brezová',
				streetNumber: '22'
			},
			country: {
				code: 'CZ',
				name: 'Česká Republika',
				nameLocalizations: [
					{
						language: 'sk',
						value: 'Česká Republika'
					},
					{
						language: 'cz',
						value: 'Česká Řěpublika'
					},
					{
						language: 'hu',
						value: 'Cseh Köztársaság'
					},
					{
						language: 'ro',
						value: 'Republica Cehă'
					}
				],
				flag: CZ_Flag as unknown as string,
				phonePrefix: '+420'
			}
		},
		{
			id: 3,
			emails: ['lukas.siarny@goodrequest.com', 'lukas.siarny@gmail.com'],
			phones: ['+421 902 110 244'],
			note: 'Poznamka',
			address: {
				countryCode: 'RO',
				zipCode: '05201',
				city: 'Spišská Nová Ves',
				street: 'Brezová',
				streetNumber: '22'
			},
			country: {
				code: 'RO',
				name: 'Rumunsko',
				nameLocalizations: [
					{
						language: 'sk',
						value: 'Rumunsko'
					},
					{
						language: 'cz',
						value: 'Řumunsko'
					},
					{
						language: 'hu',
						value: 'Románia'
					},
					{
						language: 'ro',
						value: 'România'
					}
				],
				flag: RO_Flag as unknown as string,
				phonePrefix: '+421'
			}
		},
		{
			id: 4,
			emails: ['lukas.siarny@goodrequest.com', 'lukas.siarny@gmail.com'],
			phones: ['+421 902 110 244'],
			note: 'Poznamka',
			address: {
				countryCode: 'HU',
				zipCode: '05201',
				city: 'Spišská Nová Ves',
				street: 'Brezová',
				streetNumber: '22'
			},
			country: {
				code: 'HU',
				name: 'Maďarsko',
				nameLocalizations: [
					{
						language: 'sk',
						value: 'Maďarsko'
					},
					{
						language: 'cz',
						value: 'Maďarsko'
					},
					{
						language: 'hu',
						value: 'Magyarország'
					},
					{
						language: 'ro',
						value: 'Ungaria'
					}
				],
				flag: HU_Flag as unknown as string,
				phonePrefix: '+421'
			}
		}
	]
}

const mockupDataDetail = {
	supportContact: {
		id: 1,
		emails: ['lukas.siarny@goodrequest.com', 'lukas.siarny@gmail.com'],
		phones: [
			{
				phonePrefixCountryCode: 'SK',
				phone: '902110244'
			},
			{
				phonePrefixCountryCode: 'SK',
				phone: '902111222'
			}
		],
		note: 'Lorem Ipsum is simply dummy text of the printing',
		address: {
			countryCode: 'SK',
			zipCode: '05201',
			city: 'Spišská Nová Ves',
			street: 'Brezová',
			streetNumber: '22'
		},
		country: {
			code: 'SK',
			name: 'Slovenská Republika',
			nameLocalizations: [
				{
					language: 'sk',
					value: 'Slovenská Republika'
				},
				{
					language: 'cz',
					value: 'Slovenská Řěpublika'
				},
				{
					language: 'hu',
					value: 'Szlovák Köztársaság'
				},
				{
					language: 'ro',
					value: 'Republica Slovaca'
				}
			],
			flag: SK_Flag as unknown as string,
			phonePrefix: '+421'
		},
		openingHours: [
			{
				day: 'MONDAY',
				timeRanges: [
					{
						timeTo: '13:00',
						timeFrom: '07:00'
					},
					{
						timeTo: '17:00',
						timeFrom: '14:30'
					},
					{
						timeTo: '18:00',
						timeFrom: '22:30'
					}
				]
			},
			{
				day: 'TUESDAY',
				timeRanges: [
					{
						timeTo: '13:00',
						timeFrom: '07:00'
					},
					{
						timeTo: '17:00',
						timeFrom: '14:30'
					}
				]
			},
			{
				day: 'WEDNESDAY',
				timeRanges: [
					{
						timeTo: '13:00',
						timeFrom: '07:00'
					},
					{
						timeTo: '17:00',
						timeFrom: '14:30'
					}
				]
			},
			{
				day: 'THURSDAY',
				timeRanges: [
					{
						timeTo: '13:00',
						timeFrom: '07:00'
					},
					{
						timeTo: '17:00',
						timeFrom: '14:30'
					}
				]
			},
			{
				day: 'FRIDAY',
				timeRanges: [
					{
						timeTo: '13:00',
						timeFrom: '07:00'
					},
					{
						timeTo: '17:00',
						timeFrom: '14:30'
					}
				]
			},
			{
				day: 'SATURDAY',
				timeRanges: [
					{
						timeTo: '13:00',
						timeFrom: '07:00'
					},
					{
						timeTo: '17:00',
						timeFrom: '14:30'
					}
				]
			},
			{
				day: 'SUNDAY',
				timeRanges: []
			}
		]
	}
}

// TODO: remove any when BE is done
export const getSupportContactsOptions =
	(currentLng = DEFAULT_LANGUAGE, data: any): ThunkResult<Promise<ISupportContactOptionsPayload>> =>
	async (dispatch) => {
		let payload = {} as ISupportContactOptionsPayload

		const options: ISupportContactOption[] = data?.supportContacts?.map((item: any) => {
			const countryCode = item.country.code
			const countryTranslation = item.country.nameLocalizations.find((translation: any) => translation.language === currentLng)

			return {
				key: countryCode,
				label: countryTranslation?.value || countryCode,
				value: countryCode,
				flag: item.country.flag
			}
		})

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
			// TODO: remove any when BE is done
			/* const { data } = await getReq('/api/b2b/admin/enums/support-contacts' as any, { ...normalizeQueryParams(queryParams) } as any) */
			const data = mockupData
			const tableData: ISupportContactsTableData[] = data.supportContacts.map((item) => {
				const tableItem = {
					key: item.id,
					supportContactID: item.id,
					// TODO: selecet name based on current language
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
	(supportContactID: number): ThunkResult<Promise<ISupportContactPayload>> =>
	async (dispatch) => {
		let payload = {} as ISupportContactPayload

		if (!supportContactID) {
			dispatch({ type: SUPPORT_CONTACT.SUPPORT_CONTACT_DONE, payload })
			return payload
		}

		try {
			dispatch({ type: SUPPORT_CONTACT.SUPPORT_CONTACT_START })
			// TODO: remove any when BE is done
			// const { data } = await getReq('/api/b2b/admin/enums/support-contacts/{supportContactID}' as any, { supportContactID } as any)
			const data = mockupDataDetail

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
