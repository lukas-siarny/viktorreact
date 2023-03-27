import { z } from 'zod'

import { zodErrorsToFormErrors } from './baseSchema'
import { FORM } from '../utils/enums'

// https://notino-admin.goodrequest.dev/api/doc/?urls.primaryName=v2.2.9#/B2b-%3Eadmin/patchApiB2BAdminEmployeesEmployeeIdRole
export const employeeRoleSchema = z.object({
	roleID: z.string().uuid()
})

export type IEditEmployeeRoleForm = z.infer<typeof employeeRoleSchema>

export const validationEditEmployeeRoleFn = (values: IEditEmployeeRoleForm, props: any) => zodErrorsToFormErrors(employeeRoleSchema, FORM.EDIT_EMPLOYEE_ROLE, values, props)
