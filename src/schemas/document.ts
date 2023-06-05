import { z } from 'zod'
import { stringConstraint, zodErrorsToFormErrors, twoCharsConstraint } from './baseSchema'
import { VALIDATION_MAX_LENGTH, FORM, ASSET_TYPE } from '../utils/enums'

export const documentSchema = z.object({
	message: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_255),
	languageCode: z.any(),
	assetType: z.nativeEnum(ASSET_TYPE)
})

export type IDocumentForm = z.infer<typeof documentSchema> & {
	file: File
}

export const validationDocumentFn = (values: IDocumentForm, props: any) => zodErrorsToFormErrors(documentSchema, FORM.DOCUMENTS_FORM, values, props)
