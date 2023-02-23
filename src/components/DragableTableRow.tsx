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
}

const DragableTableRow = ({ children, ...props }: RowProps) => {
	const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
		id: props['data-row-key']
	})

	const style: React.CSSProperties = {
		...props.style,
		transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
		transition,
		...(isDragging ? { position: 'relative', zIndex: 9999 } : {})
	}

	return (
		<tr {...props} ref={setNodeRef} style={style} {...attributes}>
			{React.Children.map(children, (child) => {
				if ((child as React.ReactElement).key === 'sort') {
					return React.cloneElement(child as React.ReactElement, {
						children: (
							<div className={cx({ 'pointer-events-none': props.disabled })} ref={setActivatorNodeRef} {...listeners}>
								<DragIcon style={{ touchAction: 'none', cursor: 'move' }} className={'text-notino-pink w-4 h-4 flex'} />
							</div>
						)
					})
				}
				return child
			})}
		</tr>
	)
}

export default DragableTableRow
