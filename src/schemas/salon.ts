import { z } from 'zod'

import {
	emailConstraint,
	imageConstraint,
	openingHoursConstraint,
	phoneNumbersConstraint,
	serializeValidationMessage,
	socialMediaConstraint,
	stringConstraint,
	twoCharsConstraint,
	zodErrorsToFormErrors
} from './baseSchema'
import { FORM, SALON_STATES, VALIDATION_MAX_LENGTH } from '../utils/enums'
import { AddressInputFields } from '../components/AddressFields'
import { socialMediaRegex } from '../utils/regex'
import { AutocompleteLabelInValue } from '../types/interfaces'

// https://notino-admin.goodrequest.dev/api/doc/#/B2b-%3Eadmin/patchApiB2BAdminSalonsSalonId
export const salonSchema = z
	.object({
		salonNameFromSelect: z.boolean().nullable(),
		name: z.any()
	})
	.superRefine((values, ctx) => {
		if (!values.salonNameFromSelect) {
			if (!values.name) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: serializeValidationMessage('loc:Toto pole je povinné'),
					path: ['name']
				})
			}
			if (values.name && values.name.length > VALIDATION_MAX_LENGTH.LENGTH_255) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: serializeValidationMessage('loc:Max. počet znakov je {{max}}', { max: VALIDATION_MAX_LENGTH.LENGTH_255 }),
					path: ['name']
				})
			}
		} else {
			const name = values?.name
			if (!name || !name.label) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: serializeValidationMessage('loc:Toto pole je povinné'),
					path: ['name']
				})
			}
			if (name && name.label.length > VALIDATION_MAX_LENGTH.LENGTH_255) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: serializeValidationMessage('loc:Max. počet znakov je {{max}}', { max: VALIDATION_MAX_LENGTH.LENGTH_255 }),
					path: ['name']
				})
			}
		}
	})
	.and(
		z.object({
			aboutUsFirst: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_1000),
			openingHours: openingHoursConstraint(),
			countryCode: twoCharsConstraint,
			parkingNote: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_1000),
			locationNote: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_1000),
			phones: phoneNumbersConstraint(),
			email: emailConstraint.nullish(),
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
			pricelists: imageConstraint.array().nullish(),
			cosmeticIDs: z.string().array().max(VALIDATION_MAX_LENGTH.LENGTH_20).optional(),
			languageIDs: z.string().array().max(VALIDATION_MAX_LENGTH.LENGTH_10).optional()
		})
	)

// NOTE: adresa je validovana cez inline validacie v AddressFields
export type ISalonForm = z.infer<typeof salonSchema> &
	AddressInputFields & {
		id: string | null
		state?: SALON_STATES
		sourceOfPremium?: string
		sameOpenHoursOverWeek: boolean
		openOverWeekend: boolean
		categoryIDs: [string, ...string[]] | null
		deletedAt?: boolean
		name: AutocompleteLabelInValue | string | null
	}

export const validationSalonFn = (values: ISalonForm, props: any) => zodErrorsToFormErrors(salonSchema, FORM.SALON, values, props)
