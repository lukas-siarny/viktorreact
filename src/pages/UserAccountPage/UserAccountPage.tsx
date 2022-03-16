import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Button, Row } from 'antd'
import { get, isEmpty } from 'lodash'
import { initialize, submit } from 'redux-form'

// components
import UserAccountFrom from './components/UserAccountFrom'

// enums
import { FORM } from '../../utils/enums'

// reducers
import { RootState } from '../../reducers'
import { getCurrentUser } from '../../reducers/users/userActions'
import { patchReq } from '../../utils/request'

const UserAccountPage = () => {
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const [submitting, setSubmitting] = useState<boolean>(false)

	const userAccountDetail = useSelector((state: RootState) => state.user.authUser)

	useEffect(() => {
		dispatch(getCurrentUser())
	}, [dispatch])

	// init forms
	useEffect(() => {
		dispatch(initialize(FORM.USER_ACCOUNT_FORM, { ...userAccountDetail.data, ...userAccountDetail.data?.company }))
	}, [userAccountDetail.data, dispatch])

	const handleUserAccountFormSubmit = async (data: any) => {
		try {
			setSubmitting(true)
			const userId = get(userAccountDetail, 'data.id')

			await Promise.all([
				patchReq(
					'/api/b2b/admin/users/{userID}',
					{ userID: userId },
					{
						firstName: data?.firstName,
						lastName: data?.lastName,
						phonePrefixCountryCode: data?.phonePrefixCountryCode,
						phone: data?.phone
					}
				),
				patchReq(
					'/api/b2b/admin/users/{userID}/company-profile',
					{ userID: userId },
					{
						businessID: data?.businessID,
						vatID: data?.vatID,
						companyName: data?.companyName,
						zipCode: data?.zipCode,
						city: data?.city,
						street: data?.street,
						countryCode: data?.countryCode
					}
				)
			])
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.error(error.message)
		} finally {
			setSubmitting(false)
		}
	}

	return (
		<div className='content-body small'>
			<UserAccountFrom onSubmit={handleUserAccountFormSubmit} isCompany={!isEmpty(userAccountDetail.data?.company)} />
			<Row justify='center'>
				<Button
					type={'primary'}
					block
					size={'large'}
					className={`not-btn m-regular mt-4 mb-4 w-1/3`}
					htmlType={'submit'}
					onClick={() => {
						dispatch(submit(FORM.USER_ACCOUNT_FORM))
					}}
					disabled={submitting}
					loading={submitting}
				>
					{t('loc:Uložiť')}
				</Button>
			</Row>
		</div>
	)
}

export default UserAccountPage
