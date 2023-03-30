import React, { useState, useEffect } from 'react'
import { Button } from 'antd'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

// components
import ActivationForm from './components/ActivationForm'

// utils
import { postReq } from '../../utils/request'

// redux
import { RootState } from '../../reducers'
import { getCurrentUser } from '../../reducers/users/userActions'

// schema
import { IActivationForm } from '../../schemas/activation'

const ActivationPage = () => {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const [submitting, setSubmitting] = useState<boolean>(false)
	const currentUser = useSelector((state: RootState) => state.user.authUser.data)

	useEffect(() => {
		if (currentUser?.activateAt) {
			navigate(t('paths:index'))
		}
	}, [t, currentUser])

	const handleSubmit = async (values: IActivationForm) => {
		setSubmitting(true)

		try {
			await postReq('/api/b2b/admin/users/activation', undefined, values)
			dispatch(getCurrentUser())
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
			<div style={{ width: '326px', height: '340px' }}>
				<h3>{t('loc:Verifikácia')}</h3>
				<p className='base-regular mt-7 mb-14'>
					<span className='base-bold'>{t('loc:Zadajte PIN')}</span>{' '}
					{t('loc:ktorý sme vám odoslali vo verifikačnom emaily na adresu {{email}}', {
						email: currentUser?.email
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
