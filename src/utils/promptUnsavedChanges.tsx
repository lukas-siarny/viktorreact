import React, { useEffect, ComponentType } from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

// eslint-disable-next-line import/prefer-default-export
export function withPromptUnsavedChanges(WrappedComponent: ComponentType<RouteComponentProps<any>> | ComponentType<any>): any {
	return withRouter((props: any) => {
		const { dirty, history, submitting } = props
		const [t] = useTranslation()
		const message = t('loc:Chcete zahodiť vykonané zmeny?')

		let unblock: undefined | (() => void)

		const onBrowserUnload = (event: any) => {
			// eslint-disable-next-line no-param-reassign
			event.returnValue = message
		}

		const enable = () => {
			if (unblock) unblock()
			unblock = history.block(message)
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
	})
}
