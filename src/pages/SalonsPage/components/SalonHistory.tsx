import React, { FC, PropsWithChildren, ReactNode, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Divider, List, Spin, Empty } from 'antd'
import { initialize } from 'redux-form'
import dayjs from 'dayjs'

// components
import SalonHistoryFilter, { ISalonHistoryFilter } from './filters/SalonHistoryFilter'
import CompareComponent from '../../../components/CompareComponent'
import CustomPagination from '../../../components/CustomPagination'

// types
import { SalonSubPageProps } from '../../../types/interfaces'

// reducers
import { getSalonHistory } from '../../../reducers/salons/salonsActions'
import { RootState } from '../../../reducers'

// utils
import { FORM, SALON_HISTORY_OPERATIONS, SALON_HISTORY_OPERATIONS_COLORS, DEFAULT_DATE_INIT_FORMAT } from '../../../utils/enums'
import { formatDateByLocale } from '../../../utils/helper'

// assets
import { ReactComponent as CheckIcon } from '../../../assets/icons/check-12.svg'
import { ReactComponent as ResetIcon } from '../../../assets/icons/reset-icon.svg'
import { ReactComponent as EditIcon } from '../../../assets/icons/edit-icon.svg'
import { ReactComponent as CloseIcon } from '../../../assets/icons/close-icon.svg'

// hooks
import useQueryParams, { NumberParam, StringParam } from '../../../hooks/useQueryParams'

const setIcon = (operation: SALON_HISTORY_OPERATIONS): undefined | ReactNode => {
	switch (operation) {
		case SALON_HISTORY_OPERATIONS.DELETE:
			return <CloseIcon className={'history-icon danger'} />
		case SALON_HISTORY_OPERATIONS.INSERT:
			return <CheckIcon width={24} height={24} className={'history-icon success'} />
		case SALON_HISTORY_OPERATIONS.RESTORE:
			return <ResetIcon className={'history-icon info'} />
		case SALON_HISTORY_OPERATIONS.UPDATE:
			return <EditIcon className={'history-icon warning'} />
		default:
			return undefined
	}
}

type ComponentProps = {} & PropsWithChildren<SalonSubPageProps>

const SalonHistory: FC<ComponentProps> = (props) => {
	const dispatch = useDispatch()
	const { salonID } = props
	const now = dayjs()

	const [query, setQuery] = useQueryParams({
		limit: NumberParam(),
		page: NumberParam(1),
		dateFrom: StringParam(now.subtract(1, 'week').format(DEFAULT_DATE_INIT_FORMAT)),
		dateTo: StringParam(now.format(DEFAULT_DATE_INIT_FORMAT))
	})

	const salonHistory = useSelector((state: RootState) => state.salons.salonHistory)

	useEffect(() => {
		const fetchData = async () => {
			dispatch(
				getSalonHistory({
					dateFrom: query.dateFrom,
					dateTo: query.dateTo,
					salonID,
					page: query.page,
					limit: query.limit
				})
			)
			dispatch(
				initialize(FORM.SALON_HISTORY_FILTER, {
					dateFromTo: {
						dateFrom: query.dateFrom,
						dateTo: query.dateTo
					}
				})
			)
		}

		//  fetch data when click on history tab
		fetchData()
	}, [dispatch, query.page, query.limit, query.dateFrom, query.dateTo, salonID])

	const renderValues = (oldValues: any, newValues: any) => {
		let values: any = {}
		if (oldValues) {
			values = oldValues
		} else if (newValues) {
			values = newValues
		}

		return (
			<>
				{Object.keys(values)?.map((key: string) => {
					if (typeof values?.[key] === 'object' && key !== 'fileID') {
						return <CompareComponent valueKey={key} oldValue={JSON.stringify(oldValues?.[key])} newValue={JSON.stringify(newValues?.[key])} />
					}
					return <CompareComponent valueKey={key} oldValue={oldValues?.[key]} newValue={newValues?.[key]} />
				})}
			</>
		)
	}

	const onChangePagination = (page: number, limit: number) => {
		const newQuery = {
			...query,
			limit,
			page
		}
		setQuery(newQuery)
	}

	const handleSubmit = (values: ISalonHistoryFilter) => {
		const newQuery = {
			...query,
			...values.dateFromTo,
			page: 1
		}
		setQuery(newQuery)
	}

	return (
		<div className='content-body'>
			<div className={'content-header block'}>
				<SalonHistoryFilter onSubmit={handleSubmit} />
			</div>
			<Spin spinning={salonHistory.isLoading}>
				{salonHistory.data?.salonHistory.length ? (
					<ul id={'salon-history-list'} className={'p-0'}>
						{salonHistory.data?.salonHistory.map((history) => (
							<List.Item key={history.id} className={'list-none p-0'}>
								<div className={'w-full'}>
									<Divider className={'mb-1 mt-1'}>
										<div className={'flex items-center justify-center'}>
											<h4 className={'mr-2 mb-0'}>{formatDateByLocale(history.createdAt)}</h4>
											{setIcon(history.operation as SALON_HISTORY_OPERATIONS)}
											<div className={'flex items-center'}>
												<h4 className={`m-0 p-0 history-text-action ${SALON_HISTORY_OPERATIONS_COLORS?.[history.operation]}`}>{history.operation}</h4>{' '}
												<div className={'ml-2 font-bold'}>{history.userEmail}</div>
											</div>
										</div>
									</Divider>
									<div className={'flex items-center'}>
										<div className={'w-full'}>{renderValues(history?.oldValue, history?.newValue)}</div>
									</div>
								</div>
							</List.Item>
						))}
					</ul>
				) : (
					<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
				)}
			</Spin>
			<div className={'content-footer mt-0'}>
				{!salonHistory.isFailure && (
					<CustomPagination
						className={'mt-1'}
						onChange={onChangePagination}
						total={salonHistory.data?.pagination.totalCount}
						showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
						pageSize={salonHistory.data?.pagination.limit || 0}
						current={salonHistory.data?.pagination.page}
						showSizeChanger
						pageSizeOptions={[25, 50, 100, 1000]}
					/>
				)}
			</div>
		</div>
	)
}

export default SalonHistory
