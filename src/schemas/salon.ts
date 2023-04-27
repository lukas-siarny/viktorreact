import { z } from 'zod'

import {
	emailConstraint,
	imageConstraint,
	openingHoursConstraint,
	phoneNumbersConstraint,
	socialMediaConstraint,
	stringConstraint,
	twoCharsConstraint,
	zodErrorsToFormErrors
} from './baseSchema'
import { FORM, SALON_STATES, VALIDATION_MAX_LENGTH } from '../utils/enums'
import { AddressInputFields } from '../components/AddressFields'
import { socialMediaRegex } from '../utils/regex'

// https://notino-admin.goodrequest.dev/api/doc/#/B2b-%3Eadmin/patchApiB2BAdminSalonsSalonId
export const salonSchema = z.object({
	// name: z.union([
	// 	stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_255, true),
	// 	z.object({
	// 		id: z.string(),
	// 		name: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_255, true)
	// 	})
	// ]),

	name: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_255, true),
	aboutUsFirst: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_1000),
	openingHours: openingHoursConstraint(),
	countryCode: twoCharsConstraint,
	parkingNote: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_1000),
	locationNote: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_1000),
	phones: phoneNumbersConstraint(),
	email: emailConstraint.nullable(),
	socialLinkFB: socialMediaConstraint(socialMediaRegex.facebook, 'https://www.facebook.com/facebook'),
	socialLinkInstagram: socialMediaConstraint(socialMediaRegex.instagram, 'https://www.instagram.com/instagram'),
	socialLinkWebPage: socialMediaConstraint(socialMediaRegex.website, 'https://www.notino.com'),
	socialLinkYoutube: socialMediaConstraint(socialMediaRegex.youtube, 'https://www.youtube.com/youtube'),
	socialLinkTikTok: socialMediaConstraint(socialMediaRegex.tiktok, 'https://www.tiktok.com/tiktok'),
	socialLinkPinterest: socialMediaConstraint(socialMediaRegex.pinterest, 'https://www.pinterest.com/pinterest'),
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
