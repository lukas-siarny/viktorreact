import { isEqual } from 'lodash'
import dayjs from 'dayjs'
import i18next from 'i18next'

// types
import { IIsPublishedVersionSameAsDraft, ISalonForm } from '../../../types/interfaces'
import { ISelectedSalonPayload } from '../../../reducers/selectedSalon/selectedSalonActions'

export const getIsInitialPublishedVersionSameAsDraft = (salonData: ISelectedSalonPayload) => {
	// compare all fields that needs to be approved
	const isNameEqual = (salonData?.data?.name || null) === (salonData?.data?.publishedSalonData?.name || null)
	const isLogoEqual = isEqual(salonData?.data?.logo || null, salonData?.data?.publishedSalonData?.logo || null)
	const isGalleryEqual = isEqual(salonData?.data?.images || [], salonData?.data?.publishedSalonData?.images || [])
	const isAddressEqual = isEqual(salonData?.data?.address || null, salonData?.data?.publishedSalonData?.address || null)
	const isAddressNoteEqual = (salonData?.data?.locationNote || null) === (salonData?.data?.publishedSalonData?.locationNote || null)
	const isAboutUsFirstEqual = (salonData?.data?.aboutUsFirst || null) === (salonData?.data?.publishedSalonData?.aboutUsFirst || null)
	const isAboutUsSecondEqual = (salonData?.data?.aboutUsSecond || null) === (salonData?.data?.publishedSalonData?.aboutUsSecond || null)
	const isEmailEqual = (salonData?.data?.email || null) === (salonData?.data?.publishedSalonData?.email || null)
	const isPhoneEqual = isEqual(salonData?.data?.phones, salonData?.data?.publishedSalonData?.phones)

	return isNameEqual && isLogoEqual && isGalleryEqual && isAddressEqual && isAboutUsFirstEqual && isAboutUsSecondEqual && isPhoneEqual && isEmailEqual && isAddressNoteEqual
}

export const getIsPublishedVersionSameAsDraft = (formValues: ISalonForm): IIsPublishedVersionSameAsDraft => {
	// compare all fields that needs to be approved
	const addressPublished = {
		countryCode: formValues?.publishedSalonData?.address?.countryCode || null,
		zipCode: formValues?.publishedSalonData?.address?.zipCode || null,
		city: formValues?.publishedSalonData?.address?.city || null,
		street: formValues?.publishedSalonData?.address?.street || null,
		streetNumber: formValues?.publishedSalonData?.address?.streetNumber || null,
		latitude: formValues?.publishedSalonData?.address?.latitude ?? null,
		longitude: formValues?.publishedSalonData?.address?.longitude ?? null
	}
	const addressDraft = {
		countryCode: formValues?.country,
		zipCode: formValues?.zipCode,
		city: formValues?.city,
		street: formValues?.street,
		streetNumber: formValues?.streetNumber,
		latitude: formValues?.latitude,
		longitude: formValues?.longitude
	}

	const isNameEqual = (formValues?.name || null) === (formValues?.publishedSalonData?.name || null)
	const isLogoEqual = isEqual(formValues?.logo || null, formValues?.publishedSalonData?.logo || null)
	const isGalleryEqual = isEqual(formValues?.gallery || [], formValues?.publishedSalonData?.gallery || [])
	const isAddressEqual = isEqual(addressDraft, addressPublished)
	const isAddressNoteEqual = (formValues?.locationNote || null) === (formValues?.publishedSalonData?.locationNote || null)
	const isAboutUsFirstEqual = (formValues?.aboutUsFirst || null) === (formValues?.publishedSalonData?.aboutUsFirst || null)
	const isAboutUsSecondEqual = (formValues?.aboutUsSecond || null) === (formValues?.publishedSalonData?.aboutUsSecond || null)
	const isPhoneEqual = isEqual(formValues?.phones, formValues?.publishedSalonData?.phones)
	const isEmailEqual = (formValues?.email || null) === (formValues?.publishedSalonData?.email || null)
	const isPriceListsEqual = isEqual(formValues?.pricelistIDs || [], formValues?.publishedSalonData?.pricelists || [])

	return {
		isEqual:
			isNameEqual && isLogoEqual && isGalleryEqual && isAddressEqual && isAddressNoteEqual && isAboutUsFirstEqual && isAboutUsSecondEqual && isPhoneEqual && isEmailEqual,
		isNameEqual,
		isLogoEqual,
		isGalleryEqual,
		isAddressEqual,
		isAddressNoteEqual,
		isAboutUsFirstEqual,
		isAboutUsSecondEqual,
		isPhoneEqual,
		isEmailEqual,
		isPriceListsEqual
	}
}

export type ValueAndUnit = {
	value: number
	unit: 'hour' | 'week'
	name: string
}

export const intervals: ValueAndUnit[] = [
	{ name: i18next.t('loc:24 hodín'), value: 24, unit: 'hour' },
	{ name: i18next.t('loc:48 hodín'), value: 48, unit: 'hour' },
	{ name: i18next.t('loc:Týždeň'), value: 1, unit: 'week' }
]

export const getSalonFilterRanges = (values: ValueAndUnit[]): { [key: string]: dayjs.Dayjs[] } => {
	const now = dayjs()
	return values.reduce((ranges, value) => {
		return {
			...ranges,
			[value.name]: [now.subtract(value.value, value.unit), now]
		}
	}, {})
}
