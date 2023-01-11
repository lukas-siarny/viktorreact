import React from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { forEach, isArray } from 'lodash'

const type = 'DragableBodyRow'

// NOTE: https://ant.design/components/table/#components-table-demo-drag-sorting
const DragableTableRow = (props: any) => {
	const { index, dndDrop, className, dndCanDrag, children, ...restProps } = props

	const rowRef = React.useRef()
	let cells = children

	const [{ isOver, dropClassName }, drop] = useDrop({
		accept: type,
		collect: (monitor: any) => {
			const { index: dragIndex } = monitor.getItem() || {}
			if (dragIndex === index) {
				return {}
			}
			return {
				isOver: monitor.isOver(),
				dropClassName: dragIndex < index ? ' drop-over-downward' : ' drop-over-upward'
			}
		},
		drop: (item: any) => {
			dndDrop?.(item.index, index)
		}
	})

	const [, drag, preview] = useDrag({
		type,
		item() {
			// NOTE: Na začiatok dragovania schovaj tooltip aby nezavadzal pri dropovaní
			const tooltips = window.document.getElementsByClassName('ant-tooltip')
			forEach(tooltips, (tooltipEl) => tooltipEl?.classList?.add('ant-tooltip-hidden'))
			return { index }
		},
		collect: (monitor: any) => ({
			isDragging: monitor.isDragging()
		}),
		canDrag: dndCanDrag
	})

	// NOTE: Pre fungovanie dragovania musí mať tabuľka aspoň 2 stlĺpce
	if (isArray(children) && children.length >= 2) {
		const [firstCell, ...restCells] = children
		const draggableCell = React.cloneElement(firstCell, { ref: drag })
		cells = [draggableCell, ...restCells]
	}

	if (dndDrop) {
		preview(drop(rowRef))
	}

	return (
		<tr ref={rowRef} className={`${className}${isOver ? dropClassName : ''}`} {...restProps}>
			{cells}
		</tr>
	)
}

export default DragableTableRow
