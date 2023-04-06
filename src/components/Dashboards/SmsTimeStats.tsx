import React, { useMemo } from 'react'
import { DatePicker, Empty, Spin } from 'antd'
import { useTranslation } from 'react-i18next'
import dayjs, { Dayjs } from 'dayjs'
import cx from 'classnames'
import { Line } from 'react-chartjs-2'

// types
import { Columns, ILoadingAndFailure, TimeStats } from '../../types/interfaces'

// utils
import { MONTH_NAME_YEAR_FORMAT } from '../../utils/enums'
import { lineOptions, SMS_SENT_STATS_COLOR, transformSmsDataToStatsData } from '../../pages/HomePage/components/dashboardUtils'

// redux
import { ISmsTimeStatsPayload } from '../../reducers/sms/smsActions'

// components
import CustomTable from '../CustomTable'

type Props = {
	selectedDate: Dayjs
	onPickerChange: (date: Dayjs | null) => void
	countryPicker?: React.ReactNode
	className?: string
	title?: React.ReactNode
	smsTimeStats: ISmsTimeStatsPayload & ILoadingAndFailure
}

const SmsTimeStats = (props: Props) => {
	const { onPickerChange, selectedDate, className, title, smsTimeStats, countryPicker } = props
	const [t] = useTranslation()

	const source: TimeStats = useMemo(() => {
		return transformSmsDataToStatsData(smsTimeStats.data, smsTimeStats.isLoading, smsTimeStats.isFailure, selectedDate)
	}, [selectedDate, smsTimeStats.data, smsTimeStats.isLoading, smsTimeStats.isFailure])

	const columns = (labels: string[] = [], futureBreak = 0): Columns => [
		{
			key: 'type',
			dataIndex: 'type',
			render: () => {
				return (
					<div className={'flex flex-1 items-center'}>
						<div className='h-2-5 w-2-5 rounded-full mr-1 stats-circle' style={{ backgroundColor: SMS_SENT_STATS_COLOR, flex: '0 0 auto' }} />
						<span className='xs-bold'>{t('loc:Odoslané SMS')}</span>
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
			<div className={'flex justify-between items-center mb-6'}>
				{title || <h2 className={'mb-0'}>{t('loc:Prehľad')}</h2>}
				<div className={'flex items-center gap-4'}>
					{countryPicker}
					<DatePicker
						onChange={onPickerChange}
						picker={'month'}
						size={countryPicker ? 'middle' : 'small'} // TODO: zvacsit na vsekych statistikach na middle
						defaultValue={dayjs()}
						allowClear={false}
						format={MONTH_NAME_YEAR_FORMAT}
						disabledDate={(date) => dayjs(date).year() < 2022}
					/>
				</div>
			</div>
			<div className={'flex gap-4 mb-6'}>
				<div className={'p-4 rounded shadow-lg bg-notino-white w-1/3'}>
					<span className={'text-notino-grayDark text-sm block mb-2'}>{t('loc:Spotreba kreditu v období')}</span>
					<span className={'text-notino-black text-base font-bold'}>{smsTimeStats.data?.formattedTotalSpentTransactionAmount || '-'}</span>
				</div>
				<div className={'p-4 rounded shadow-lg bg-notino-white w-1/3'}>
					<span className={'text-notino-grayDark text-sm block mb-2'}>{t('loc:Počet odoslaných SMS v období')}</span>
					<span className={'text-notino-black text-base font-bold'}>{smsTimeStats.data?.totalSentSmsCount ?? '0'}</span>
				</div>
				<div className={'p-4 rounded shadow-lg bg-notino-white w-1/3'}>
					<span className={'text-notino-grayDark text-sm block mb-2'}>{t('loc:Cena SMS v období')}</span>
					<span className={'text-notino-black text-base font-bold'}>{smsTimeStats.data?.currentSmsUnitPrice?.formattedAmount || '-'}</span>
				</div>
			</div>

			<div className='stastics-box py-4 px-6 md:py-8 md:px-12'>
				<Spin spinning={smsTimeStats.isLoading}>
					<div className='flex flex-wrap justify-between w-full'>
						<h4>{t('loc:Vývoj odoslaných SMS')}</h4>
					</div>
					<div className='mt-4'>
						<div className='h-40'>
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
				</Spin>
			</div>
		</div>
	)
}

export default SmsTimeStats
