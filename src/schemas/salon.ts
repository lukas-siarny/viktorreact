import { z } from 'zod'

import {
	emailConstraint,
	imageConstraint,
	openingHoursConstraint,
	phoneNumbersConstraint,
	serializeValidationMessage,
	stringConstraint,
	uuidConstraint,
	zodErrorsToFormErrors
} from './baseSchema'
import { FORM, MAP, SALON_STATES, VALIDATION_MAX_LENGTH } from '../utils/enums'
import { socialMediaRegex } from '../utils/regex'
import { AutocompleteLabelInValue } from '../types/interfaces'

// https://notino-admin.goodrequest.dev/api/doc/#/B2b-%3Eadmin/patchApiB2BAdminSalonsSalonId

/**
 * Constraint for validation URLs in social media based on regex
 * @returns validation schema
 * @param regex RegExp
 * @param url string
 */
export const socialMediaConstraint = (regex: RegExp, url: string) =>
	z.string().regex(regex, serializeValidationMessage('loc:Zadajte správny formát adresy (napr. {{url}})', { url })).nullish()

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
			// address
			zipCode: z.string().nullish(),
			latitude: z.number().nullish(),
			longitude: z.number().nullish(),
			country: z.string().nullish(),
			city: z.string().nullish(),
			street: z.string().nullish(),
			streetNumber: z.string().nullish()
		})
	)
	.superRefine((values, ctx) => {
		if (!values.street) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: serializeValidationMessage('loc:Toto pole je povinné'),
				path: ['street']
			})
		}

		if (values.street && values.street.length > VALIDATION_MAX_LENGTH.LENGTH_100) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: serializeValidationMessage('loc:Max. počet znakov je {{max}}', { max: VALIDATION_MAX_LENGTH.LENGTH_100 }),
				path: ['street']
			})
		}

		if (values.streetNumber && values.streetNumber.length > VALIDATION_MAX_LENGTH.LENGTH_100) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: serializeValidationMessage('loc:Max. počet znakov je {{max}}', { max: VALIDATION_MAX_LENGTH.LENGTH_10 }),
				path: ['streetNumber']
			})
		}

		if (!values.city) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: serializeValidationMessage('loc:Toto pole je povinné'),
				path: ['city']
			})
		}

		if (values.city && values.city.length > VALIDATION_MAX_LENGTH.LENGTH_100) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: serializeValidationMessage('loc:Max. počet znakov je {{max}}', { max: VALIDATION_MAX_LENGTH.LENGTH_100 }),
				path: ['city']
			})
		}

		if (!values.zipCode) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: serializeValidationMessage('loc:Toto pole je povinné'),
				path: ['zipCode']
			})
		}

		if (values.zipCode && values.zipCode.length > VALIDATION_MAX_LENGTH.LENGTH_10) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: serializeValidationMessage('loc:Max. počet znakov je {{max}}', { max: VALIDATION_MAX_LENGTH.LENGTH_10 }),
				path: ['zipCode']
			})
		}

		if (!values.country) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: serializeValidationMessage('loc:Toto pole je povinné'),
				path: ['country']
			})
		}

		if (values.country && values.country.length > VALIDATION_MAX_LENGTH.LENGTH_2) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: serializeValidationMessage('loc:Max. počet znakov je {{max}}', { max: VALIDATION_MAX_LENGTH.LENGTH_2 }),
				path: ['country']
			})
		}

		if (!values.longitude) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: serializeValidationMessage('loc:Toto pole je povinné'),
				path: ['longitude']
			})
		}

		if (values.longitude && values.longitude > MAP.maxLongitude) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: serializeValidationMessage('loc:Zadajte maximálne {{max}}', { max: MAP.maxLongitude }),
				path: ['longitude']
			})
		}

		if (values.longitude && values.longitude < MAP.minLongitude) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: serializeValidationMessage('loc:Zadajte minimálne {{min}}', { min: MAP.minLongitude }),
				path: ['longitude']
			})
		}

		if (!values.latitude) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: serializeValidationMessage('loc:Toto pole je povinné'),
				path: ['latitude']
			})
		}

		if (values.latitude && values.latitude > MAP.maxLongitude) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: serializeValidationMessage('loc:Zadajte maximálne {{max}}', { max: MAP.maxLongitude }),
				path: ['latitude']
			})
		}

		if (values.latitude && values.latitude < MAP.minLongitude) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: serializeValidationMessage('loc:Zadajte minimálne {{min}}', { min: MAP.minLongitude }),
				path: ['latitude']
			})
		}

		if (!(values.zipCode && values.city && values.street && values.latitude && values.longitude && values.country)) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: serializeValidationMessage(
					'loc:Adresa nie je kompletná. Uistite sa, či je vyplnené - Mesto, Ulica, PSČ a Krajina. Upresniť adresu môžete vo vyhľadávaní alebo priamo v mape.'
				),
				path: ['address']
			})
		}
	})
	.and(
		z.object({
			aboutUsFirst: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_1000),
			openingHours: openingHoursConstraint(),
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
			sameOpenHoursOverWeek: z.boolean(),
			payByCash: z.boolean().optional(),
			otherPaymentMethods: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_500),
			logo: imageConstraint.array().max(1).nullish(),
			gallery: imageConstraint.nullish().array().max(100).optional(),
			pricelists: imageConstraint.array().nullish(),
			cosmeticIDs: uuidConstraint.array().max(VALIDATION_MAX_LENGTH.LENGTH_20).optional(),
			languageIDs: uuidConstraint.array().max(VALIDATION_MAX_LENGTH.LENGTH_10).optional()
		})
	)

// NOTE: adresa je validovana cez inline validacie v AddressFields
export type ISalonForm = z.infer<typeof salonSchema> & {
	id: string | null
	state?: SALON_STATES
	openOverWeekend: boolean
	categoryIDs: [string, ...string[]] | null
	name: AutocompleteLabelInValue | string | null
}

export const validationSalonFn = (values: ISalonForm, props: any) => zodErrorsToFormErrors(salonSchema, FORM.SALON, values, props)
