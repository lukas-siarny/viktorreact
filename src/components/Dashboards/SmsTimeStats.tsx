import React, { useEffect, useMemo } from 'react'
import { DatePicker, Empty, Spin } from 'antd'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import dayjs, { Dayjs } from 'dayjs'
import cx from 'classnames'
import i18next from 'i18next'
import { Line } from 'react-chartjs-2'

// types
import { RootState } from '../../reducers'

// utils
import { getSmsTimeStats } from '../../reducers/sms/smsActions'
import { MONTH_NAME_YEAR_FORMAT } from '../../utils/enums'
import CustomTable from '../CustomTable'
import { lineOptions, SMS_SENT_STATS_COLOR, transformSmsDataToStatsData } from '../../pages/HomePage/components/dashboardUtils'
import { Columns, TimeStats } from '../../types/interfaces'
import { formatPrice } from '../../utils/helper'

type Props = {
	selectedDate: Dayjs
	salonID: string
	onPickerChange: (date: Dayjs | null) => void
	className?: string
}

const SmsTimeStats = (props: Props) => {
	const { onPickerChange, salonID, selectedDate, className } = props
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const year = selectedDate.year()
	const month = selectedDate.month() + 1

	const smsTimeStats = useSelector((state: RootState) => state.sms.timeStats)

	const source: TimeStats = useMemo(() => {
		return transformSmsDataToStatsData(smsTimeStats.data, smsTimeStats.isLoading, smsTimeStats.isFailure, selectedDate)
	}, [selectedDate, smsTimeStats.data, smsTimeStats.isLoading, smsTimeStats.isFailure])

	const totalOverviewStats = useMemo(
		() =>
			Object.values(smsTimeStats.data?.ranges || {}).reduce(
				(acc, cv) => {
					const parsedSpentTransactionAmount = cv.formattedTotalSpentTransactionAmount.replace(/\D/g, '')
					const numuberSpentTransactionAmount = Number.isNaN(parsedSpentTransactionAmount) ? 0 : Number(parsedSpentTransactionAmount)
					const split = cv.formattedTotalSpentTransactionAmount.split(' ')
					const lastSymbol = split[split.length - 1]

					return {
						...acc,
						totalSentSmsCount: acc.totalSentSmsCount + cv.totalSentSmsCount,
						totalSpentTransactionAmount: acc.totalSpentTransactionAmount + numuberSpentTransactionAmount,
						currentSmsUnitPrice: cv?.currentSmsUnitPrice?.formattedAmount || null, // toto by malo byt pre kazdu hodnotu rovnake,
						currencySymbol: acc.currencySymbol || (lastSymbol && Number.isNaN(lastSymbol) ? lastSymbol : '')
					}
				},
				{
					totalSentSmsCount: 0,
					totalSpentTransactionAmount: 0,
					currentSmsUnitPrice: null,
					currencySymbol: ''
				} as { totalSentSmsCount: number; totalSpentTransactionAmount: number; currentSmsUnitPrice: string | null; currencySymbol: string }
			),
		[smsTimeStats.data?.ranges]
	)

	useEffect(() => {
		dispatch(getSmsTimeStats(salonID, year, month))
	}, [dispatch, salonID, year, month])

	const columns = (labels: string[] = [], futureBreak = 0): Columns => [
		{
			key: 'type',
			dataIndex: 'type',
			render: () => {
				return (
					<div className={'flex flex-1 items-center'}>
						<div className='h-2-5 w-2-5 rounded-full mr-1 stats-circle' style={{ backgroundColor: SMS_SENT_STATS_COLOR, flex: '0 0 auto' }} />
						<span className='xs-bold'>{i18next.t('loc:Odoslané SMS')}</span>
					</div>
				)
			}
		},
		...labels.map((label: string, index: number) => {
			return {
				key: index,
				dataIndex: index,
				className: cx({ 'future-divider': futureBreak - 0.5 === index }), // 0.5 is delta for display devider between columns
				title: <span className={cx('xs-semibold', { 'text-notino-gray': futureBreak <= index })}>{label}</span>,
				render: (value: number) => <span className={cx('xs-regular', { 'text-notino-gray': futureBreak <= index })}>{value}</span>
			}
		})
	]

	return (
		<div className={cx('sms-staticis-wrapper', className)}>
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
				<div className={'p-4 rounded shadow-lg bg-notino-white w-1/3'}>
					<span className={'text-notino-grayDark text-sm block mb-2'}>{t('loc:Spotreba kreditu v období')}</span>
					<span className={'text-notino-black text-base font-bold'}>
						{formatPrice(totalOverviewStats.totalSpentTransactionAmount, totalOverviewStats.currencySymbol)}
					</span>
				</div>
				<div className={'p-4 rounded shadow-lg bg-notino-white w-1/3'}>
					<span className={'text-notino-grayDark text-sm block mb-2'}>{t('loc:Počet odoslaných SMS v období')}</span>
					<span className={'text-notino-black text-base font-bold'}>{totalOverviewStats.totalSentSmsCount}</span>
				</div>
				<div className={'p-4 rounded shadow-lg bg-notino-white w-1/3'}>
					<span className={'text-notino-grayDark text-sm block mb-2'}>{t('loc:Cena SMS v období')}</span>
					<span className={'text-notino-black text-base font-bold'}>{totalOverviewStats.currentSmsUnitPrice || '-'}</span>
				</div>
			</div>

			<div className='stastics-box py-4 px-6 md:py-8 md:px-12'>
				<div className='flex flex-wrap justify-between w-full'>
					<h4>{t('loc:Vývoj odoslaných SMS')}</h4>
				</div>
				<div className='mt-4'>
					<div className='h-40'>
						<Spin spinning={smsTimeStats.isLoading}>
							{smsTimeStats.isFailure ? (
								<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t('loc:Chyba')} />
							) : (
								<Line
									options={lineOptions(source.data?.breakIndex) as any}
									data={{
										labels: source?.data?.labels,
										datasets: source?.data?.datasets ?? []
									}}
								/>
							)}
						</Spin>
					</div>
					<CustomTable
						className='mt-8'
						columns={columns(source.data?.labels, source?.data?.breakIndex)}
						twoToneRows
						pagination={false}
						dataSource={source.data?.columns}
						rowKey={(record) => record.type}
						scroll={{ x: 400 }}
					/>
				</div>
			</div>
		</div>
	)
}

export default SmsTimeStats
