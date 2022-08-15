import { isEqual } from 'lodash'

// types
import { IIsPublishedVersionSameAsDraft, ISalonForm } from '../../../types/interfaces'
import { ISelectedSalonPayload } from '../../../reducers/selectedSalon/selectedSalonActions'

export const getIsInitialPublishedVersionSameAsDraft = (salonData: ISelectedSalonPayload) => {
	// compare all fields that needs to be approved
	const isNameEqual = (salonData?.data?.name || null) === (salonData?.data?.publishedSalonData?.name || null)
	const isLogoEqual = isEqual(salonData?.data?.logo || null, salonData?.data?.publishedSalonData?.logo || null)
	const isGalleryEqual = isEqual(salonData?.data?.images || [], salonData?.data?.publishedSalonData?.images || [])
	const isAddressEqual = isEqual(salonData?.data?.address || null, salonData?.data?.publishedSalonData?.address || null)
	const isAboutUsFirstEqual = (salonData?.data?.aboutUsFirst || null) === (salonData?.data?.publishedSalonData?.aboutUsFirst || null)
	const isAboutUsSecondEqual = (salonData?.data?.aboutUsSecond || null) === (salonData?.data?.publishedSalonData?.aboutUsSecond || null)
	const isEmailEqual = (salonData?.data?.email || null) === (salonData?.data?.publishedSalonData?.email || null)
	const isPhoneEqual = isEqual(salonData?.data?.phones, salonData?.data?.publishedSalonData?.phones)

	return isNameEqual && isLogoEqual && isGalleryEqual && isAddressEqual && isAboutUsFirstEqual && isAboutUsSecondEqual && isPhoneEqual && isEmailEqual
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
	const isAddressNoteEqual = (formValues?.description || null) === (formValues?.publishedSalonData?.address?.description || null)
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