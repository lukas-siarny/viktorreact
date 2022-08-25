import React, { FC, useEffect } from 'react'
import { Button } from 'antd'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import { isEmpty } from 'lodash'

// components
import SalonDashboard from './SalonDashboard'

// utils
import { history } from '../../../utils/history'

// redux
import { RootState } from '../../../reducers'
import { getCurrentUser, getPendingInvites } from '../../../reducers/users/userActions'

// assets
import { ReactComponent as PlusIcon } from '../../../assets/icons/plus-icon.svg'

type Props = {}

const PartnerDashboard: FC<Props> = () => {
	const [t] = useTranslation()
	const dispatch = useDispatch()

	const salonOptions = useSelector((state: RootState) => state.selectedSalon.selectionOptions.data)
	const pendingInvites = useSelector((state: RootState) => state.user.pendingInvites)
	const currentUser = useSelector((state: RootState) => state.user.authUser)

	useEffect(() => {
		if (currentUser.data?.id) {
			dispatch(getPendingInvites(currentUser.data?.id))
		}
	}, [dispatch, currentUser.data?.id])

	return (
		<div className='partner-dashboard h-full'>
			{/* list of invites here */}
			{/* if salon is not selected and salon options are empty, display Create salon button */}
			<SalonDashboard>
				{isEmpty(salonOptions) && (
					<div className='flex add-button justify-center items-center'>
						<div className='m-auto text-center'>
							<h1 className='text-5xl font-bold'>{t('loc:Začnite vytvorením salónu')}</h1>
							<Button onClick={() => history.push(t('paths:salons/create'))} type='primary' htmlType='button' className={'noti-btn'} icon={<PlusIcon />}>
								{t('loc:Pridať salón')}
							</Button>
						</div>
					</div>
				)}
			</SalonDashboard>
		</div>
	)
}

export default PartnerDashboard
