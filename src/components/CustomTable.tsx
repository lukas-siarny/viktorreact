/* eslint-disable import/no-cycle */
import React, { useCallback, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import { forEach, includes } from 'lodash'
import cx from 'classnames'

// ant
import { Empty, Table } from 'antd'
import { TableProps } from 'antd/lib/table'

type ComponentProps<RecordType> = TableProps<RecordType> & {
	emptyText?: string
	twoToneRows?: boolean
	emptyStateButton?: JSX.Element
	withoutIDColumn?: boolean
	IDColumnDataIndex?: Array<string>
	disabled?: boolean
}

const CustomTable = <RecordType extends object = any>(props: ComponentProps<RecordType>) => {
	const { disabled = false, className, columns } = props

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

	// const userSettings = useSelector((state: RootState) => state.user.settings)
	const dispatch = useDispatch()
	const [t] = useTranslation()

	const onChange = useCallback(
		(page: number, pageSize?: number | undefined) => {
			if (props.pagination && props.pagination.onChange) {
				props.pagination.onChange(page, pageSize)
			}
			// if (pageSize && userSettings.data?.pagination !== pageSize) {
			// dispatch(updateUserSettings({ pagination: pageSize }))
			// }
		},
		[props.pagination, dispatch]
	)

	useEffect(() => {
		// NOTE: fix TP-1909
		forEach(document.getElementsByClassName('custom-table-pagination'), (item) => {
			const selectBox = item.getElementsByClassName('ant-pagination-options-size-changer')?.[0]
			selectBox.addEventListener('click', onClickOptionSizeChanger)
		})
		return () => {
			forEach(document.getElementsByClassName('custom-table-pagination'), (item) => {
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

	const onRow = (record: any, index?: number) => {
		const onRowProp = props?.onRow?.(record, index)
		const rowProps: any = {
			...onRowProp,
			onClick: onRowProp?.onClick
				? (e: React.MouseEvent<HTMLElement>) => {
						const { target } = e as any
						const ignoreCellClick = target ? !!target.closest('.ignore-cell-click') : false

						// NOTE: Kliknutie vo vnútri delete popconfirmu sposobovalo otvorenie detailu (kliknutie mimo riadok)
						let clickInsideRow
						if (target.closest('.ant-table-row')) {
							clickInsideRow = true
						}
				  }
				: undefined,
			index
		}

		return rowProps
	}

	return (
		<div className={cx({ 'disabled-state': disabled })}>
			<Table
				{...props}
				columns={columns}
				loading={loadingWrap}
				defaultExpandAllRows
				className={cx('noti-table', props.className, { 'two-tone-table-style': props.twoToneRows })}
				onRow={onRow as any}
				pagination={
					props.pagination &&
					({
						// userSettings.data?.pagination
						pageSize: 1,
						...props.pagination,
						onChange,
						className: ' ant-table-pagination ant-table-pagination-right custom-table-pagination'
					} as any)
				}
				locale={emptyLocale}
				bordered={props.bordered || false}
			/>
		</div>
	)
}

export default CustomTable
