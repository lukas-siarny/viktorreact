import React, { Dispatch } from 'react'
import { isEmpty, map } from 'lodash'
import { Tag, Tooltip, Image } from 'antd'
import i18next, { TFunction } from 'i18next'
import { NavigateFunction } from 'react-router'
import { AnyAction } from 'redux'

// types
import { AutocompleteLabelInValue, Columns, OpeningHours } from '../../../types/interfaces'
import { ISelectedSalonPayload } from '../../../reducers/selectedSalon/selectedSalonActions'
import { IBasicSalon } from '../../../reducers/salons/salonsActions'
import { Paths } from '../../../types/api'
import { ICategoriesPayload } from '../../../reducers/categories/categoriesActions'

// enums
import { SALON_STATES, SALON_CREATE_TYPE, SALON_SOURCE_TYPE } from '../../../utils/enums'

// components
import {
	checkSameOpeningHours,
	checkWeekend,
	createSameOpeningHours,
	initOpeningHours,
	mapRawOpeningHoursToComponentOpeningHours,
	orderDaysInWeek
} from '../../../components/OpeningHours/OpeningHoursUtils'

// schema
import { ISalonForm } from '../../../schemas/salon'

// assets
import { ReactComponent as CheckerIcon } from '../../../assets/icons/check-icon-circle-icon.svg'
import { ReactComponent as CrossIcon } from '../../../assets/icons/close-circle-icon.svg'

// utils
import { formatDateByLocale, getAssignedUserLabel, setOrder } from '../../../utils/helper'

const getPhoneDefaultValue = (phonePrefixCountryCode: string) => [
	{
		phonePrefixCountryCode,
		phone: null
	}
]

export type SalonInitType = ISelectedSalonPayload['data'] & IBasicSalon

/**
 *
 * @param salonData
 * @param phonePrefixCountryCode
 * @param salonNameFromSelect
 * @returns
 */
export const initSalonFormData = (salonData: SalonInitType | null, phonePrefixCountryCode: string, salonNameFromSelect = false) => {
	// stacilo by isEmpty ale aby typescript nehucal tak je aj prva podmienka
	if (!salonData || isEmpty(salonData)) {
		return {}
	}
	// init data for existing salon
	const mappedOpeningHours = mapRawOpeningHoursToComponentOpeningHours(salonData.openingHours)
	const openOverWeekend: boolean = checkWeekend(mappedOpeningHours)
	const sameOpenHoursOverWeek: boolean = checkSameOpeningHours(mappedOpeningHours)
	const openingHours: OpeningHours = initOpeningHours(mappedOpeningHours, sameOpenHoursOverWeek, openOverWeekend)?.sort(orderDaysInWeek) as OpeningHours
	// pre sprave zobrazenie informacnych hlasok a disabled stavov submit buttonov je potrebne dat pozor, aby isPristine fungovalo spravne = teda pri pridavani noveho fieldu je to potrebne vzdy skontrolovat
	// napr. ak pride z BE aboutUsFirst: undefined, potom prepisem hodnotu vo formulari a opat ju vymazem, tak do reduxu sa ta prazdna hodnota uz neulozi ako undeifned ale ako null
	// preto maju vsetky inicializacne hodnoty, pre textFieldy a textAreaFieldy fallback || null (pozri impementaciu tychto komponentov, preco sa to tam takto uklada)
	const initialData = {
		salonNameFromSelect,
		id: salonData.id || null,
		state: salonData.state as SALON_STATES,
		name: salonNameFromSelect
			? {
					key: salonData.id,
					label: salonData.name,
					value: salonData.id
			  }
			: salonData.name,
		email: salonData.email,
		// categoryIDs for basic salon
		categoryIDs: (!isEmpty(salonData?.categories) ? salonData?.categories.map((category) => category.id) : null) as ISalonForm['categoryIDs'],
		payByCard: !!salonData.payByCard,
		payByCash: !!salonData?.payByCash,
		otherPaymentMethods: salonData.otherPaymentMethods || null,
		aboutUsFirst: salonData.aboutUsFirst || null,
		openOverWeekend,
		sameOpenHoursOverWeek,
		openingHours,
		latitude: salonData.address?.latitude ?? null,
		longitude: salonData.address?.longitude ?? null,
		city: salonData.address?.city || null,
		street: salonData.address?.street || null,
		zipCode: salonData.address?.zipCode || null,
		country: salonData.address?.countryCode || null,
		streetNumber: salonData.address?.streetNumber || null,
		locationNote: salonData.locationNote || null,
		parkingNote: salonData.parkingNote || null,
		phones:
			salonData.phones && !isEmpty(salonData.phones)
				? salonData.phones.map((phone) => ({
						phonePrefixCountryCode: phone.phonePrefixCountryCode || null,
						phone: phone.phone || null
				  }))
				: getPhoneDefaultValue(phonePrefixCountryCode),
		gallery: map(salonData.images, (image) => ({ thumbUrl: image?.resizedImages?.thumbnail, url: image?.original, uid: image?.id, isCover: image?.isCover })),
		pricelists: map(salonData.pricelists, (file) => ({ url: file?.original, uid: file?.id, name: file?.fileName })),
		logo: salonData.logo?.id
			? [
					{
						uid: salonData.logo.id,
						url: salonData.logo?.original,
						thumbUrl: salonData.logo?.resizedImages?.thumbnail
					}
			  ]
			: null,
		cosmeticIDs: salonData.cosmetics?.reduce((acc, cosmetic) => {
			if (cosmetic) {
				return [...acc, cosmetic.id]
			}
			return acc
		}, [] as string[]),
		languageIDs: salonData.languages?.reduce((acc, lng) => {
			if (lng) {
				return [...acc, lng.id]
			}
			return acc
		}, [] as string[]),
		socialLinkWebPage: salonData.socialLinkWebPage || null,
		socialLinkFB: salonData.socialLinkFB || null,
		socialLinkInstagram: salonData.socialLinkInstagram || null,
		socialLinkYoutube: salonData.socialLinkYoutube || null,
		socialLinkTikTok: salonData.socialLinkTikTok || null,
		socialLinkPinterest: salonData.socialLinkPinterest || null
	}

	return initialData
}

