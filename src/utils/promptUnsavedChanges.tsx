import React, { useEffect, ComponentType } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
// https://github.com/remix-run/react-router/issues/8139
import { UNSAFE_NavigationContext } from 'react-router-dom'

// reducers
import { RootState } from '../reducers'

// eslint-disable-next-line import/prefer-default-export
export function withPromptUnsavedChanges(WrappedComponent: ComponentType<any>): any {
	return (props: any) => {
		const { submitting, form } = props
		const [t] = useTranslation()
		// NOTE: https://github.com/remix-run/react-router/issues/8139
		const { navigator } = React.useContext(UNSAFE_NavigationContext) as any

		const message = t('loc:Chcete zahodiť vykonané zmeny?')
		const formState: any = useSelector((state: RootState) => state.form?.[form])

		let dirty = false

		if (formState) {
			const { values, initial } = formState
			dirty = JSON.stringify(initial) !== JSON.stringify(values)
		}

		let unblock: undefined | (() => void)

		const onBrowserUnload = (event: any) => {
			// eslint-disable-next-line no-param-reassign
			event.returnValue = message
		}

		const enable = () => {
			if (unblock) unblock()
			// unblock = navigator.block(message)
			window.addEventListener('beforeunload', onBrowserUnload)
		}

		const disable = () => {
			if (unblock) {
				unblock()
				unblock = undefined
			}
			window.removeEventListener('beforeunload', onBrowserUnload)
		}

		useEffect(() => {
			if (dirty && !submitting) {
				enable()
			} else {
				disable()
			}

			return () => {
				disable()
			}
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [dirty, submitting])

		return <WrappedComponent {...props} />
	}
}
