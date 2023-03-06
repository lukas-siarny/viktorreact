import React, { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import Statistics from '../../../components/Dashboards/Statistics'
import { RootState } from '../../../reducers'

type Props = PropsWithChildren & {
	// data: any
}

const ReservationsDashboard = (props: Props) => {
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const { children } = props
	const { notino, salonsAnnualStats, salonsMonthStats } = useSelector((state: RootState) => state.dashboard)

	return (
		<div>
			<div className='dashboard-grid'>
				<Statistics title={t('loc:Salóny so zapnutým Rezervačným systémom pre B2B')} count={notino?.data?.actualCounEnabledRsB2b} />
				<Statistics title={t('loc:Salóny so zapnutým Rezervačným systémom pre B2C')} count={notino?.data?.actualCounEnabledRsB2c} />
			</div>
			{children}
		</div>
	)
}

export default ReservationsDashboard
