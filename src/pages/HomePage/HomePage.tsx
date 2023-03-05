import React from 'react'

// components
import NotinoDashboard from './components/NotinoDashboard'
import PartnerDashboard from './components/PartnerDashboard'

// utils
import Permissions from '../../utils/Permissions'
import { PERMISSION } from '../../utils/enums'

const HomePage = () => {
	return (
		<Permissions
			allowed={[PERMISSION.NOTINO]}
			render={(hasPermission) => (
				<div className={'homepage-wrapper'}>
					<div className='w-full mx-auto mt-10'>{hasPermission ? <NotinoDashboard /> : <PartnerDashboard />}</div>
				</div>
			)}
		/>
	)
}

export default HomePage
