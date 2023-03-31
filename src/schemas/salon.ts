import { z } from 'zod'
import i18next from 'i18next'
import {
	emailConstraint,
	imageConstraint,
	openingHoursConstraint,
	phoneNumbersConstraint,
	serializeValidationMessage,
	stringConstraint,
	twoCharsConstraint,
	zodErrorsToFormErrors
} from './baseSchema'
import { FORM, SALON_STATES, VALIDATION_MAX_LENGTH } from '../utils/enums'
import { AddressInputFields } from '../components/AddressFields'
import { socialMediaRegex } from '../utils/regex'

// https://notino-admin.goodrequest.dev/api/doc/#/B2b-%3Eadmin/patchApiB2BAdminSalonsSalonId
export const salonSchema = z.object({
	// TODO: dorobit aj select validaciu
	// name: string  || { name: string, id: string, label: string }
	// name: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_255, true),
	// name: z.union([
	// 	z.string(),
	// 	// stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_255, true),
	// 	z.object({
	// 		key: z.string(),
	// 		label: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_255, true),
	// 		value: z.string().nullish()
	// 	})
	// ]),
	name: z.any(),
	aboutUsFirst: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_1000),
	openingHours: openingHoursConstraint(),
	countryCode: twoCharsConstraint,
	parkingNote: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_1000),
	locationNote: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_1000),
	phones: phoneNumbersConstraint(),
	email: emailConstraint.optional(),
	socialLinkFB: z
		.string()
		.regex(socialMediaRegex.facebook, serializeValidationMessage('loc:Zadajte správny formát adresy (napr. {{url}})', { url: 'https://www.facebook.com/facebook' }))
		.nullish(),
	socialLinkInstagram: z
		.string()
		.regex(socialMediaRegex.instagram, serializeValidationMessage('loc:Zadajte správny formát adresy (napr. {{url}})', { url: 'https://www.instagram.com/instagram' }))
		.nullish(),
	socialLinkWebPage: z
		.string()
		.regex(socialMediaRegex.website, serializeValidationMessage('loc:Zadajte správny formát adresy (napr. {{url}})', { url: 'https://www.notino.com' }))
		.nullish(),
	socialLinkYoutube: z
		.string()
		.regex(socialMediaRegex.youtube, serializeValidationMessage('loc:Zadajte správny formát adresy (napr. {{url}})', { url: 'https://www.youtube.com/youtube' }))
		.nullish(),
	socialLinkTikTok: z
		.string()
		.regex(socialMediaRegex.tiktok, serializeValidationMessage('loc:Zadajte správny formát adresy (napr. {{url}})', { url: 'https://www.tiktok.com/tiktok' }))
		.nullish(),
	socialLinkPinterest: z
		.string()
		.regex(socialMediaRegex.tiktok, serializeValidationMessage('loc:Zadajte správny formát adresy (napr. {{url}})', { url: 'https://www.pinterest.com/pinterest' }))
		.nullish(),
	payByCard: z.boolean().optional(),
	payByCash: z.boolean().optional(),
	otherPaymentMethods: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_500),
	logo: imageConstraint.array().max(1).nullish(),
	gallery: imageConstraint.nullish().array().max(100).optional(),
	pricelists: z.any(),
	cosmeticIDs: z.string().array().max(VALIDATION_MAX_LENGTH.LENGTH_20).optional(),
	languageIDs: z.string().array().max(VALIDATION_MAX_LENGTH.LENGTH_10).optional()
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
		deletedAt?: boolean
	}
// const test: ISalonForm

export const validationSalonFn = (values: ISalonForm, props: any) => zodErrorsToFormErrors(salonSchema, FORM.SALON, values, props)
