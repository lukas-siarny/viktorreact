import React, { FC, useCallback } from 'react'
import { Button, Collapse, CollapsePanelProps } from 'antd'
import { useTranslation } from 'react-i18next'
import { NavigateFunction, useNavigate } from 'react-router'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { DndContext, DragEndEvent, useDroppable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { restrictToFirstScrollableAncestor, restrictToVerticalAxis } from '@dnd-kit/modifiers'

// assets
import { TFunction } from 'i18next'
import { ReactComponent as DragIcon } from '../../../../assets/icons/drag-icon.svg'

import { HandleServicesReorderFunc, ServicesActiveKeys } from '../../../../types/interfaces'
import { getExpandIcon } from '../../../../utils/helper'
import { IServicesListInudstry } from '../../../../reducers/services/serviceActions'
import { STRINGS } from '../../../../utils/enums'
import CategoriesList from './CategoriesList'

type IndustriesListProps = {
	idustriesData: IServicesListInudstry[]
	activeKeys: ServicesActiveKeys
	setActiveKeys: (newActiveKeys: ServicesActiveKeys) => void
	reorderView: boolean
	parentPath?: string
	disabledRS?: boolean
	handleReorder: HandleServicesReorderFunc
}

type IndustryPanelProps = {
	industry: IServicesListInudstry
	parentPath?: string
	reorderView: boolean
	disabledRS?: boolean
	index: number
	handleReorder: HandleServicesReorderFunc
	navigate: NavigateFunction
	t: TFunction
	activeKeys: ServicesActiveKeys
	setActiveKeys: (newActiveKeys: ServicesActiveKeys) => void
} & Omit<CollapsePanelProps, 'header'>

const { Panel } = Collapse

const IndustryPanel: FC<IndustryPanelProps> = React.memo((props) => {
	const { industry, parentPath, reorderView, disabledRS, handleReorder, index, navigate, activeKeys, setActiveKeys, t, ...panelProps } = props

	const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
		id: industry.id
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
			header={
				<h3>
					{industry.name} ({industry.categories.servicesCount})
				</h3>
			}
			className={'panel panel-industry'}
			extra={
				reorderView ? (
					// eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
					<div className={'draggable-icon'} onClick={(e) => e.stopPropagation()} ref={setActivatorNodeRef} {...listeners}>
						<DragIcon width={16} height={16} />
					</div>
				) : null
			}
			style={style}
			{...attributes}
		>
			{!industry.categories.servicesCount ? (
				<div className={'w-full justify-center text-center p-2'}>
					<p>{t('loc:K tomuto oboru zatiaľ nemáte priradené žiadne služby.')}</p>
					<Button
						type={'primary'}
						className={'noti-btn'}
						onClick={() => navigate(parentPath + t('paths:industries-and-services/{{industryID}}', { industryID: industry.id }))}
					>
						{STRINGS(t).assign(t('loc:služby'))}
					</Button>
				</div>
			) : (
				<CategoriesList
					parentPath={parentPath}
					industry={industry}
					activeKeys={activeKeys.categories}
					onChange={(newKeys: string[]) => setActiveKeys({ ...activeKeys, categories: newKeys })}
					reorderView={reorderView}
					disabledRS={disabledRS}
					handleReorder={handleReorder}
					parentIndex={index}
				/>
			)}
		</Panel>
	)
})

const IndustriesList: FC<IndustriesListProps> = (props) => {
	const [t] = useTranslation()
	const navigate = useNavigate()
	const { activeKeys, setActiveKeys, idustriesData, reorderView, parentPath, disabledRS, handleReorder } = props

	const { setNodeRef } = useDroppable({
		id: 'parent-droppable'
	})

	const onDragEnd = useCallback(
		async ({ active, over }: DragEndEvent) => {
			const oldIndex = idustriesData.findIndex((i) => i.id === active.id)
			const newIndex = idustriesData.findIndex((i) => i.id === over?.id)
			handleReorder([oldIndex], newIndex)
		},
		[handleReorder, idustriesData]
	)

	const collapse = (
		<Collapse
			bordered={false}
			activeKey={activeKeys.industries}
			onChange={(newKeys) => setActiveKeys({ ...activeKeys, industries: typeof newKeys === 'string' ? [newKeys] : newKeys })}
			expandIcon={(panelProps) => getExpandIcon(!!panelProps.isActive)}
			ref={setNodeRef}
		>
			{idustriesData.map((industry, industryIndex) => {
				return (
					<IndustryPanel
						key={industry.id}
						industry={industry}
						parentPath={parentPath}
						reorderView={reorderView}
						disabledRS={disabledRS}
						index={industryIndex}
						handleReorder={handleReorder}
						navigate={navigate}
						t={t}
						activeKeys={activeKeys}
						setActiveKeys={setActiveKeys}
					/>
				)
			})}
		</Collapse>
	)

	return reorderView ? (
		<DndContext onDragEnd={onDragEnd} modifiers={[restrictToVerticalAxis, restrictToFirstScrollableAncestor]}>
			<SortableContext
				// industry ids
				items={idustriesData.map((industry) => industry.id)}
				strategy={verticalListSortingStrategy}
			>
				{collapse}
			</SortableContext>
		</DndContext>
	) : (
		collapse
	)
}

export default React.memo(IndustriesList)
