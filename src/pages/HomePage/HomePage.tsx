import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { includes } from 'lodash'
import { useNavigate } from 'react-router'

// components
import NotinoDashboard from './components/NotinoDashboard'
import PartnerDashboard from './components/PartnerDashboard'
import PreventShowDeletedSalon from '../../utils/PreventShowDeletedSalon'

// utils
import Permissions, { checkPermissions } from '../../utils/Permissions'
import { PERMISSION } from '../../utils/enums'

// types
import { RootState } from '../../reducers'

const HomePage = () => {
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const currentUser = useSelector((state: RootState) => state.user.authUser)
	const selectedSalon = useSelector((state: RootState) => state.selectedSalon.selectedSalon)

	useEffect(() => {
		if (currentUser.isLoading || selectedSalon?.isLoading || !selectedSalon?.data?.id) {
			return
		}
		if (currentUser.data) {
			// Only NOTINO users or PARTNER with assigned salon
			if (
				checkPermissions(currentUser.data.uniqPermissions, [PERMISSION.NOTINO]) ||
				(selectedSalon?.data?.id &&
					includes(
						currentUser.data.salons.map((salon) => salon.id),
						selectedSalon?.data?.id
					))
			) {
				return
			}

			navigate('/403')
		}
	}, [currentUser, selectedSalon?.data?.id, selectedSalon?.isLoading, navigate, dispatch])

	return (
		<div className={'homepage-wrapper'}>
			<div className='w-full mx-auto'>
				<Permissions
					allowed={[PERMISSION.NOTINO]}
					render={(hasPermission) => {
						// admin view
						if (hasPermission) {
							return (
								<PreventShowDeletedSalon>
									<NotinoDashboard />
								</PreventShowDeletedSalon>
							)
						}

						// partner view
						if (currentUser?.isLoading || selectedSalon?.isLoading) {
							return null
						}

						return (
							<PreventShowDeletedSalon>
								<PartnerDashboard />
							</PreventShowDeletedSalon>
						)
					}}
				/>
			</div>
		</div>
	)
}

export default HomePage
