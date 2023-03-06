import React, { FC } from 'react'
import { Button } from 'antd'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { isEmpty } from 'lodash'
import { useNavigate } from 'react-router-dom'

// components
import SalonDashboard from './SalonDashboard'
import PendingInvites from './PendingInvites'

// redux
import { RootState } from '../../../reducers'

// assets
import { ReactComponent as PlusIcon } from '../../../assets/icons/plus-icon.svg'

type Props = {}

const PartnerDashboard: FC<Props> = () => {
	const [t] = useTranslation()
	const navigate = useNavigate()

	const salonOptions = useSelector((state: RootState) => state.selectedSalon.selectionOptions.data)

	return (
		<>
			<PendingInvites />
			{/* if salon is not selected and salon options are empty, display Create salon button */}
			<SalonDashboard>
				{isEmpty(salonOptions) && (
					<div className='flex add-button justify-center items-center'>
						<div className='m-auto text-center'>
							<h1 className='text-5xl font-bold'>{t('loc:Začnite vytvorením salónu')}</h1>
							<Button onClick={() => navigate(t('paths:salons/create'))} type='primary' htmlType='button' className={'noti-btn'} icon={<PlusIcon />}>
								{t('loc:Pridať salón')}
							</Button>
						</div>
					</div>
				)}
			</SalonDashboard>
		</>
	)
}

export default PartnerDashboard