export const initEmptySalonFormData = (phonePrefixCountryCode: string, salonNameFromSelect = false) => {
	return {
		salonNameFromSelect,
		openOverWeekend: false,
		sameOpenHoursOverWeek: true,
		openingHours: initOpeningHours(undefined, true, false),
		payByCard: false,
		payByCash: true,
		phones: getPhoneDefaultValue(phonePrefixCountryCode)
	}
}

export const getSalonDataForSubmission = (data: ISalonForm) => {
	const openingHours: OpeningHours = createSameOpeningHours(data.openingHours, data.sameOpenHoursOverWeek, data.openOverWeekend)?.sort(orderDaysInWeek) as OpeningHours
	const phones = data.phones?.filter((phone) => phone?.phone)

	return {
		imageIDs: (data.gallery || []).map((image: any) => ({
			id: image?.id ?? image?.uid,
			isCover: image?.isCover ?? false
		})) as Paths.PatchApiB2BAdminSalonsSalonId.RequestBody['imageIDs'],
		logoID: map(data.logo, (image) => image?.id ?? image?.uid)[0] ?? null,
		name: data.salonNameFromSelect ? (data.name as AutocompleteLabelInValue)?.label : data.name,
		openingHours: openingHours || [],
		aboutUsFirst: data.aboutUsFirst,
		city: data.city,
		countryCode: data.country,
		latitude: data.latitude,
		longitude: data.longitude,
		street: data.street,
		streetNumber: data.streetNumber,
		zipCode: data.zipCode,
		locationNote: data.locationNote,
		phones,
		email: data.email,
		socialLinkFB: data.socialLinkFB,
		socialLinkInstagram: data.socialLinkInstagram,
		socialLinkWebPage: data.socialLinkWebPage,
		socialLinkTikTok: data.socialLinkTikTok,
		socialLinkYoutube: data.socialLinkYoutube,
		socialLinkPinterest: data.socialLinkPinterest,
		parkingNote: data.parkingNote,
		payByCard: !!data.payByCard,
		payByCash: !!data.payByCash,
		otherPaymentMethods: data.otherPaymentMethods,
		cosmeticIDs: data.cosmeticIDs,
		languageIDs: data.languageIDs,
		pricelistIDs: (data.pricelists || []).map((image: any) => image?.id ?? image?.uid) as Paths.PatchApiB2BAdminSalonsSalonId.RequestBody['pricelistIDs']
	}
}

// salon status tags
export const getSalonTagPublished = (salonStatus?: SALON_STATES) => {
	if (!salonStatus) {
		return null
	}

	switch (salonStatus) {
		case SALON_STATES.PUBLISHED:
		case SALON_STATES.PUBLISHED_PENDING:
		case SALON_STATES.PUBLISHED_DECLINED:
			return (
				<Tag className={'noti-tag bg-status-published'}>
					<span>{i18next.t('loc:Publikovaný')}</span>
				</Tag>
			)
		default:
			return (
				<Tag className={'noti-tag bg-status-notPublished'}>
					<span>{i18next.t('loc:Nepublikovaný')}</span>
				</Tag>
			)
	}
}

