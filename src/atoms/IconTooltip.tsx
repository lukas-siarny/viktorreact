import React, { FC } from 'react'
import { Tooltip, TooltipProps } from 'antd'

// assets
import { ReactComponent as InfoIcon16 } from '../assets/icons/info-icon.svg'

type Props = {
	title: React.ReactNode
	text: React.ReactNode
	tooltipProps?: TooltipProps
	icon?: React.ReactNode
}

const IconTooltip: FC<Props> = (props) => {
	const { title, text, tooltipProps = {}, icon = <InfoIcon16 /> } = props

	return (
		<Tooltip
			align={{ points: ['br', 'tr'] }}
			arrow={true}
			overlayClassName={'min-w-72 noti-tooltip-light'}
			trigger={'click'}
			{...tooltipProps}
			title={
				<>
					<h4 className={'mb-0 text-xs text-notino-black'}>{title}</h4>
					<p className={'mb-0 text-xs text-notino-grayDark'}>{text}</p>
				</>
			}
		>
			<div className={'mr-2 cursor-pointer shrink-0'}>{icon}</div>
		</Tooltip>
	)
}

export default React.memo(IconTooltip)
