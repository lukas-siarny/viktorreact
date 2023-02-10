import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { ReactComponent as DragIcon } from '../assets/icons/drag-icon.svg'

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
	'data-row-key': string
}

const Row = ({ children, ...props }: RowProps) => {
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
							<div ref={setActivatorNodeRef} {...listeners}>
								<DragIcon style={{ touchAction: 'none', cursor: 'move' }} className={'text-blue-600'} />
							</div>
						)
					})
				}
				return child
			})}
		</tr>
	)
}

export default Row
