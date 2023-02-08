import React, { FC, PropsWithChildren, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Spin } from 'antd'
import { get } from 'lodash'
import { useNavigate } from 'react-router-dom'

import * as Sentry from '@sentry/react'

// utils
import { setIntervalImmediately } from '../utils/helper'
import { REFRESH_TOKEN_INTERVAL, PERMISSION } from '../utils/enums'
import { checkPermissions } from '../utils/Permissions'
import Navigator from '../utils/navigation'

// redux
import { RootState } from '../reducers'
import { refreshToken } from '../reducers/users/userActions'
import { getCountries, getCurrencies } from '../reducers/enumerations/enumerationActions'
import { selectSalon } from '../reducers/selectedSalon/selectedSalonActions'

type Props = PropsWithChildren

const AppInit = (props: Props) => {
	const dispatch = useDispatch()
	const currentUser = useSelector((state: RootState) => state.user.authUser)
	const selectedSalon = useSelector((state: RootState) => state.selectedSalon.selectedSalon.data)
	const [loading, setLoading] = useState<boolean>(true)
	const navigate = useNavigate()

	useEffect(() => {
		Navigator.init(navigate)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

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

	useEffect(() => {
		Sentry.setUser(currentUser.data ? { id: currentUser.data.id } : null)

		return () => {
			Sentry.setUser(null)
		}
	}, [currentUser.data])

	return loading ? (
		<div className={'suspense-loading-spinner'}>
			<Spin size='large' />
		</div>
	) : (
		<>{props.children}</>
	)
}

export default AppInit
