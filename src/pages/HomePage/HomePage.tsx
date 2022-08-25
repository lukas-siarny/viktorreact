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
			render={(hasPermission) => <div className={'homepage-wrapper'}>{hasPermission ? <NotinoDashboard /> : <PartnerDashboard />}</div>}
		/>
	)
}

export default HomePage
