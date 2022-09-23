import React, { useCallback, useEffect } from 'react'

import { forEach, includes } from 'lodash'
import cx from 'classnames'

// ant
import { Empty, Table } from 'antd'
import { TableProps } from 'antd/lib/table'
import CustomPagination from './CustomPagination'
import { IPagination } from '../types/interfaces'

type ComponentProps<RecordType> = TableProps<RecordType> & {
	emptyText?: string
	twoToneRows?: boolean
	emptyStateButton?: JSX.Element
	withoutIDColumn?: boolean
	IDColumnDataIndex?: Array<string>
	disabled?: boolean
	onRow?: Function
	/*
		useCustomPagination - custom pagination is used instead of table internal one - so table onChange callback won't send information about pagination in this case
		it is necessary to declare onChange callback in pagination config for pagination info in this case

		pagination={{
			...,
			pageSize: 20,
			total: 30,
			onChange: (page, pageSize) => {}
		}}
	*/
	useCustomPagination?: boolean
	pagination?: IPagination | false
}

const CustomTable = <RecordType extends object = any>(props: ComponentProps<RecordType>) => {
	const { disabled = false, className, columns, onRow, useCustomPagination, pagination } = props

	const onClickOptionSizeChanger = useCallback(
		(e: any) => {
			// NOTE: fix TP-1909
			if (includes(className, 'table-fixed') && e) {
				const childrenCount = e.currentTarget?.children?.length || 0
				const item = e.currentTarget?.children?.[childrenCount - 1]?.children?.[0]?.children?.[0]
				if (item) {
					setTimeout(() => {
						item.classList.remove('ant-select-dropdown-placement-bottomLeft')
						item.classList.add('ant-select-dropdown-placement-topLeft')
						item.style.top = '-100px'
					}, 300) // NOTE: 300ms is bypass for animations dropdown. So prevent to overwirtten this code with animation classes
				}
			}
		},
		[className]
	)

	useEffect(() => {
		forEach(document.getElementsByClassName('$textColor-notino-black'), (item) => {
			const selectBox = item.getElementsByClassName('ant-pagination-options-size-changer')?.[0]
			selectBox.addEventListener('click', onClickOptionSizeChanger)
		})
		return () => {
			forEach(document.getElementsByClassName('$textColor-notino-black'), (item) => {
				const selectBox = item.getElementsByClassName('ant-pagination-options-size-changer')?.[0]
				selectBox.removeEventListener('click', onClickOptionSizeChanger)
			})
		}
	}, [onClickOptionSizeChanger])

	const emptyLocale = props.emptyText
		? {
				emptyText: (
					<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={props.emptyText}>
						{props.emptyStateButton}
					</Empty>
				)
		  }
		: undefined

	const loadingWrap = props.loading

	return (
		<div className={cx({ 'disabled-state': disabled })}>
			<Table
				{...props}
				columns={columns}
				loading={loadingWrap}
				defaultExpandAllRows
				className={cx('noti-table', props.className, { 'two-tone-table-style': props.twoToneRows })}
				onRow={onRow}
				pagination={
					useCustomPagination
						? false
						: pagination &&
						  ({
								...pagination,
								className: 'ant-table-pagination ant-table-pagination-right'
						  } as any)
				}
				locale={emptyLocale}
				bordered={props.bordered || false}
			/>
			{useCustomPagination && pagination && (
				<div className='table-footer-custom-pagination'>
					<CustomPagination {...pagination} />
				</div>
			)}
		</div>
	)
}

export default CustomTable
