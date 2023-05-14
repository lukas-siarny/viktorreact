import { z } from 'zod'
import { emailConstraint, imageConstraint, stringConstraint, twoCharsConstraint, uuidConstraint, zodErrorsToFormErrors } from './baseSchema'
import { FORM, VALIDATION_MAX_LENGTH } from '../utils/enums'

// https://notino-admin.goodrequest.dev/api/doc/#/B2b-%3Eadmin/patchApiB2BAdminUsersUserId
export const editUserSchema = z.object({
	firstName: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_100),
	lastName: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_100),
	phonePrefixCountryCode: twoCharsConstraint,
	phone: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_20, true),
	avatar: imageConstraint.array().max(1).nullish(),
	assignedCountryCode: twoCharsConstraint.optional()
})

export type IUserAccountForm = z.infer<typeof editUserSchema>

export const validationEditUserFn = (values: IUserAccountForm, props: any) => zodErrorsToFormErrors(editUserSchema, FORM.USER_ACCOUNT, values, props)

// https://notino-admin.goodrequest.dev/api/doc/#/B2b-%3Eadmin/postApiB2BAdminUsers
export const createUserSchema = z.object({
	email: emailConstraint,
	phonePrefixCountryCode: twoCharsConstraint,
	phone: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_20, true),
	roleID: uuidConstraint,
	assignedCountryCode: twoCharsConstraint.optional()
})
export type ICreateUserForm = z.infer<typeof createUserSchema>

export const validationCreateUserFn = (values: IUserAccountForm, props: any) => zodErrorsToFormErrors(createUserSchema, FORM.ADMIN_CREATE_USER, values, props)
