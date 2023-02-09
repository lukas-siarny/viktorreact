import React, { PropsWithChildren } from 'react'
import * as Sentry from '@sentry/react'
import { Result, Button } from 'antd'
import i18next from 'i18next'

import { ERROR_BOUNDARY_TEXTS } from '../utils/enums'

class ErrorBoundary extends React.Component<PropsWithChildren, any> {
	state = {
		error: null,
		eventId: null as any,
		isOpen: false
	}

	static getDerivedStateFromError() {
		return { hasError: true }
	}

	componentDidCatch(error: any, errorInfo: any) {
		this.setState({ error })
		Sentry.withScope((scope: any) => {
			scope.setExtras(errorInfo)
			const eventId = Sentry.captureException(error)
			this.setState({ eventId })
		})
	}

	render() {
		if (this.state.error) {
			const { language } = i18next
			const texts = ERROR_BOUNDARY_TEXTS()

			return (
				<div className={'error-page-wrapper'}>
					<>
						<Result
							status='500'
							title='500'
							subTitle={texts.result.subtitle}
							extra={
								<Button onClick={() => this.setState({ isOpen: true })} type='primary'>
									{texts.result.buttonLabel}
								</Button>
							}
						/>
						{this.state.isOpen &&
							Sentry.showReportDialog({
								eventId: this.state.eventId,
								successMessage: texts.reportDialog.successMessage,
								title: texts.reportDialog.title,
								subtitle: texts.reportDialog.subtitle,
								subtitle2: '',
								labelName: texts.reportDialog.labelName,
								labelComments: texts.reportDialog.labelComments,
								labelClose: texts.reportDialog.labelClose,
								labelSubmit: texts.reportDialog.labelSubmit,
								lang: language
							})}
					</>
				</div>
			)
		}
		return this.props.children
	}
}

export default ErrorBoundary
