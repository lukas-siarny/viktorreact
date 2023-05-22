import React, { FC, useCallback } from 'react'
import { Collapse, CollapsePanelProps } from 'antd'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { DndContext, DragEndEvent, closestCenter, useDroppable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { restrictToFirstScrollableAncestor, restrictToVerticalAxis } from '@dnd-kit/modifiers'

// assets
import { ReactComponent as DragIcon } from '../../../../assets/icons/drag-icon.svg'

// types
import { IServicesListCategory, IServicesListInudstry } from '../../../../reducers/services/serviceActions'
import { HandleServicesReorderFunc, ServicesActiveKeys } from '../../../../types/interfaces'

// components
import ServicesList from './ServicesList'

// utils
import { getExpandIcon } from '../../../../utils/helper'

type CategoriesListProps = {
	industry: IServicesListInudstry
	activeKeys: ServicesActiveKeys
	parentPath?: string
	onChange: (newActiveKeys: string[]) => void
	reorderView: boolean
	disabledRS?: boolean
	parentIndex: number
	handleReorder: HandleServicesReorderFunc
	salonID: string
}

type CategoryPanelProps = {
	category: IServicesListCategory
	activeKeys: ServicesActiveKeys
	parentPath?: string
	reorderView: boolean
	disabledRS?: boolean
	parentIndex: number
	index: number
	handleReorder: HandleServicesReorderFunc
	salonID: string
} & Omit<CollapsePanelProps, 'header'>

const { Panel } = Collapse

const CategoryPanel: FC<CategoryPanelProps> = React.memo((props) => {
	const { category, parentPath, reorderView, disabledRS, handleReorder, parentIndex, index, activeKeys, salonID, ...panelProps } = props

	const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
		id: category.id
	})

	const style: React.CSSProperties = {
		...props.style,
		transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
		transition,
		...(isDragging ? { position: 'relative', zIndex: 9999 } : {})
	}

	return (
		<Panel
			{...panelProps}
			ref={setNodeRef}
			className={'panel panel-category'}
			header={<h4>{category.name}</h4>}
			extra={
				reorderView ? (
					// eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
					<div className={'draggable-icon'} onClick={(e) => e.stopPropagation()} ref={setActivatorNodeRef} {...listeners}>
						<DragIcon width={12} height={12} />
					</div>
				) : null
			}
			style={style}
			{...attributes}
		>
			<ServicesList
				category={category}
				parentPath={parentPath}
				reorderView={reorderView}
				disabledRS={disabledRS}
				parentIndexes={[parentIndex, index]}
				handleReorder={handleReorder}
			/>
		</Panel>
	)
})

const CategoriesList: FC<CategoriesListProps> = (props) => {
	const { onChange, industry, activeKeys, parentPath, reorderView, disabledRS, handleReorder, parentIndex, salonID } = props

	const { setNodeRef } = useDroppable({
		id: industry.id
	})

	const onDragEnd = useCallback(
		async ({ active, over }: DragEndEvent) => {
			if (active.id && over?.id) {
				let newIndex: number | undefined
				let oldIndex: number | undefined

				for (let i = 0; i < industry.categories.data.length; i += 1) {
					if (newIndex !== undefined && oldIndex !== undefined) {
						break
					}
					if (industry.categories.data[i].id === active.id) {
						oldIndex = i
					}
					if (industry.categories.data[i].id === over.id) {
						newIndex = i
					}
				}
				if (oldIndex !== undefined && newIndex !== undefined) {
					handleReorder([parentIndex, oldIndex], newIndex)
				}
			}
		},
		[handleReorder, parentIndex, industry.categories.data]
	)

	const collapse = (
		<Collapse
			bordered={false}
			activeKey={activeKeys.categories}
			onChange={(newKeys) => onChange(typeof newKeys === 'string' ? [newKeys] : newKeys)}
			expandIcon={(panelProps) => getExpandIcon(!!panelProps.isActive, 16)}
			style={{ minWidth: 800 }}
			ref={setNodeRef}
		>
			{industry.categories.data.map((category, categoryIndex) => (
				<CategoryPanel
					key={category.id}
					activeKeys={activeKeys}
					category={category}
					parentPath={parentPath}
					reorderView={reorderView}
					disabledRS={disabledRS}
					parentIndex={parentIndex}
					index={categoryIndex}
					handleReorder={handleReorder}
					salonID={salonID}
				/>
			))}
		</Collapse>
	)

	return (
		<div className={'w-full overflow-x-auto overflow-y-hidden'}>
			{reorderView ? (
				<DndContext onDragEnd={onDragEnd} modifiers={[restrictToVerticalAxis, restrictToFirstScrollableAncestor]} collisionDetection={closestCenter}>
					<SortableContext
						// category ids
						items={industry.categories.data.map((category) => category.id)}
						strategy={verticalListSortingStrategy}
					>
						{collapse}
					</SortableContext>
				</DndContext>
			) : (
				collapse
			)}
		</div>
	)
}

export default React.memo(CategoriesList)
