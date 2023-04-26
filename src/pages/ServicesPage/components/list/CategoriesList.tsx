import React, { FC, useCallback } from 'react'
import { Collapse, CollapsePanelProps } from 'antd'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { DndContext, DragEndEvent, useDroppable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { restrictToFirstScrollableAncestor, restrictToVerticalAxis } from '@dnd-kit/modifiers'

// assets
import { ReactComponent as DragIcon } from '../../../../assets/icons/drag-icon.svg'

// types
import { IServicesListCategory, IServicesListInudstry } from '../../../../reducers/services/serviceActions'
import { HandleServicesReorderFunc } from '../../../../types/interfaces'

// components
import ServicesList from './ServicesList'

// utils
import { getExpandIcon } from '../../../../utils/helper'

type CategoriesListProps = {
	industry: IServicesListInudstry
	activeKeys: string[]
	parentPath?: string
	onChange: (newActiveKeys: string[]) => void
	reorderView: boolean
	disabledRS?: boolean
	parentIndex: number
	handleReorder: HandleServicesReorderFunc
}

type CategoryPanelProps = {
	category: IServicesListCategory
	parentPath?: string
	reorderView: boolean
	disabledRS?: boolean
	parentIndex: number
	index: number
	handleReorder: HandleServicesReorderFunc
} & Omit<CollapsePanelProps, 'header'>

const { Panel } = Collapse

const CategoryPanel: FC<CategoryPanelProps> = React.memo((props) => {
	const { category, parentPath, reorderView, disabledRS, handleReorder, parentIndex, index, ...panelProps } = props

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
	const { onChange, industry, activeKeys, parentPath, reorderView, disabledRS, handleReorder, parentIndex } = props

	const { setNodeRef } = useDroppable({
		id: industry.id
	})

	const onDragEnd = useCallback(
		async ({ active, over }: DragEndEvent) => {
			const oldIndex = industry.categories.data.findIndex((i) => i.id === active.id)
			const newIndex = industry.categories.data.findIndex((i) => i.id === over?.id)
			handleReorder([parentIndex, oldIndex], newIndex)
		},
		[handleReorder, parentIndex, industry.categories.data]
	)

	const collapse = (
		<Collapse
			bordered={false}
			activeKey={activeKeys}
			onChange={(newKeys) => onChange(typeof newKeys === 'string' ? [newKeys] : newKeys)}
			expandIcon={(panelProps) => getExpandIcon(!!panelProps.isActive, 16)}
			style={{ minWidth: 800 }}
			ref={setNodeRef}
		>
			{industry.categories.data.map((category, categoryIndex) => (
				<CategoryPanel
					key={category.id}
					category={category}
					parentPath={parentPath}
					reorderView={reorderView}
					disabledRS={disabledRS}
					parentIndex={parentIndex}
					index={categoryIndex}
					handleReorder={handleReorder}
				/>
			))}
		</Collapse>
	)

	return (
		<div className={'w-full overflow-x-auto'}>
			{reorderView ? (
				<DndContext onDragEnd={onDragEnd} modifiers={[restrictToVerticalAxis, restrictToFirstScrollableAncestor]}>
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
