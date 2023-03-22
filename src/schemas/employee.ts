import { z } from 'zod'
import { stringConstraint, imageConstraint, emailConstraint, zodErrorsToFormErrors, twoCharsConstraint } from './baseSchema'
import { VALIDATION_MAX_LENGTH, FORM } from '../utils/enums'

// https://notino-admin.goodrequest.dev/api/doc/#/B2b-%3Eadmin/postApiB2BAdminEmployees
export const createEmployeeSchema = z.object({
	avatar: imageConstraint.array().max(1).nullish(),
	firstName: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_50, true),
	lastName: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_50, true),
	email: emailConstraint.optional(),
	phonePrefixCountryCode: twoCharsConstraint.optional(),
	phone: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_20)
})
export const editEmployeeSchema = z
	.object({
		services: z
			.object({
				id: z.string().uuid()
			})
			.array()
	})
	.merge(createEmployeeSchema)

// editSchema + createSchema + custom types
export type IEmployeeForm = z.infer<typeof editEmployeeSchema> & { deletedAt?: string; hasActiveAccount?: boolean; service?: string[] }

export const validationEmployeeFn = (values: IEmployeeForm, props: any) =>
	zodErrorsToFormErrors(props.isEdit ? editEmployeeSchema : createEmployeeSchema, FORM.EMPLOYEE, values, props)

// https://notino-admin.goodrequest.dev/api/doc/#/B2b-%3Eadmin/postApiB2BAdminEmployeesInvite
export const inviteEmployeeSchema = z.object({
	roleID: z.string().uuid(),
	email: emailConstraint
})

export type IInviteEmployeeForm = z.infer<typeof inviteEmployeeSchema>

export const validationInviteEmployeeFn = (values: IInviteEmployeeForm, props: any) => zodErrorsToFormErrors(inviteEmployeeSchema, FORM.INVITE_EMPLOYEE, values, props)
