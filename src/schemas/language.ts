import { z } from 'zod'
import { zodErrorsToFormErrors, localizedValuesConstraint } from './baseSchema'
import { FORM } from '../utils/enums'

export const languageSchema = z.object({
	image: z.string().uuid().nullish(),
	nameLocalizations: localizedValuesConstraint(true)
})

export type ILanguageForm = z.infer<typeof languageSchema>

export const validationLanguageFn = (values: ILanguageForm, props: any) => zodErrorsToFormErrors(languageSchema, FORM.LANGUAGES, values, props)
