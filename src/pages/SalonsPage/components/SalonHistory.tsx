import React, { FC, ReactNode, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Pagination, Spin, List, Divider } from 'antd'
import cx from 'classnames'
import { NumberParam, useQueryParams, withDefault, StringParam } from 'use-query-params'

// components
import { initialize } from 'redux-form'
import dayjs from 'dayjs'
import SalonHistoryFilter, { ISalonHistoryFilter } from './SalonHistoryFilter'
import CompareComponent from '../../../components/CompareComponent'

// types
import { SalonSubPageProps } from '../../../types/interfaces'

// reducers
import { getSalonHistory } from '../../../reducers/salons/salonsActions'
import { RootState } from '../../../reducers'

// utils
import { FORM, SALON_HISTORY_OPERATIONS } from '../../../utils/enums'
import { formatDateByLocale } from '../../../utils/helper'

// assets
import { ReactComponent as CheckIcon } from '../../../assets/icons/check-12.svg'
import { ReactComponent as ResetIcon } from '../../../assets/icons/reset-icon.svg'
import { ReactComponent as EditIcon } from '../../../assets/icons/edit-icon.svg'
import { ReactComponent as CloseIcon } from '../../../assets/icons/close-icon.svg'

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

const SalonHistory: FC<SalonSubPageProps> = (props) => {
	const dispatch = useDispatch()
	const { salonID } = props
	const now = dayjs()

	const [query, setQuery] = useQueryParams({
		limit: NumberParam,
		page: withDefault(NumberParam, 1),
		dateFrom: withDefault(StringParam, now.subtract(1, 'week').toISOString()),
		dateTo: withDefault(StringParam, now.toISOString())
	})

	const salonHistory = useSelector((state: RootState) => state.salons.salonHistory)

	const fetchData = async () => {
		dispatch(getSalonHistory({ dateFrom: query.dateFrom, dateTo: query.dateTo, salonID, page: query.page, limit: query.limit }))
		dispatch(
			initialize(FORM.SALON_HISTORY_FILTER, {
				dateFromTo: {
					dateFrom: query.dateFrom,
					dateTo: query.dateTo
				}
			})
		)
	}

	useEffect(() => {
		fetchData()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dispatch, query.page, query.limit, query.dateFrom, query.dateTo])

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
		<>
			<div className={'content-header block'}>
				<SalonHistoryFilter onSubmit={handleSubmit} />
			</div>
			<Spin spinning={salonHistory.isLoading}>
				{salonHistory.data?.salonHistory.map((history) => (
					<>
						<List.Item key={history.id}>
							<div className={'w-full'}>
								<Divider className={'mb-1 mt-1'}>
									<div className={'flex items-center justify-center'}>
										<h4 className={'mr-2 mb-0'}>{formatDateByLocale(history.createdAt)}</h4>
										{setIcon(history.operation as SALON_HISTORY_OPERATIONS)}
										<div className={'flex items-center'}>
											<h4
												className={cx('m-0 p-0 history-text-action', {
													warning: history.operation === SALON_HISTORY_OPERATIONS.UPDATE,
													danger: history.operation === SALON_HISTORY_OPERATIONS.DELETE,
													info: history.operation === SALON_HISTORY_OPERATIONS.RESTORE,
													success: history.operation === SALON_HISTORY_OPERATIONS.INSERT
												})}
											>
												{history.operation}
											</h4>{' '}
											<div className={'ml-2 font-bold'}>{history.userEmail}</div>
										</div>
									</div>
								</Divider>
								<div className={'flex items-center'}>
									<div className={'w-full'}>{renderValues(history?.oldValue, history?.newValue)}</div>
								</div>
							</div>
						</List.Item>
					</>
				))}
			</Spin>
			<div className={'content-footer pt-0 items-start'}>
				<Row className={'w-full'} justify={'end'}>
					{!salonHistory.isFailure && (
						<Pagination
							className={'mt-4'}
							onChange={onChangePagination}
							total={salonHistory.data?.pagination.totalCount}
							showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
							pageSize={salonHistory.data?.pagination.limit || 0}
							current={salonHistory.data?.pagination.page}
							showSizeChanger
							pageSizeOptions={[25, 50, 100, 1000]}
						/>
					)}
				</Row>
			</div>
		</>
	)
}

export default SalonHistory
