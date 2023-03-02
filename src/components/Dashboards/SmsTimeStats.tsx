import React, { useEffect } from 'react'
import { DatePicker } from 'antd'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import dayjs, { Dayjs } from 'dayjs'

// assets
import { ReactComponent as UsageIcon } from '../../assets/icons/usage.svg'

// types
import { RootState } from '../../reducers'

// utils
import { getSmsTimeStats } from '../../reducers/sms/smsActions'
import { MONTH_NAME_YEAR_FORMAT } from '../../utils/enums'

type Props = {
	month: number
	year: number
	salonID: string
	onPickerChange: (date: Dayjs | null) => void
}

const SmsTimeStats = (props: Props) => {
	const { onPickerChange, salonID, month, year } = props
	const [t] = useTranslation()
	const dispatch = useDispatch()

	const smsTimeStats = useSelector((state: RootState) => state.sms.timeStats)

	useEffect(() => {
		dispatch(getSmsTimeStats(salonID, year, month))
	}, [dispatch, salonID, year, month])

	return (
		<>
			<div className={'flex justify-between items-center'}>
				<h2>{t('loc:Prehľad')}</h2>
				<DatePicker
					onChange={onPickerChange}
					picker={'month'}
					size='small'
					defaultValue={dayjs()}
					allowClear={false}
					format={MONTH_NAME_YEAR_FORMAT}
					getPopupContainer={(node) => node.parentElement || document.body}
				/>
			</div>
			<div className={'flex gap-4 mb-6'}>
				<div className={'p-4 pb-8 rounded shadow-lg bg-notino-white w-1/3'}>{t('loc:Spotreba kreditu v období')}</div>
				<div className={'p-4 pb-8 rounded shadow-lg bg-notino-white w-1/3'}>{t('loc:Počet odoslaných SMS v období')}</div>
				<div className={'p-4 pb-8 rounded shadow-lg bg-notino-white w-1/3'}>{t('loc:Cena SMS v období')}</div>
			</div>
		</>
	)
}

export default SmsTimeStats
