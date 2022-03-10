import React, { FC, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Divider, Row } from 'antd'
import decode from 'jwt-decode'
import { get } from 'lodash'
import { initialize } from 'redux-form'

// components
import CompanyAccountForm from './components/CompanyAccountForm'
import UserAccountFrom from './components/UserAccountFrom'

// enums
import { FORM } from '../../utils/enums'

// auth
import { getAccessToken } from '../../utils/auth'

// reducers
import { RootState } from '../../reducers'
import { getUserAccountDetails } from '../../reducers/users/userActions'


type Props = {
	userID?: number
}

const UserAccountPage: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { userID } = props
	const dispatch = useDispatch()
	const token: string = getAccessToken() || ''

	const userAccountDetail = useSelector((state: RootState) => state.user.user)

	useEffect(() => {
		let uid: number = userID || -1
		if (!userID) {
			const payload = decode(token)
			uid = get(payload, 'uid')
		}
		dispatch(getUserAccountDetails(uid))
	}, [userID])

	// init forms
	useEffect(() => {
		dispatch(initialize(FORM.USER_ACCOUNT, userAccountDetail.data?.user))
		dispatch(initialize(FORM.COMPANY_ACCOUNT, userAccountDetail.data?.user?.company))
	}, [userAccountDetail.data])

	const handleFormSubmit = (data: any, formType: string) => {
		try {

		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.error(error.message)
		}
	}

	return <div className='content-body small'>
		<Row justify='center'>
			<Row justify='center'>
				{t('loc:Osobné údaje')}
				<Divider />
				<UserAccountFrom onSubmit={(data: any) => handleFormSubmit(data, FORM.USER_ACCOUNT)}/>
			</Row>
			<Row justify='center'>
				{t('loc:Firma')}
				<Divider />
				<CompanyAccountForm onSubmit={(data: any) => handleFormSubmit(data, FORM.COMPANY_ACCOUNT)}/>
			</Row>
		</Row>
	</div>
}

export default UserAccountPage
