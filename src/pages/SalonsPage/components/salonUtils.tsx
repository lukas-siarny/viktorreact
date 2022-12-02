import React from 'react'
import { isEmpty, map } from 'lodash'
import { Tag } from 'antd'
import i18next from 'i18next'

// types
import { ISalonForm, OpeningHours } from '../../../types/interfaces'
import { ISalonPayloadData } from '../../../reducers/selectedSalon/selectedSalonActions'
import { IBasicSalon } from '../../../reducers/salons/salonsActions'
import { Paths } from '../../../types/api'

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

const getPhoneDefaultValue = (phonePrefixCountryCode: string) => [
	{
		phonePrefixCountryCode,
		phone: null
	}
]

export type SalonInitType = ISalonPayloadData & IBasicSalon

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

	const initialData: ISalonForm = {
		salonNameFromSelect,
		id: salonData.id || null,
		deletedAt: !!salonData.deletedAt,
		state: salonData.state as SALON_STATES,
		sourceOfPremium: salonData.premiumSourceUserType,
		name: salonData.name || null,
		nameSelect:
			{
				key: salonData.id,
				label: salonData.name || null,
				value: salonData.id || null
			} || null,
		email: salonData.email || null,
		// categoryIDs for basic salon
		categoryIDs: (isEmpty(!salonData?.categories) ? salonData?.categories.map((category) => category.id) : null) as ISalonForm['categoryIDs'],
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
		gallery: map(salonData.images, (image: any) => ({ thumbUrl: image?.resizedImages?.thumbnail, url: image?.original, uid: image?.id, isCover: image?.isCover })),
		pricelists: map(salonData.pricelists, (file) => ({ url: file?.original, uid: file?.id, name: file?.fileName })),
		logo: salonData.logo?.id
			? [
					{
						uid: salonData.logo?.id,
						url: salonData.logo?.original,
						thumbUrl: salonData.logo?.resizedImages?.thumbnail
					}
			  ]
			: null,
		languageIDs: map(salonData.languages, (lng) => lng?.id).filter((lng) => lng !== undefined) as string[],
		cosmeticIDs: map(salonData.cosmetics, (cosmetic) => cosmetic?.id).filter((cosmetic) => cosmetic !== undefined) as string[],
		address: !!salonData.address || null,
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
		name: data.salonNameFromSelect ? data.nameSelect?.label : data.name,
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

export const getAssignedUserLabel = (assignedUser?: Paths.GetApiB2BAdminSalons.Responses.$200['salons'][0]['assignedUser']): string => {
	if (!assignedUser) {
		return '-'
	}

	switch (true) {
		case !!assignedUser.firstName && !!assignedUser.lastName:
			return `${assignedUser.firstName} ${assignedUser.lastName}`

		case !!assignedUser.email:
			return `${assignedUser.email}`
		default:
			return assignedUser.id
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