export const getSalonTagDeleted = (deleted?: boolean, returnOnlyDeleted = false) => {
	if (deleted) {
		return (
			<Tag className={'noti-tag danger'}>
				<span>{i18next.t('loc:Vymazaný')}</span>
			</Tag>
		)
	}

	if (returnOnlyDeleted) {
		return null
	}

	return (
		<Tag className={'noti-tag info'}>
			<span>{i18next.t('loc:Nevymazaný')}</span>
		</Tag>
	)
}

export const getSalonTagChanges = (salonStatus?: SALON_STATES) => {
	if (!salonStatus) {
		return null
	}

	switch (salonStatus) {
		case SALON_STATES.NOT_PUBLISHED_PENDING:
		case SALON_STATES.PUBLISHED_PENDING:
			return (
				<Tag className={'noti-tag bg-status-pending'}>
					<span>{i18next.t('loc:Na schválenie')}</span>
				</Tag>
			)
		case SALON_STATES.NOT_PUBLISHED_DECLINED:
		case SALON_STATES.PUBLISHED_DECLINED:
			return (
				<Tag className={'noti-tag bg-status-declined'}>
					<span>{i18next.t('loc:Zamietnuté')}</span>
				</Tag>
			)
		default:
			return null
	}
}

export const getSalonTagCreateType = (salonStatus?: SALON_STATES, createType?: SALON_CREATE_TYPE) => {
	if (salonStatus && createType) {
		if (createType === SALON_CREATE_TYPE.NON_BASIC) {
			return (
				<Tag className={'noti-tag bg-status-premium'}>
					<span>{i18next.t('loc:PREMIUM')}</span>
				</Tag>
			)
		}

		if (createType === SALON_CREATE_TYPE.BASIC) {
			return (
				<Tag className={'noti-tag bg-status-basic'}>
					<span>{i18next.t('loc:BASIC')}</span>
				</Tag>
			)
		}
	}
	return null
}

export const getSalonTagSourceType = (sourceType?: string | SALON_SOURCE_TYPE) => {
	switch (sourceType) {
		case SALON_SOURCE_TYPE.IMPORT:
			return (
				<Tag className={'noti-tag bg-source-import'}>
					<span>{i18next.t('loc:Import')}</span>
				</Tag>
			)

		case SALON_SOURCE_TYPE.NOTINO:
			return (
				<Tag className={'noti-tag bg-source-notino'}>
					<span>{i18next.t('loc:Notino')}</span>
				</Tag>
			)

		case SALON_SOURCE_TYPE.PARTNER:
			return (
				<Tag className={'noti-tag bg-source-partner'}>
					<span>{i18next.t('loc:Partner')}</span>
				</Tag>
			)

		default:
			return null
	}
}

export const getCheckerIcon = (valid?: boolean) =>
	valid ? <CheckerIcon className={'medium-icon text-notino-success'} /> : <CrossIcon className={'medium-icon text-notino-gray'} />

export type SalonsPageCommonProps = {
	selectedCountry?: string
	changeSelectedCountry: (selectedCountry?: string) => void
	t: TFunction
	navigate: NavigateFunction
	dispatch: Dispatch<any>
}

/**
 * define columns used in salons pages / active / deleted / to check /
 */
