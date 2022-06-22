import React, { FC, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Spin } from 'antd'

// utils
import { setIntervalImmediately } from '../utils/helper'
import { REFRESH_TOKEN_INTERVAL, PERMISSION } from '../utils/enums'
import { checkPermissions } from '../utils/Permissions'

// redux
import { RootState } from '../reducers'
import { refreshToken, getCurrentUser } from '../reducers/users/userActions'
import { getCountries } from '../reducers/enumerations/enumerationActions'
import { selectSalon } from '../reducers/selectedSalon/selectedSalonActions'

const AppInit: FC = (props) => {
	const dispatch = useDispatch()
	const currentUser = useSelector((state: RootState) => state.user.authUser)
	const selectedSalon = useSelector((state: RootState) => state.selectedSalon.selectedSalon.data)
	const [loading, setLoading] = useState<boolean>(true)

	useEffect(() => {
		// set accessible enumeration data for whole app
		dispatch(getCountries())
		// TODO load Currencies

		// periodically refresh tokens
		const refreshInterval = setIntervalImmediately(async () => {
			await dispatch(refreshToken())
			if (loading) {
				setLoading(false)
			}
		}, REFRESH_TOKEN_INTERVAL)

		return () => {
			if (refreshInterval) {
				clearInterval(refreshInterval)
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dispatch])

	useEffect(() => {
		if (currentUser.data) {
			if (checkPermissions(currentUser.data.uniqPermissions, [PERMISSION.PARTNER])) {
				// TODO init state, if use doesn't have any salon
				if (!selectedSalon) {
					console.log('🚀 ~ file: AppInit.tsx ~ line 47 ~ useEffect ~ selectedSalon is EMPTY and pick 1st')
					// TODO pick 1st salon from list of salons
					dispatch(selectSalon(1))
				} else {
					console.log('🚀 ~ file: AppInit.tsx ~ line 52 ~ useEffect ~ currently selectedSalon', selectedSalon)
				}
			}
		}
	}, [currentUser, dispatch, selectedSalon])

	// useEffect(() => {
	// 	if (currentUser.data) {
	// 		if (checkPermissions(currentUser.data.uniqPermissions, [PERMISSION.PARTNER])) {
	// 			console.log('🚀 ~ file: AppInit.tsx ~ line 47 ~ useEffect ~ Dispatching salon selection')
	// 			// TODO pick 1st salon from list of salons
	// 			dispatch(selectSalon(1))
	// 		}
	// 	}
	// }, [currentUser, dispatch])

	return loading ? (
		<div className={'suspense-loading-spinner'}>
			<Spin size='large' />
		</div>
	) : (
		<>{props.children}</>
	)
}

export default AppInit
