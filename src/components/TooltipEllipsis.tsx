import React, { FC } from 'react'
import cx from 'classnames'
import { Tooltip, TooltipProps } from 'antd'

type Props = TooltipProps & {
	contentClassName?: string
}

const TooltipEllipsis: FC<Props> = (props) => {
	const { title, children, contentClassName } = props
	return (
		<Tooltip title={title}>
			<div className={cx('text-gray-600 text-xs', contentClassName)}>{children}</div>
		</Tooltip>
	)
}

export default TooltipEllipsis

export const TooltipEllipsisWrapper = React.memo(TooltipEllipsis)
