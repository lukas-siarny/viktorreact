import React, { FC, ReactNode, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Timeline, Row, Col, Pagination, Spin } from 'antd'
import { isEmpty } from 'lodash'
import cx from 'classnames'
import { NumberParam, useQueryParams, withDefault, StringParam } from 'use-query-params'

// components
import { initialize } from 'redux-form'
import SalonHistoryFilter, { ISalonHistoryFilter } from './SalonHistoryFilter'

// types
import { SalonSubPageProps } from '../../../types/interfaces'

// reducers
import { getSalonHistory } from '../../../reducers/salons/salonsActions'
import { RootState } from '../../../reducers'

// utils
import { FORM, INTERVALS, SALON_HISTORY_OPERATIONS } from '../../../utils/enums'
import { formatDateByLocale } from '../../../utils/helper'

// assets
import { ReactComponent as CheckIcon } from '../../../assets/icons/check-12.svg'
import { ReactComponent as ResetIcon } from '../../../assets/icons/reset-icon.svg'
import { ReactComponent as EditIcon } from '../../../assets/icons/edit-icon.svg'
import { ReactComponent as CloseIcon } from '../../../assets/icons/close-icon.svg'

const SalonHistory: FC<SalonSubPageProps> = (props) => {
	const dispatch = useDispatch()
	const { salonID } = props

	const [query, setQuery] = useQueryParams({
		limit: NumberParam,
		page: withDefault(NumberParam, 1),
		dateFrom: withDefault(StringParam, ''),
		dateTo: withDefault(StringParam, ''),
		interval: withDefault(StringParam, INTERVALS.HOURS_48)
	})

	const salonHistory = useSelector((state: RootState) => state.salons.salonHistory)

	const fetchData = async () => {
		dispatch(getSalonHistory({ dateFrom: query.dateFrom, dateTo: query.dateTo, salonID, page: query.page, limit: query.limit }))
		dispatch(
			initialize(FORM.SALON_HISTORY_FILTER, {
				dateFromTo: {
					dateFrom: query.dateFrom,
					dateTo: query.dateTo
				},
				interval: query.interval
			})
		)
	}

	useEffect(() => {
		fetchData()
	}, [dispatch, query.page, query.limit, query.dateFrom, query.dateTo, query.interval])

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

	const renderValues = (values: any, operation: SALON_HISTORY_OPERATIONS, showKey = false) => {
		if (values && (operation === SALON_HISTORY_OPERATIONS.UPDATE || operation === SALON_HISTORY_OPERATIONS.INSERT)) {
			return (
				<Row gutter={[0, 0]}>
					{' '}
					{Object.keys(values).map((key: string) => {
						if (typeof values[key] === 'object') {
							if (showKey) {
								return (
									<>
										<Col span={12}>{key}</Col>
										<Col span={12}>
											<p>{JSON.stringify(values[key])}</p>
										</Col>
									</>
								)
							}
							return (
								<Col span={24}>
									<p>{JSON.stringify(values[key])}</p>
								</Col>
							)
						}
						if (showKey) {
							return (
								<>
									<Col span={12}>{key}</Col>
									<Col span={12}>
										<p>{isEmpty(values[key]) && values[key] === '' && values[key] === null ? ' --- ' : `${values[key]}`}</p>
									</Col>
								</>
							)
						}
						return (
							<Col span={24}>
								<p>{isEmpty(values[key]) || values[key] === '' || !values[key] ? ' --- ' : `${values[key]}`}</p>
							</Col>
						)
					})}
				</Row>
			)
		}
		return undefined
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
			interval: values.interval,
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
				<Timeline mode={'left'}>
					{salonHistory.data?.salonHistory.map((history) => (
						<Timeline.Item
							dot={setIcon(history.operation as SALON_HISTORY_OPERATIONS)}
							label={
								<>
									<h4 className={'mr-2 mb-0'}>{formatDateByLocale(history.createdAt)}</h4>{' '}
									{renderValues(history.oldValue, history.operation as SALON_HISTORY_OPERATIONS, true)}
								</>
							}
						>
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
							{renderValues(history.newValue, history.operation as SALON_HISTORY_OPERATIONS)}
						</Timeline.Item>
					))}
				</Timeline>
			</Spin>
			<div className={'content-footer pt-0 items-start'}>
				<Row className={'w-full'} justify={'end'}>
					{!salonHistory.isFailure && (
						<Pagination
							className={'mt-4'}
							onChange={onChangePagination}
							total={salonHistory.data?.pagination.totalCount}
							showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
							pageSize={salonHistory.data?.pagination.limit}
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
