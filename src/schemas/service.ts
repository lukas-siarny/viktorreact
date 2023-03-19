import { z } from 'zod'

import { stringConstraint, zodErrorsToFormErrors } from './baseSchema'
import { FORM, VALIDATION_MAX_LENGTH } from '../utils/enums'

// https://notino-admin.goodrequest.dev/api/doc/?urls.primaryName=v2.2.9#/B2b-%3Eadmin/postApiB2BAdminServicesCategoryServiceSuggest
export const requestNewServiceSchema = z.object({
	description: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_3000, true),
	rootCategoryID: z.string(),
	salonID: z.string()
})

export type IRequestNewServiceForm = z.infer<typeof requestNewServiceSchema>

export const validationRequestNewServiceFn = (values: IRequestNewServiceForm, props: any) =>
	zodErrorsToFormErrors(requestNewServiceSchema, FORM.REQUEST_NEW_SERVICE_FORM, values, props)
