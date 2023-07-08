import { z } from 'zod'

import { stringConstraint, zodErrorsToFormErrors, twoCharsConstraint } from './baseSchema'
import { VALIDATION_MAX_LENGTH, FORM, FILE_FILTER_DATA_TYPE } from '../utils/enums'
import { ISelectOptionItem } from '../types/interfaces'

export const documentSchema = z.object({
	message: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_255),
	languageCode: twoCharsConstraint,
	assetType: z.object({
		key: z.string(),
		value: z.string(),
		label: z.string()
	})
})

export type IDocumentForm = z.infer<typeof documentSchema> & {
	files: (File & { id: string })[]
	id?: string // Pomocne ID dokumentu aby som vedel ci aktualizujem dokument alebo nahravam novy
	assetType: ISelectOptionItem<{
		fileType: FILE_FILTER_DATA_TYPE
		mimeTypes: string[]
		maxFilesCount: number
	}>
}

export const validationDocumentFn = (values: IDocumentForm, props: any) => zodErrorsToFormErrors(documentSchema, FORM.DOCUMENTS_FORM, values, props)
