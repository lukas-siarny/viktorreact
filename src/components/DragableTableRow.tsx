import React from 'react'
// eslint-disable-next-line import/no-extraneous-dependencies
import { useSortable } from '@dnd-kit/sortable'
// eslint-disable-next-line import/no-extraneous-dependencies
import { CSS } from '@dnd-kit/utilities'
import cx from 'classnames'

import { ReactComponent as DragIcon } from '../assets/icons/drag-icon.svg'

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
	'data-row-key': string
	disabled?: boolean
	dndWithHandler?: boolean
}

const DragableTableRow = ({ children, dndWithHandler = true, ...props }: RowProps) => {
	const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
		id: props['data-row-key']
	})

	const style: React.CSSProperties = {
		...props.style,
		transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
		transition,
		cursor: 'move',
		...(isDragging ? { position: 'relative', zIndex: 9999 } : {})
	}

	const dndIcon = <DragIcon style={{ touchAction: 'none', cursor: 'move' }} className={'text-notino-black w-4 h-4 flex'} />

	return dndWithHandler ? (
		<tr {...props} ref={setNodeRef} style={style} {...attributes}>
			{React.Children.map(children, (child) => {
				if ((child as React.ReactElement).key === 'sort') {
					return React.cloneElement(child as React.ReactElement, {
						children: (
							<div className={cx({ 'pointer-events-none': props.disabled })} ref={setActivatorNodeRef} {...listeners}>
								{dndIcon}
							</div>
						)
					})
				}
				return child
			})}
		</tr>
	) : (
		<tr {...props} ref={setNodeRef} style={style} {...attributes} {...listeners}>
			{React.Children.map(children, (child) => {
				if ((child as React.ReactElement).key === 'sort') {
					return React.cloneElement(child as React.ReactElement, {
						children: <div className={cx({ 'pointer-events-none': props.disabled })}>{dndIcon}</div>
					})
				}
				return child
			})}
		</tr>
	)
}

export default DragableTableRow
