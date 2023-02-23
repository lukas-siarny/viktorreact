import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

// components
import UserDetail from './components/UserDetail'

// reducers
import { RootState } from '../../reducers'
import { logOutUser } from '../../reducers/users/userActions'
import { PERMISSION } from '../../utils/enums'

const MyProfilePage = () => {
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const { data } = useSelector((state: RootState) => state.user.authUser)
	const userId = String(data?.id)

	const onDeleteSuccess = () => {
		dispatch(logOutUser())
		// NOTE: bez tohto navigate ostava user v aplikacii a moze sa snazit urobit nejake akcie, ktore generuju 401 error (az potom by bol redirect na Login)
		navigate(t('paths:login'))
	}

	return (
		<UserDetail
			userID={userId}
			deleteEntityName={t('loc:účet')}
			onDeleteSuccess={onDeleteSuccess}
			ignoreDeletePermissions
			submitPermissions={[PERMISSION.NOTINO, PERMISSION.PARTNER, PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_SUPER_ADMIN]}
		/>
	)
}

export default MyProfilePage
