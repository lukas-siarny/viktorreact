import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { forEach, includes, isEmpty } from 'lodash'
import cx from 'classnames'

// Drag and drop
import type { DragEndEvent } from '@dnd-kit/core'
import { DndContext } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

// ant
import { Empty, Table } from 'antd'
import { TableProps } from 'antd/lib/table'

// components
import CustomPagination from './CustomPagination'
import { IPagination } from '../types/interfaces'
import DragableTableRow from './DragableTableRow'
import { ReactComponent as DragIcon } from '../assets/icons/drag-icon.svg'
import { TABLE_DRAG_AND_DROP_KEY } from '../utils/enums'

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
	wrapperClassName?: string
	dndDrop?: (oldIndex: number, newIndex: number) => any
	customFooterContent?: React.ReactNode
}

const CustomTable = <RecordType extends object = any>(props: ComponentProps<RecordType>) => {
	const { disabled = false, className, useCustomPagination, pagination, dndDrop, wrapperClassName, customFooterContent } = props
	const [isProcessingDrop, setIsProcessingDrop] = useState(false)

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

	const onDragEnd = useCallback(
		async ({ active, over }: DragEndEvent) => {
			const oldIndex = Number(active.id)
			const newIndex = Number(over?.id)

			if (isProcessingDrop) {
				return
			}
			try {
				setIsProcessingDrop(true)
				await dndDrop?.(oldIndex, newIndex)
				setIsProcessingDrop(false)
			} catch (e) {
				// eslint-disable-next-line no-console
				console.error(e)
				setIsProcessingDrop(false)
			}
		},
		[dndDrop, isProcessingDrop]
	)

	const emptyLocale = props.emptyText
		? {
				emptyText: (
					<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={props.emptyText}>
						{props.emptyStateButton}
					</Empty>
				)
		  }
		: undefined

	let loadingWrap = props.loading

	if (dndDrop && !isEmpty(props.dataSource)) {
		loadingWrap = false
	}
	// NOTE: Memo fixuje problém infinite volaní akcie UPDATE_SYNC_ERRORS pri dnd tabuľkách
	const componentsWrap = useMemo(() => {
		let components = props?.components
		if (dndDrop) {
			components = {
				...props?.components,
				body: {
					...props?.components?.body,
					// eslint-disable-next-line react/no-unstable-nested-components
					row(rowProps: any) {
						return <DragableTableRow disabled={Number(props.dataSource?.length) < 2} {...rowProps} />
					}
				}
			}
		}
		return components
	}, [dndDrop, props?.components])

	let columns = props?.columns || []
	const isFirstColFixed = props?.columns?.[0]?.fixed ? true : undefined

	if (dndDrop) {
		// Samostatny column aby sa nedrag and dropoval cely riadok ale len cast stlpa (moze sa dat kliknut na riadok na prepnutie detailu entity)
		const DND_COL = {
			key: TABLE_DRAG_AND_DROP_KEY,
			title: <DragIcon style={{ touchAction: 'none', cursor: 'default' }} className={'w-4 h-4 flex'} />,
			width: 25,
			fixed: isFirstColFixed
		}
		columns = [DND_COL, ...columns]
	}
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
						// TODO: ceckovat permissiony na pracu cez drag and dro v tabulke?
						const hasPerm = true
						// if (props.onRowOnClickPermissions && onRowProp?.onClick) {
						// 	hasPerm = checkPermissions(props.onRowOnClickPermissions)
						// }

						if (!hasPerm) {
							// showNotifications([{ type: MSG_TYPE.ERROR, message: t('loc:Pre túto akciu nemáte dostatočné oprávnenia.') }], NOTIFICATION_TYPE.NOTIFICATION)
						} else if (clickInsideRow && onRowProp?.onClick) {
							;(onRowProp.onClick as any)(e, ignoreCellClick)
						}
				  }
				: undefined,
			index
		}

		return rowProps
	}

	const table = (
		<div className={cx('noti-table-wrapper', { 'disabled-state': disabled }, wrapperClassName)}>
			{/* // TODO: ak by trebalo tak wrappnut tabulku kvoli dnd do permissions - moze byt pouzivatel ktory ma prava na citanie ale nie na upravu? */}
			<Table
				{...props}
				columns={columns}
				loading={loadingWrap}
				defaultExpandAllRows
				className={cx('noti-table', props.className, { 'two-tone-table-style': props.twoToneRows })}
				onRow={onRow}
				components={componentsWrap}
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
					{customFooterContent}
					<CustomPagination {...pagination} />
				</div>
			)}
		</div>
	)

	if (dndDrop) {
		return (
			<DndContext onDragEnd={onDragEnd}>
				<SortableContext
					// rowKey array
					items={props.dataSource && (props.dataSource.map((item: any) => item.key) as any)}
					strategy={verticalListSortingStrategy}
				>
					{table}
				</SortableContext>
			</DndContext>
		)
	}
	return table
}

export default CustomTable
