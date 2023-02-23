import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

// reducers
import { RootState } from '../../reducers'

type Props = {}

const MyProfilePage = (props: Props) => {
	const [t] = useTranslation()
	const authUser = useSelector((state: RootState) => state.user.authUser)

	return <div>MyProfilePage</div>
}

export default MyProfilePage
