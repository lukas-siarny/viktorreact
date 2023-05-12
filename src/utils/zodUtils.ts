import { z } from 'zod'
import { mapValues, omit, pick } from 'lodash'

/**
 * @link https://github.com/JacobWeisenburger/zod_utilz
 */

export function SPR<Input, Output>(
	result: z.SafeParseReturnType<Input, Output>
): {
	success: (typeof result)['success']
	data: z.SafeParseSuccess<Output>['data'] | undefined
	error: z.SafeParseError<Input>['error'] | undefined
} {
	return result.success ? { ...result, error: undefined } : { ...result, data: undefined }
}

export function partialSafeParse<Schema extends z.ZodObject<any>>(
	schema: Schema,
	input: unknown
): ReturnType<typeof SPR> & {
	successType: 'full' | 'partial' | 'none'
	validData: Partial<z.infer<Schema>>
	invalidData: Partial<z.infer<Schema>>
} {
	const result = SPR(schema.safeParse(input))
	if (result.success)
		return {
			...result,
			successType: 'full',
			validData: result.data as Partial<z.infer<Schema>>,
			invalidData: {}
		} as const

	const { fieldErrors, formErrors } = result.error?.flatten() ?? {}
	if (formErrors?.length)
		return {
			...result,
			successType: 'none',
			validData: {},
			invalidData: {}
		}

	const inputObj = input as z.infer<Schema>
	const keysWithInvalidData = Object.keys(fieldErrors ?? {})
	const validInput = omit(inputObj, keysWithInvalidData)
	const invalidData = pick(inputObj, keysWithInvalidData)

	const validData = schema.omit(mapValues(fieldErrors, () => true as const)).parse(validInput)

	return {
		...result,
		successType: 'partial',
		validData,
		invalidData
	}
}
