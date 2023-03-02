import React, { useEffect } from 'react'
import { Divider, Spin } from 'antd'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import { useDispatch, useSelector } from 'react-redux'

// assets
import { ReactComponent as UsageIcon } from '../../assets/icons/usage.svg'

// types
import { RootState } from '../../reducers'

// utils
import { getSmsStats } from '../../reducers/sms/smsActions'

type Props = {
	salonID: string
	className?: string
}

const SmsStats = (props: Props) => {
	const { className = 'w-1/2', salonID } = props
	const [t] = useTranslation()
	const dispatch = useDispatch()

	const stats = useSelector((state: RootState) => state.sms.stats)

	useEffect(() => {
		dispatch(getSmsStats(salonID))
	}, [dispatch, salonID])

	return (
		<div className={cx('p-4 rounded shadow-lg bg-notino-white flex-50', className)}>
			<Spin spinning={stats.isLoading}>
				<h4 className={'mb-0 flex items-center'}>
					<UsageIcon className={'text-notino-black mr-2'} />
					{t('loc:Detail spotreby')}
				</h4>
				<Divider className={'mb-4 mt-3'} />
				<div className={'flex flex-col gap-2'}>
					<div className={'flex justify-between gap-2 flex-1 items-center'}>
						{t('loc:Celková spotreba kreditu')}
						<span className={'text-lg font-bold leading-5 text-right'}>{stats.data?.smsNotificationsStats.formattedTotalSpentTransactionAmount}</span>
					</div>
					<div className={'flex justify-between gap-2 flex-1 items-center'}>
						{t('loc:Odoslané SMS')}
						<span className={'text-lg font-bold leading-5 text-right'}>{stats.data?.smsNotificationsStats.totalSentSmsCount}</span>
					</div>
					<div className={'flex justify-between gap-2 flex-1 items-center'}>
						{t('loc:Aktuálna cena SMS platná od 1.1.2023')}
						<span className={'text-lg font-bold leading-5 text-right'}>{stats.data?.currentSmsUnitPrice.formattedAmount}</span>
					</div>
				</div>
				<p className={'text-right text-notino-grayDark mb-0 mt-4'}>{t('loc:Ceny sú uvedené v rámci DPH')}</p>
			</Spin>
		</div>
	)
}

export default SmsStats
