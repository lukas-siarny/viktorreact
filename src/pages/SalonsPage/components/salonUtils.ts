import { isEmpty, map } from 'lodash'

// types
import { ISalonForm, OpeningHours } from '../../../types/interfaces'
import { ISalonPayloadData } from '../../../reducers/selectedSalon/selectedSalonActions'
import { IBasicSalon } from '../../../reducers/salons/salonsActions'

// enums
import { SALON_STATES } from '../../../utils/enums'

// components
import { checkSameOpeningHours, checkWeekend, initOpeningHours, orderDaysInWeek } from '../../../components/OpeningHours/OpeninhHoursUtils'

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
		// categoryIDs for basic salon
		categoryIDs: (isEmpty(!salonData?.categories) ? salonData?.categories.map((category) => category.id) : null) as ISalonForm['categoryIDs'],
		payByCard: !!salonData.payByCard,
		payByCash: !!salonData?.payByCash,
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
		phones:
			salonData.phones && !isEmpty(salonData.phones)
				? salonData.phones.map((phone) => ({
						phonePrefixCountryCode: phone.phonePrefixCountryCode || null,
						phone: phone.phone || null
				  }))
				: getPhoneDefaultValue(phonePrefixCountryCode),
		gallery: map(salonData.images, (image) => ({ thumbUrl: image?.resizedImages?.thumbnail, url: image?.original, uid: image?.id })),
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
