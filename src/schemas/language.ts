import { z } from 'zod'
import { zodErrorsToFormErrors, localizedValuesConstraint, imageConstraint } from './baseSchema'
import { FORM } from '../utils/enums'

export const languageSchema = z.object({
	nameLocalizations: localizedValuesConstraint(true),
	image: imageConstraint.array().max(1).nullish()
})

export type ILanguageForm = z.infer<typeof languageSchema>

export const validationLanguageFn = (values: ILanguageForm, props: any) => zodErrorsToFormErrors(languageSchema, FORM.LANGUAGES, values, props)
