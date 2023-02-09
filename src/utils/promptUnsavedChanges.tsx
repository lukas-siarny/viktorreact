import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { unstable_usePrompt } from 'react-router-dom'

// reducers
import { RootState } from '../reducers'

// eslint-disable-next-line import/prefer-default-export
export const withPromptUnsavedChanges = (WrappedComponent: any): any => {
	const WithPrompt = (props: any) => {
		const { form } = props
		const [t] = useTranslation()
		const message = t('loc:Chcete zahodiť vykonané zmeny?')
		const formState: any = useSelector((state: RootState) => state.form?.[form])
		let dirty = false

		if (formState) {
			const { values, initial } = formState
			dirty = JSON.stringify(initial) !== JSON.stringify(values)
		}

		unstable_usePrompt({ when: dirty, message })

		return <WrappedComponent {...props} />
	}
	return WithPrompt
}
