import React, { FC } from 'react'
import cx from 'classnames'
import { Tooltip } from 'antd'

interface TooltipListElement {
	name: string
}

type Props = {
	className?: string
	elements?: TooltipListElement[]
}

const TooltipList: FC<Props> = (props) => {
	const { elements, className } = props
	return (
		<Tooltip
			title={() => {
				elements?.map((element) => <div className={cx('text-gray-600 text-xs', className)}>{element.name}</div>)
			}}
		>
			{`${elements?.[0]?.name} +`}
		</Tooltip>
	)
}

export default TooltipList
