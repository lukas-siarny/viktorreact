import React from 'react'

// components
import NotinoDashboard from './components/NotinoDashboard'
import PartnerDashboard from './components/PartnerDashboard'

// utils
import Permissions from '../../utils/Permissions'
import { ADMIN_PERMISSIONS } from '../../utils/enums'

const HomePage = () => {
	return (
		<Permissions
			allowed={ADMIN_PERMISSIONS}
			render={(hasPermission) => (
				<div className={'homepage-wrapper'}>
					<div className='w-11/12 xl:w-5/6 2xl:w-3/4 3xl:w-2/3 mx-auto mt-10'>{hasPermission ? <NotinoDashboard /> : <PartnerDashboard />}</div>
				</div>
			)}
		/>
	)
}

export default HomePage
