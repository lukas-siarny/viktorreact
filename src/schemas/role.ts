import { z } from 'zod'

import { zodErrorsToFormErrors } from './baseSchema'
import { FORM } from '../utils/enums'

// https://notino-admin.goodrequest.dev/api/doc/?urls.primaryName=v2.2.9#/B2b-%3Eadmin/patchApiB2BAdminEmployeesEmployeeIdRole
export const employeeRoleSchema = z.object({
	roleID: z.string().uuid()
})

export const userRoleSchema = z.object({
	roleID: z.string()
})

export type IEditEmployeeRoleForm = z.infer<typeof employeeRoleSchema>

export type IEditUserRoleForm = z.infer<typeof userRoleSchema>

export const validationEditEmployeeRoleFn = (values: IEditEmployeeRoleForm, props: any) => zodErrorsToFormErrors(employeeRoleSchema, FORM.EDIT_EMPLOYEE_ROLE, values, props)

export const validationEditUserRoleFn = (values: IEditUserRoleForm, props: any) => zodErrorsToFormErrors(userRoleSchema, FORM.EDIT_USER_ROLE, values, props)
