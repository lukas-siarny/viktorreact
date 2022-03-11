import React, { FC, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Button, Row } from 'antd'
import decode from 'jwt-decode'
import { get, isEmpty } from 'lodash'
import { initialize, submit } from 'redux-form'

// components
import UserAccountFrom from './components/UserAccountFrom'

// enums
import { FORM } from '../../utils/enums'

// auth
import { getAccessToken } from '../../utils/auth'

// reducers
import { RootState } from '../../reducers'
import { getUserAccountDetails } from '../../reducers/users/userActions'
import { patchReq } from '../../utils/request'

type Props = {
	userID?: number
}

const UserAccountPage: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { userID } = props
	const dispatch = useDispatch()
	const [userId, setUserId] = useState<number>()
	const [submitting, setSubmitting] = useState<boolean>(false)
	const token: string = getAccessToken() || ''

	const userAccountDetail = useSelector((state: RootState) => state.user.user)

	useEffect(() => {
		let uid: number = userID || -1
		if (!userID) {
			// decompose uid from token
			const payload = decode(token)
			uid = get(payload, 'uid')
		}
		setUserId(uid)
		dispatch(getUserAccountDetails(uid))
	}, [userID])

	// init forms
	useEffect(() => {
		dispatch(initialize(FORM.USER_ACCOUNT_FORM, { ...userAccountDetail.data?.user, ...userAccountDetail.data?.user?.company}))
	}, [userAccountDetail.data])

	const handleUserAccountFormSubmit = async (data: any) => {
		try {
			if (userId !== undefined && userId !== null && userId >= 0) {
				setSubmitting(true)
				await Promise.all([ patchReq('/api/b2b/admin/users/{userID}', { userID: userId }, {
					firstName: data?.firstName,
					lastName: data?.lastName,
					phonePrefixCountryCode: data?.phonePrefixCountryCode,
					phone: data?.phone
				}),
				patchReq('/api/b2b/admin/users/{userID}/company-profile', { userID: userId }, {
					businessID: data?.businessID,
					vatID: data?.vatID,
					companyName: data?.companyName,
					zipCode: data?.zipCode,
					city: data?.city,
					street: data?.street,
					countryCode: data?.countryCode
				}) ])
			}
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.error(error.message)
		} finally {
			setSubmitting(false)
		}
	}


	return <div className='content-body small'>
		<UserAccountFrom onSubmit={handleUserAccountFormSubmit} isCompany={!isEmpty(userAccountDetail.data?.user?.company)}/>
		<Row justify='center'>
			<Button
				type={'primary'}
				block size={'large'}
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
}

export default UserAccountPage
