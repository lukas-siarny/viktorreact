import React from 'react'
import * as Sentry from '@sentry/react'
import { Result, Button } from 'antd'

class ErrorBoundary extends React.Component {
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
			// TODO: texty + preklady
			return (
				<div className={'error-page-wrapper'}>
					<Result
						status='500'
						title='500'
						subTitle='Vyskytla sa neočakávaná chyba a vaša žiadosť nemôže byť dokončená. Prosím kontaktujte nás o chybe.'
						extra={
							<Button onClick={() => this.setState({ isOpen: true })} type='primary'>
								Kontaktovať o chybe
							</Button>
						}
					/>
					{this.state.isOpen &&
						Sentry.showReportDialog({
							eventId: this.state.eventId,
							successMessage: 'Vaša spätná väzba bola odoslaná. Ďakujeme!',
							title: 'Nastala neočakávaná chyba',
							subtitle: 'Prosím kontaktujte nás',
							subtitle2: '',
							labelName: 'Meno',
							labelComments: 'Popis chyby',
							labelClose: 'Zatvoriť',
							labelSubmit: 'Odoslať hlásenie o chybe',
							lang: 'sk'
						})}
				</div>
			)
		}
		return this.props.children
	}
}

export default ErrorBoundary
