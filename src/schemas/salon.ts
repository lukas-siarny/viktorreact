import { z } from 'zod'
import { emailConstraint, imageConstraint, stringConstraint, twoCharsConstraint, zodErrorsToFormErrors } from './baseSchema'
import { FORM, SALON_STATES, VALIDATION_MAX_LENGTH } from '../utils/enums'
import { AddressInputFields } from '../components/AddressFields'

// https://notino-admin.goodrequest.dev/api/doc/#/B2b-%3Eadmin/patchApiB2BAdminSalonsSalonId
export const salonSchema = z.object({
	// TODO: toto by sa malo dat spravit bez salonNameFromSelect
	// salonNameFromSelect
	// TODO: dorobit aj select validaciu
	name: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_255, true),
	aboutUsFirst: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_1000),
	// TODO: uniqueItems + podla OpeningHours
	openingHours: z.any(),
	countryCode: twoCharsConstraint,
	parkingNote: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_1000),
	locationNote: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_1000),
	// TODO: minItems: 1 , maxItems: 5
	phones: z.any(),
	// TODO: URL chyby
	email: emailConstraint.optional(),
	socialLinkFB: z.any(),
	socialLinkInstagram: z.any(),
	socialLinkWebPage: z.any(),
	socialLinkYoutube: z.any(),
	socialLinkTikTok: z.any(),
	socialLinkPinterest: z.any(),
	payByCard: z.boolean().optional(),
	payByCash: z.boolean().optional(),
	otherPaymentMethods: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_500),
	// TODO: imageIDs
	logo: imageConstraint.optional(),
	gallery: z.any(),
	pricelists: z.any(),
	cosmeticIDs: z.string().array().max(20).optional(),
	languageIDs: z.string().array().max(10).optional()
})

// NOTE: adresa je validovana cez inline validacie v AddressFields
export type ISalonForm = z.infer<typeof salonSchema> &
	AddressInputFields & {
		id: string | null
		state?: SALON_STATES
		sourceOfPremium?: string
		sameOpenHoursOverWeek: boolean
		openOverWeekend: boolean
		categoryIDs: [string, ...string[]] | null
		pricelistIDs?: string[]
		// address: boolean | null
		deletedAt?: boolean
		// salonNameFromSelect: boolean // TODO: zmazat
	}

export const validationSalonFn = (values: ISalonForm, props: any) => zodErrorsToFormErrors(salonSchema, FORM.SALON, values, props)
