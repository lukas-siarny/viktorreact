import React from 'react'
import { useTranslation } from 'react-i18next'
import { Col, Row, Spin } from 'antd'
import { SorterResult, TablePaginationConfig } from 'antd/lib/table/interface'
import { useNavigate } from 'react-router'
import { ColumnProps } from 'antd/es/table'

// components
import Breadcrumbs from '../../components/Breadcrumbs'

// utils
import { ROW_GUTTER_X_DEFAULT } from '../../utils/enums'
import { formatDateByLocale, normalizeDirectionKeys } from '../../utils/helper'

// assets
import { ReactComponent as DocumentIcon } from '../../assets/icons/document-icon.svg'

// types
import { IBreadcrumbs } from '../../types/interfaces'
import CustomTable from '../../components/CustomTable'

type TableDataItem = any

const commonBadgeSyles = 'text-xs leading-4 font-medium h-6 px-2 inline-flex items-center truncate rounded-full'

const MyDocumentsPage = () => {
	const [t] = useTranslation()
	const navigate = useNavigate()

	const isLoading = false

	const onChangeTable = (_pagination: TablePaginationConfig, _filters: Record<string, (string | number | boolean)[] | null>, sorter: SorterResult<any> | SorterResult<any>[]) => {
		if (!(sorter instanceof Array)) {
			const order = `${sorter.columnKey}:${normalizeDirectionKeys(sorter.order)}`
			/* const newQuery = {
				...query,
				order
			}
			setQuery(newQuery) */
		}
	}

	const onChangePagination = (page: number, limit: number) => {
		/* const newQuery = {
			...query,
			limit,
			page
		}
		setQuery(newQuery) */
	}

	const dataSource = [
		{
			id: 'sdsds',
			name: 'Ochrana osobných údajov',
			state: new Date().toISOString(),
			validFrom: new Date().toISOString()
		},
		{
			id: 'sdsdssds',
			name: 'Ochrana osobných údajov',
			state: new Date().toISOString(),
			validFrom: new Date().toISOString()
		},
		{
			id: 'sdsdssdsd',
			name: 'Ochrana osobných údajov',
			state: new Date().toISOString(),
			validFrom: new Date().toISOString()
		},
		{
			id: 'sdsdssdsdsd',
			name: 'Ochrana osobných údajov',
			state: new Date().toISOString(),
			validFrom: new Date().toISOString()
		}
	]

	const columns: ColumnProps<TableDataItem>[] = [
		{
			title: t('loc:Názov dokumentu'),
			dataIndex: 'name',
			key: 'name',
			width: '40%',
			ellipsis: true,
			render: (value) => {
				return (
					<div className={'flex items-center gap-3'}>
						<DocumentIcon className={'text-notino-gray flex-shrink-0'} />
						<span className={'truncate font-semibold text-notino-black'}>{value}</span>
					</div>
				)
			}
		},
		{
			title: t('loc:Stav'),
			dataIndex: 'state',
			key: 'state',
			width: '40%',
			ellipsis: true,
			render: () => {
				const isNew = Math.random() > 0.5

				return isNew ? (
					<span className={`${commonBadgeSyles} bg-notino-pink text-notino-white`}>{t('loc:Nové')}</span>
				) : (
					<span className={`${commonBadgeSyles} bg-notino-grayLighter text-notino-gray-darker`}>{formatDateByLocale(new Date())}</span>
				)
			}
		},
		{
			title: t('loc:Platnosť od'),
			dataIndex: 'validFrom',
			key: 'validFrom',
			align: 'right',
			width: '20%',
			ellipsis: true,
			render: () => {
				return <span className={'text-notino-grayDark'}>{formatDateByLocale(new Date(), true)}</span>
			}
		}
	]

	const breadcrumbs: IBreadcrumbs = {
		items: [
			{
				name: t('loc:Dokumenty')
			}
		]
	}

	return (
		<>
			<Row>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:index')} />
			</Row>

			<div className='content-body medium no-padding overflow-hidden'>
				<Spin spinning={isLoading}>
					<CustomTable
						className='table-my-documents'
						onChange={onChangeTable}
						columns={columns}
						dataSource={dataSource}
						rowClassName={'clickable-row'}
						rowKey='id'
						onRow={(record) => ({
							onClick: () => {
								navigate(t('paths:my-documents/{{documentID}}', { documentID: record.id }))
							}
						})}
						pagination={false}
						/* useCustomPagination
								pagination={{
									pageSize: customers?.data?.pagination?.limit,
									total: customers?.data?.pagination?.totalCount,
									current: customers?.data?.pagination?.page,
									disabled: customers?.isLoading,
									onChange: onChangePagination
								}} */
					/>
				</Spin>
			</div>
		</>
	)
}

export default MyDocumentsPage
