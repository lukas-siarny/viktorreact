import React from 'react'
import { useSelector } from 'react-redux'
import { includes } from 'lodash'
import { Navigate } from 'react-router'

// components
import NotinoDashboard from './components/NotinoDashboard'
import PartnerDashboard from './components/PartnerDashboard'
import PreventShowDeletedSalon from '../../utils/PreventShowDeletedSalon'

// utils
import Permissions from '../../utils/Permissions'
import { PERMISSION } from '../../utils/enums'

// types
import { RootState } from '../../reducers'

const HomePage = () => {
	const currentUser = useSelector((state: RootState) => state.user.authUser)
	const selectedSalon = useSelector((state: RootState) => state.selectedSalon.selectedSalon.data)

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
						if (currentUser?.isLoading) {
							return null
						}

						const isPartnerAllowedToViewSalon = includes(
							currentUser.data?.salons.map((salon) => salon.id),
							selectedSalon?.id
						)

						if (!isPartnerAllowedToViewSalon) {
							return <Navigate to={'/403'} />
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
