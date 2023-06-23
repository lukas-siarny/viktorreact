import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Spin, TablePaginationConfig } from 'antd'
import { SorterResult } from 'antd/lib/table/interface'
import { ColumnProps } from 'antd/es/table'

// components
import CustomTable from '../../../components/CustomTable'
import SmsHistoryFilter from './SmsHistoryFilter'

// utils
import { normalizeDirectionKeys, setOrder, formatDateByLocale } from '../../../utils/helper'
import { SMS_NOTIFICATION_EVENT_TYPE, SMS_NOTIFICATION_EVENT_TYPE_NAME, SMS_NOTIFICATION_STATUS, SMS_STATUS_NAME } from '../../../utils/enums'

// assets
import { ReactComponent as MessageIcon } from '../../../assets/icons/message-icon.svg'

// types
import { ILoadingAndFailure, ISpecialistContactFilter } from '../../../types/interfaces'
import { ISmsHistoryPayload } from '../../../reducers/sms/smsActions'
import { ISmsCreditPartnerPageQueryParams } from '../../../schemas/queryParams'

type TableDataItem = NonNullable<ISmsHistoryPayload['data']>['smsNotificationsHistory'][0]

type Props = {
	query: ISmsCreditPartnerPageQueryParams
	setQuery: (newValues: ISmsCreditPartnerPageQueryParams) => void
	smsHistory: ISmsHistoryPayload & ILoadingAndFailure
}

const SmsHistory: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { query, setQuery, smsHistory } = props

	const onChangeTable = (_pagination: TablePaginationConfig, _filters: Record<string, (string | number | boolean)[] | null>, sorter: SorterResult<any> | SorterResult<any>[]) => {
		if (!(sorter instanceof Array)) {
			const order = `${sorter.columnKey}:${normalizeDirectionKeys(sorter.order)}`
			const newQuery = {
				...query,
				order
			}
			setQuery(newQuery)
		}
	}

	const onChangePagination = (page: number, limit: number) => {
		const newQuery = {
			...query,
			limit,
			page: limit === smsHistory?.data?.pagination?.limit ? page : 1
		}
		setQuery(newQuery)
	}

	const columns: ColumnProps<TableDataItem>[] = [
		{
			key: 'icon',
			width: 50,
			render: () => {
				return <MessageIcon />
			}
		},
		{
			title: t('loc:Dátum'),
			dataIndex: 'cratedAt',
			key: 'createdAt',
			sortOrder: setOrder(query.order, 'createdAt'),
			sorter: true,
			ellipsis: true,
			render: (_value, record) => {
				return formatDateByLocale(record.createdAt)
			}
		},
		{
			title: t('loc:Tel. číslo'),
			dataIndex: 'recipient',
			key: 'recipient',
			ellipsis: true,
			render: (_value, record) => {
				return record.recipient.phone
			}
		},
		{
			title: t('loc:Text SMS'),
			dataIndex: 'content',
			key: 'content',
			ellipsis: true,
			sorter: false,
			render: (_value, record) => {
				return record.content.content
			}
		},
		{
			title: t('loc:Typ SMS'),
			dataIndex: 'notification',
			key: 'notification',
			ellipsis: true,
			sorter: false,
			render: (_value, record) => {
				return SMS_NOTIFICATION_EVENT_TYPE_NAME(record.notification.notificationEventType as SMS_NOTIFICATION_EVENT_TYPE)
			}
		},
		{
			title: t('loc:Množstvo'),
			dataIndex: 'transaction',
			key: 'transaction',
			render: (_value, record) => {
				return record.transaction?.formattedAmount || '-'
			}
		},
		{
			title: t('loc:Status'),
			dataIndex: 'status',
			key: 'status',
			render: (_value, record) => {
				return SMS_STATUS_NAME(record.status as SMS_NOTIFICATION_STATUS)
			}
		}
	]

	return (
		<div className='content-body mt-0'>
			<Spin spinning={smsHistory?.isLoading}>
				<SmsHistoryFilter
					onSubmit={(values: ISpecialistContactFilter) => {
						setQuery({ ...query, search: values.search })
					}}
				/>
				<div className={'w-full mt-2'}>
					<CustomTable<TableDataItem>
						className='table-fixed'
						columns={columns}
						onChange={onChangeTable}
						rowKey={'id'}
						dataSource={smsHistory.data?.smsNotificationsHistory}
						twoToneRows
						useCustomPagination
						pagination={{
							pageSize: smsHistory.data?.pagination?.limit,
							total: smsHistory.data?.pagination?.totalCount,
							current: smsHistory.data?.pagination?.page,
							disabled: smsHistory.isLoading,
							onChange: onChangePagination
						}}
					/>
				</div>
			</Spin>
		</div>
	)
}

export default SmsHistory
