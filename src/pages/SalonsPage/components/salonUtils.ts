import { isEmpty, isEqual, map } from 'lodash'

// types
import { IIsPublishedVersionSameAsDraft, ISalonForm, OpeningHours } from '../../../types/interfaces'
import { ISalonPayloadData, ISelectedSalonPayload } from '../../../reducers/selectedSalon/selectedSalonActions'
import { IBasicSalon } from '../../../reducers/salons/salonsActions'

// enums
import { SALON_STATES } from '../../../utils/enums'

// components
import { checkSameOpeningHours, checkWeekend, initOpeningHours, orderDaysInWeek } from '../../../components/OpeningHours/OpeninhHoursUtils'

export const getIsInitialPublishedVersionSameAsDraft = (salonData: ISelectedSalonPayload) => {
	// compare all fields that needs to be approved
	const isNameEqual = (salonData.data?.name || null) === (salonData.data?.publishedSalonData?.name || null)
	const isLogoEqual = isEqual(salonData.data?.logo || null, salonData.data?.publishedSalonData?.logo || null)
	const isGalleryEqual = isEqual(salonData.data?.images || [], salonData.data?.publishedSalonData?.images || [])
	const isAddressEqual = isEqual(salonData.data?.address || null, salonData.data?.publishedSalonData?.address || null)
	const isAddressNoteEqual = (salonData.data?.locationNote || null) === (salonData.data?.publishedSalonData?.locationNote || null)
	const isAboutUsFirstEqual = (salonData.data?.aboutUsFirst || null) === (salonData.data?.publishedSalonData?.aboutUsFirst || null)
	const isAboutUsSecondEqual = (salonData.data?.aboutUsSecond || null) === (salonData.data?.publishedSalonData?.aboutUsSecond || null)
	const isEmailEqual = (salonData.data?.email || null) === (salonData.data?.publishedSalonData?.email || null)
	const isPhoneEqual = isEqual(salonData.data?.phones, salonData.data?.publishedSalonData?.phones)

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
	const openOverWeekend: boolean = checkWeekend(salonData.openingHours)
	const sameOpenHoursOverWeek: boolean = checkSameOpeningHours(salonData.openingHours)
	const openingHours: OpeningHours = initOpeningHours(salonData.openingHours, sameOpenHoursOverWeek, openOverWeekend)?.sort(orderDaysInWeek) as OpeningHours
	// pre sprave zobrazenie informacnych hlasok a disabled stavov submit buttonov je potrebne dat pozor, aby isPristine fungovalo spravne = teda pri pridavani noveho fieldu je to potrebne vzdy skontrolovat
	// napr. ak pride z BE aboutUsFirst: undefined, potom prepisem hodnotu vo formulari a opat ju vymazem, tak do reduxu sa ta prazdna hodnota uz neulozi ako undeifned ale ako null
	// preto maju vsetky inicializacne hodnoty, pre textFieldy a textAreaFieldy fallback || null (pozri impementaciu tychto komponentov, preco sa to tam takto uklada)
	const initialData: ISalonForm = {
		salonNameFromSelect,
		id: salonData.id || null,
		state: salonData.state as SALON_STATES,
		name: salonData.name || null,
		nameSelect:
			{
				key: salonData.id,
				label: salonData.name || null,
				value: salonData.id || null
			} || null,
		email: salonData.email || null,
		payByCard: !!salonData.payByCard,
		otherPaymentMethods: salonData.otherPaymentMethods || null,
		aboutUsFirst: salonData.aboutUsFirst || null,
		aboutUsSecond: salonData.aboutUsSecond || null,
		openOverWeekend,
		sameOpenHoursOverWeek,
		openingHours,
		note: salonData.openingHoursNote?.note || null,
		noteFrom: salonData.openingHoursNote?.validFrom || null,
		noteTo: salonData.openingHoursNote?.validTo || null,
		latitude: salonData.address?.latitude ?? null,
		longitude: salonData.address?.longitude ?? null,
		city: salonData.address?.city || null,
		street: salonData.address?.street || null,
		zipCode: salonData.address?.zipCode || null,
		country: salonData.address?.countryCode || null,
		streetNumber: salonData.address?.streetNumber || null,
		locationNote: salonData.locationNote || null,
		parkingNote: salonData.parkingNote || null,
		companyContactPerson: {
			email: salonData.companyContactPerson?.email || null,
			firstName: salonData.companyContactPerson?.firstName || null,
			lastName: salonData.companyContactPerson?.lastName || null,
			phonePrefixCountryCode: salonData.companyContactPerson?.phonePrefixCountryCode || phonePrefixCountryCode,
			phone: salonData.companyContactPerson?.phone || null
		},
		companyInfo: {
			taxID: salonData.companyInfo?.taxID || null,
			businessID: salonData.companyInfo?.businessID || null,
			companyName: salonData.companyInfo?.companyName || null,
			vatID: salonData.companyInfo?.vatID || null
		},
		phones:
			salonData.phones && !isEmpty(salonData.phones)
				? salonData.phones.map((phone) => ({
						phonePrefixCountryCode: phone.phonePrefixCountryCode || null,
						phone: phone.phone || null
				  }))
				: getPhoneDefaultValue(phonePrefixCountryCode),
		gallery: map(salonData.images, (image) => ({ thumbUrl: image?.resizedImages?.thumbnail, url: image?.original, uid: image?.id })),
		pricelists: map(salonData.pricelists, (file) => ({ url: file?.original, uid: file?.id })),
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
		socialLinkPinterest: salonData.socialLinkPinterest || null,
		publishedSalonData: {
			name: salonData.publishedSalonData?.name || null,
			aboutUsFirst: salonData.publishedSalonData?.aboutUsFirst || null,
			aboutUsSecond: salonData.publishedSalonData?.aboutUsSecond || null,
			email: salonData.publishedSalonData?.email || null,
			address: {
				countryCode: salonData.publishedSalonData?.address?.countryCode || null,
				zipCode: salonData.publishedSalonData?.address?.zipCode || null,
				city: salonData.publishedSalonData?.address?.city || null,
				street: salonData.publishedSalonData?.address?.street || null,
				streetNumber: salonData.publishedSalonData?.address?.streetNumber || null,
				latitude: salonData.publishedSalonData?.address?.latitude ?? null,
				longitude: salonData.publishedSalonData?.address?.longitude ?? null
			},
			locationNote: salonData.publishedSalonData?.locationNote || null,
			gallery: map(salonData.publishedSalonData?.images, (image) => ({ thumbUrl: image?.resizedImages?.thumbnail, url: image?.original, uid: image?.id })),
			logo: salonData.publishedSalonData?.logo
				? [
						{
							uid: salonData.publishedSalonData.logo.id,
							url: salonData.publishedSalonData.logo.original,
							thumbUrl: salonData.publishedSalonData.logo?.resizedImages?.thumbnail
						}
				  ]
				: null,
			pricelists: map(salonData.publishedSalonData?.pricelists, (file) => ({ url: file?.original, uid: file?.id })),
			phones:
				salonData.publishedSalonData?.phones && !isEmpty(salonData.publishedSalonData?.phones)
					? salonData.publishedSalonData.phones.map((phone) => ({
							phonePrefixCountryCode: phone.phonePrefixCountryCode || null,
							phone: phone.phone || null
					  }))
					: getPhoneDefaultValue(phonePrefixCountryCode)
		}
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
		companyContactPerson: {
			phonePrefixCountryCode
		},
		phones: getPhoneDefaultValue(phonePrefixCountryCode)
	}
}