export const getSalonsColumns = (order?: string, categories?: ICategoriesPayload['data']) => {
	const tableColumns: { [key: string]: (props?: Columns[0]) => Columns[0] } = {
		id: (columnProps) => ({
			title: i18next.t('loc:ID'),
			dataIndex: 'id',
			key: 'id',
			ellipsis: false,
			sorter: false,
			render: (value) => {
				const firstThree = value.substring(0, 3)
				const lastThree = value.substring(value.length - 3)

				return <Tooltip title={value}>{`${firstThree}...${lastThree}`}</Tooltip>
			},
			...columnProps
		}),
		name: (columnProps) => ({
			title: <span id={'sortby-title'}>{i18next.t('loc:Názov')}</span>,
			dataIndex: 'name',
			key: 'name',
			ellipsis: true,
			sorter: true,
			sortOrder: setOrder(order, 'name'),
			render: (value) => value || '-',
			...columnProps
		}),
		address: (columnProps) => ({
			title: i18next.t('loc:Adresa'),
			dataIndex: 'address',
			key: 'address',
			ellipsis: true,
			sorter: false,
			render: (value) => (!isEmpty(value) ? <>{value?.city && value?.street ? `${value?.city}, ${value?.street}` : ''}</> : '-'),
			...columnProps
		}),
		createType: (columnProps) => ({
			title: i18next.t('loc:Typ salónu'),
			dataIndex: 'createType',
			key: 'createType',
			sorter: false,
			render: (_value, record) => getSalonTagCreateType(record.state, record.createType),
			...columnProps
		}),
		createdAt: (columnProps) => ({
			title: i18next.t('loc:Vytvorený'),
			dataIndex: 'createdAt',
			key: 'createdAt',
			ellipsis: true,
			sorter: true,
			sortOrder: setOrder(order, 'createdAt'),
			render: (value) => (value ? formatDateByLocale(value) : '-'),
			...columnProps
		}),
		lastUpdatedAt: (columnProps) => ({
			title: i18next.t('loc:Upravený'),
			dataIndex: 'lastUpdatedAt',
			key: 'lastUpdatedAt',
			ellipsis: true,
			sorter: false,
			render: (value) => (value ? formatDateByLocale(value) : '-'),
			...columnProps
		}),
		deletedAt: (columnProps) => ({
			title: i18next.t('loc:Vymazaný'),
			dataIndex: 'deletedAt',
			key: 'deletedAt',
			ellipsis: true,
			sorter: false,
			render: (value) => (value ? formatDateByLocale(value) : '-'),
			...columnProps
		}),
		isPublished: (columnProps) => ({
			title: i18next.t('loc:Publikovaný'),
			key: 'isPublished',
			ellipsis: true,
			sorter: false,
			render: (_value, record: any) => {
				let checked = false
				switch (record.state) {
					case SALON_STATES.PUBLISHED:
					case SALON_STATES.PUBLISHED_PENDING:
					case SALON_STATES.PUBLISHED_DECLINED:
						checked = true
						break
					default:
						break
				}
				return <div className={'flex items-center'}>{getCheckerIcon(checked)}</div>
			},
			...columnProps
		}),
		changes: (columnProps) => ({
			title: i18next.t('loc:Zmeny'),
			key: 'changes',
			ellipsis: true,
			sorter: false,
			render: (_value, record) => getSalonTagChanges(record.state),
			...columnProps
		}),
		fillingProgress: (columnProps) => ({
			title: i18next.t('loc:Vyplnenie profilu'),
			dataIndex: 'fillingProgressSalon',
			key: 'fillingProgress',
			sorter: true,
			sortOrder: setOrder(order, 'fillingProgress'),
			render: (value: number | undefined) => <span className={'w-9 flex-shrink-0'}>{value ? `${value}%` : ''}</span>,
			...columnProps
		}),
		assignedUser: (columnProps) => ({
			title: i18next.t('loc:Notino používateľ'),
			dataIndex: 'assignedUser',
			key: 'assignedUser',
			sorter: false,
			render: (value: any) => <span className={'inline-block truncate w-full'}>{getAssignedUserLabel(value)}</span>,
			...columnProps
		}),
		premiumSourceUserType: (columnProps) => ({
			title: i18next.t('loc:Zdroj PREMIUM'),
			dataIndex: 'premiumSourceUserType',
			key: 'premiumSourceUserType',
			sorter: false,
			render: (value: string) => getSalonTagSourceType(value),
			...columnProps
		}),
		enabledRS: (columnProps) => ({
			title: i18next.t('loc:Rezervačný systém'),
			dataIndex: 'settings',
			key: 'settings',
			sorter: false,
			render: (value: any) => getCheckerIcon(value?.enabledReservations),
			...columnProps
		}),
		availableReservationSystem: (columnProps) => ({
			title: i18next.t('loc:Dostupné pre online rezervácie'),
			dataIndex: 'availableReservationSystem',
			key: 'availableReservationSystem',
			sorter: false,
			render: (value: boolean) => getCheckerIcon(value),
			...columnProps
		}),
		categories: (columnProps) => {
			const categoriesCol = {
				title: i18next.t('loc:Odvetvia'),
				dataIndex: 'categories',
				key: 'categories',
				sorter: false,
				...columnProps
			}

			if (categories) {
				const industries: { [key: string]: { image?: string; name: string } } = categories.reduce(
					(result, industry) => ({ ...result, [industry.id]: { image: industry.image?.resizedImages?.thumbnail, name: industry.name } }),
					{}
				)

				return {
					...categoriesCol,
					render: (value: any[]) => {
						const fallback = '-'

						if (value?.length > 0) {
							const industriesContent: any[] = value.map((category: any) => {
								const industry = industries[category.id]
								if (!industry) {
									// eslint-disable-next-line no-console
									console.error('Missingy industry with ID: ', category.id)
									return fallback
								}

								return (
									<Tooltip key={category.id} title={industry.name}>
										<Image src={industry.image} loading='lazy' width={32} height={32} className='pr-0-5 pb-0-5 rounded' alt={industry.name} preview={false} />
									</Tooltip>
								)
							})

							return <div className='flex flex-wrap'>{industriesContent}</div>
						}

						return fallback
					}
				}
			}

			return categoriesCol
		}
	}
	return tableColumns
}
