import { z } from 'zod'

import { stringConstraint, zodErrorsToFormErrors, twoCharsConstraint } from './baseSchema'
import { VALIDATION_MAX_LENGTH, FORM, ASSET_TYPE } from '../utils/enums'

export const documentSchema = z.object({
	message: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_255),
	languageCode: twoCharsConstraint,
	assetType: z.nativeEnum(ASSET_TYPE) // TODO: spravit labelInValue obnejjt + extra
})

export type IDocumentForm = z.infer<typeof documentSchema> & {
	files: (File & { id: string })[]
	id?: string // Pomocne ID dokumentu aby som vedel ci aktualizujem dokument alebo nahravam novy
}

export const validationDocumentFn = (values: IDocumentForm, props: any) => zodErrorsToFormErrors(documentSchema, FORM.DOCUMENTS_FORM, values, props)
