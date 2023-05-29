import { z } from 'zod'
import { stringConstraint, zodErrorsToFormErrors } from './baseSchema'
import { FORM, VALIDATION_MAX_LENGTH } from '../utils/enums'

// https://notino-admin.goodrequest.dev/api/doc/#/B2b-%3Eadmin/patchApiB2BAdminSalonsSalonIdB2BVoucher
export const voucherSchema = z.object({
	code: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_1000, true)
})

export type IVoucherForm = z.infer<typeof voucherSchema>

export const validationVoucherFn = (values: IVoucherForm, props: any) => zodErrorsToFormErrors(voucherSchema, FORM.VOUCHER_FORM, values, props)
