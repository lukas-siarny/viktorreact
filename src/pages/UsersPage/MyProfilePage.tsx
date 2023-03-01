import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

// components
import UserDetail from './components/UserDetail'

// reducers
import { RootState } from '../../reducers'
import { logOutUser, getCurrentUser } from '../../reducers/users/userActions'

// utils
import { PERMISSION } from '../../utils/enums'

const MyProfilePage = () => {
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const { data } = useSelector((state: RootState) => state.user.authUser)
	const userId = String(data?.id)

	return (
		<UserDetail
			userID={userId}
			deleteEntityName={t('loc:účet')}
			onDeleteSuccess={() => dispatch(logOutUser())}
			ignoreDeletePermissions
			submitPermissions={[PERMISSION.NOTINO, PERMISSION.PARTNER, PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_SUPER_ADMIN]}
			onPatchSuccess={() => dispatch(getCurrentUser())}
		/>
	)
}

export default MyProfilePage
