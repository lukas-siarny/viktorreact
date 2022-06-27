import React, { FC, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Spin } from 'antd'
import { get } from 'lodash'

// utils
import { setIntervalImmediately } from '../utils/helper'
import { REFRESH_TOKEN_INTERVAL, PERMISSION } from '../utils/enums'
import { checkPermissions } from '../utils/Permissions'

// redux
import { RootState } from '../reducers'
import { refreshToken } from '../reducers/users/userActions'
import { getCountries, getCurrencies } from '../reducers/enumerations/enumerationActions'
import { selectSalon } from '../reducers/selectedSalon/selectedSalonActions'

const AppInit: FC = (props) => {
	const dispatch = useDispatch()
	const currentUser = useSelector((state: RootState) => state.user.authUser)
	const selectedSalon = useSelector((state: RootState) => state.selectedSalon.selectedSalon.data)
	const [loading, setLoading] = useState<boolean>(true)

	useEffect(() => {
		// set accessible enumeration data for whole app
		dispatch(getCountries())
		dispatch(getCurrencies())

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
				// select first salon for PARTNER
				if (!selectedSalon) {
					const salonID = get(currentUser.data, 'salons[0].id')
					dispatch(selectSalon(salonID))
				}
			}
		}
	}, [currentUser, dispatch, selectedSalon])

	return loading ? (
		<div className={'suspense-loading-spinner'}>
			<Spin size='large' />
		</div>
	) : (
		<>{props.children}</>
	)
}

export default AppInit
