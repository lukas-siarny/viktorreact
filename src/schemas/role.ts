import { z } from 'zod'

import { zodErrorsToFormErrors } from './baseSchema'
import { FORM } from '../utils/enums'

// https://notino-admin.goodrequest.dev/api/doc/?urls.primaryName=v2.2.9#/B2b-%3Eadmin/patchApiB2BAdminEmployeesEmployeeIdRole
export const roleSchema = z.object({
	roleID: z.string().uuid()
})

export type IEditRoleForm = z.infer<typeof roleSchema>

export const validationEditRoleFn = (values: IEditRoleForm, props: any) => zodErrorsToFormErrors(roleSchema, FORM.EDIT_EMPLOYEE_ROLE, values, props)
