import React, { useState } from 'react'
import { Button } from 'antd'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

// components
import ActivationForm from './components/ActivationForm'

// utils
import { postReq } from '../../utils/request'
import { history, getPath } from '../../utils/history'

// reducers
import { RootState } from '../../reducers'

// interfaces
import { IActivationForm } from '../../types/interfaces'

const ActivationPage = () => {
	const { t } = useTranslation()
	const [submitting, setSubmitting] = useState<boolean>(false)
	const userMail = useSelector((state: RootState) => state.user.authUser.data?.email)

	const handleSubmit = async (values: IActivationForm) => {
		setSubmitting(true)

		try {
			await postReq('/api/b2b/admin/users/activation', undefined, values)
			history.push(getPath(t('paths:index')))
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.log(error.message)
		} finally {
			setSubmitting(false)
		}
	}

	const resendPin = async () => {
		setSubmitting(true)
		try {
			await postReq('/api/b2b/admin/users/activation-resend', undefined, undefined)
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.log(error.message)
		} finally {
			setSubmitting(false)
		}
	}

	return (
		<div className='grid place-items-center h-full w-full text-center'>
			<div style={{ width: '320px', height: '340px' }}>
				<h3>{t('loc:Verifikácia')}</h3>
				<p className='base-regular mt-7 mb-14'>
					<span className='base-bold'>{t('loc:Zadajte PIN')}</span>{' '}
					{t('loc:ktorý sme vám odoslali vo verifikačnom emaily na adresu {{email}}', {
						email: userMail
					})}
				</p>
				<ActivationForm onSubmit={handleSubmit} submitting={submitting} />
				<Button type={'link'} htmlType={'button'} onClick={resendPin} className='mt-4'>
					{t('loc:Znovu vyžiadať PIN')}
				</Button>
			</div>
		</div>
	)
}

export default ActivationPage
