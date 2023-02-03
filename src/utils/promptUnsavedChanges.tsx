import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
// import ReactRouterPrompt from 'react-router-prompt'

// reducers
import { RootState } from '../reducers'
import ConfirmModal from '../atoms/ConfirmModal'

// eslint-disable-next-line import/prefer-default-export
export const withPromptUnsavedChanges = (WrappedComponent: any): any => {
	const WithPrompt = (props: any) => {
		const { submitting, form } = props
		const [t] = useTranslation()
		const message = t('loc:Chcete zahodiť vykonané zmeny?')
		const formState: any = useSelector((state: RootState) => state.form?.[form])
		const [isBlocked, setIsBlocked] = useState(false)
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
			// unblock = navigator.block(message) // TODO: zmazat
			window.addEventListener('beforeunload', onBrowserUnload)
		}
		const disable = () => {
			if (unblock) {
				unblock()
				unblock = undefined
				// setIsBlocked(true)
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
		// TODO: nefunguje
		// const prompt = (
		// 	<ReactRouterPrompt when={true}>
		// 		{({ isActive, onConfirm, onCancel }) =>
		// 			isActive && (
		// 				<div className='lightbox'>
		// 					<div className='container'>
		// 						<p>Do you really want to leave?</p>
		// 						<button type={'button'} onClick={onCancel}>
		// 							Cancel
		// 						</button>
		// 						<button type={'button'} onClick={onConfirm}>
		// 							Ok
		// 						</button>
		// 					</div>
		// 				</div>
		// 			)
		// 		}
		// 	</ReactRouterPrompt>
		// )
		const modal = (
			<ConfirmModal
				className='rounded-fields'
				title={'Opustate srtranku bez ulozenia'}
				centered
				destroyOnClose
				open={isBlocked}
				// onOk={() => dispatch(submit(FORM.CUSTOMER))}
				// open={visibleCustomerCreateModal}
				onCancel={() => setIsBlocked(false)}
				// closeIcon={<CloseIcon />}
			/>
		)
		return (
			<div>
				{modal}
				<WrappedComponent />
			</div>
		)
	}
	return WithPrompt
}
