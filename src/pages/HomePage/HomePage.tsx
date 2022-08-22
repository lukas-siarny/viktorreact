import React from 'react'

// components
import NotinoDashboard from './components/NotinoDashboard'
import PartnerDashboard from './components/PartnerDashboard'

// utils
import Permissions from '../../utils/Permissions'
import { ADMIN_PERMISSIONS } from '../../utils/enums'

const HomePage = () => {
	return (
		// <Permissions
		// 	allowed={[PERMISSION.PARTNER]}
		// 	render={(hasPermission) =>
		// 		hasPermission && isEmpty(salonOptions) ? (
		// 			<div className='flex h-full justify-center items-center'>
		// 				<div className='m-auto text-center'>
		// 					<h1 className='text-5xl font-bold'>{t('loc:Začnite vytvorením salónu')}</h1>
		// 					<Button onClick={() => history.push(t('paths:salons/create'))} type='primary' htmlType='button' className={'noti-btn'} icon={<PlusIcon />}>
		// 						{t('loc:Pridať salón')}
		// 					</Button>
		// 				</div>
		// 			</div>
		// 		) : (
		// 			<div className={'homepage-wrapper'}>
		// 				<h3 className='mt-4'>In progress...</h3>
		// 				<div className={'image'} />
		// 			</div>
		// 		)
		// 	}
		// />
		<Permissions
			allowed={ADMIN_PERMISSIONS}
			render={(hasPermission) => <div className={'homepage-wrapper'}>{hasPermission ? <NotinoDashboard /> : <PartnerDashboard />}</div>}
		/>
	)
}

export default HomePage
