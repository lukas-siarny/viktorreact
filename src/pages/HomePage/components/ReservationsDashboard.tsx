import React, { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import Statistics from '../../../components/Dashboards/Statistics'
import { RootState } from '../../../reducers'

type Props = PropsWithChildren & {}

const ReservationsDashboard = (props: Props) => {
	const [t] = useTranslation()
	const { children } = props

	const { notino } = useSelector((state: RootState) => state.dashboard)

	return (
		<div>
			<div className='dashboard-grid'>
				<Statistics title={t('loc:Salóny so zapnutým rezervačným systémom pre {{ type }}', { type: 'B2B' })} count={notino?.data?.actualCounEnabledRsB2b} />
				<Statistics title={t('loc:Salóny so zapnutým rezervačným systémom pre {{ type }}', { type: 'B2C' })} count={notino?.data?.actualCounEnabledRsB2c} />
			</div>
			{children}
		</div>
	)
}

export default ReservationsDashboard
