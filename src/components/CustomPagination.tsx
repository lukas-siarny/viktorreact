/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useCallback, useRef, useState } from 'react'
import cx from 'classnames'
import { Pagination, Row } from 'antd'
import { useTranslation } from 'react-i18next'
import { isEmpty } from 'lodash'
import i18next from 'i18next'

// utils
import { PAGINATION } from '../utils/enums'

// hooks
import useOnClickOutside from '../hooks/useClickOutside'

// types
import { IPagination } from '../types/interfaces'

const defaultPaginationOptions = {
	defaultPageSize: PAGINATION.defaultPageSize,
	defaultCurrent: 1,
	pageSizeOptions: PAGINATION.pageSizeOptions,
	pageSize: PAGINATION.limit,
	total: 0,
	current: 1,
	showTotal: (total: number, [from, to]: [number, number]) =>
		i18next.t('loc:{{from}} - {{to}} z {{total}} záznamov', {
			total,
			from,
			to
		}),
	showSizeChanger: true
}

const CustomPagination = (props: IPagination) => {
	const {
		disabled = false,
		onChange,
		showSizeChanger = defaultPaginationOptions.showSizeChanger,
		showTotal = defaultPaginationOptions.showTotal,
		pageSize = defaultPaginationOptions.pageSize,
		pageSizeOptions = defaultPaginationOptions.pageSizeOptions,
		current = defaultPaginationOptions.current,
		total = defaultPaginationOptions.total,
		defaultCurrent = defaultPaginationOptions.defaultCurrent,
		defaultPageSize = defaultPaginationOptions.defaultPageSize,
		className
	} = props

	const [t] = useTranslation()

	const [isSizeChangerOpen, setIsSizeChangerOpen] = useState(false)

	const pageSizeChangerRef = useRef<HTMLDivElement | null>(null)

	useOnClickOutside([pageSizeChangerRef], () => {
		setIsSizeChangerOpen(false)
	})

	const onPaginationChange = useCallback(
		(page: number, limit: number) => {
			if (onChange) {
				onChange(page, limit)
			}
		},
		[onChange]
	)

	return total ? (
		<Row justify={'end'} align={'middle'} className={cx('noti-custom-pagination gap-4', className)}>
			<Pagination
				{...props}
				className='ant-table-pagination ant-table-pagination-right'
				disabled={disabled}
				showTotal={showTotal}
				total={total}
				current={current}
				pageSize={pageSize}
				defaultCurrent={defaultCurrent}
				defaultPageSize={defaultPageSize}
				showSizeChanger={false}
				onChange={(page) => {
					onPaginationChange(page, pageSize)
				}}
			/>
			{showSizeChanger && !isEmpty(pageSizeOptions) && (
				<div className={cx('custom-dropdown', { 'is-open': isSizeChangerOpen, disabled })} ref={pageSizeChangerRef}>
					<button className={'selector'} type={'button'} disabled={disabled} onClick={() => setIsSizeChangerOpen(!isSizeChangerOpen)}>
						{`${pageSize} / ${t('loc:strana')}`}
					</button>
					<div className={'custom-dropdown-menu'}>
						<ul>
							{pageSizeOptions.map((limit: number, index: number) => {
								const selected = pageSize === limit
								return (
									<li
										className={cx({ selected })}
										key={index}
										onClick={() => {
											if (!selected || disabled) {
												onPaginationChange(current, limit)
											}
											setIsSizeChangerOpen(false)
										}}
									>
										{`${limit} / ${t('loc:strana')}`}
									</li>
								)
							})}
						</ul>
					</div>
				</div>
			)}
		</Row>
	) : null
}

export default CustomPagination
