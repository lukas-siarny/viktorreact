import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { unstable_usePrompt } from 'react-router-dom'
import { omitBy, isNil } from 'lodash'

// reducers
import { RootState } from '../reducers'

// eslint-disable-next-line import/prefer-default-export
export const withPromptUnsavedChanges = (WrappedComponent: any): any => {
	const WithPrompt = (props: any) => {
		const { form, submitting } = props
		const [t] = useTranslation()
		const message = t('loc:Chcete zahodiť vykonané zmeny?')
		const formState: any = useSelector((state: RootState) => state.form?.[form])
		let dirty = false

		if (formState) {
			const { values, initial } = formState
			const values1 = omitBy(initial, isNil)
			const values2 = omitBy(values, isNil)

			dirty = JSON.stringify(values1) !== JSON.stringify(values2)
		}

		unstable_usePrompt({ when: dirty && !submitting, message })

		return <WrappedComponent {...props} />
	}
	return WithPrompt
}
