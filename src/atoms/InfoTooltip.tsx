import React, { FC } from 'react'
import { Tooltip, TooltipProps } from 'antd'

// assets
import { ReactComponent as InfoIcon16 } from '../assets/icons/info-icon-16.svg'

type Props = {
	title: React.ReactNode
	text: React.ReactNode
	tooltipProps?: TooltipProps
}

const InfoTooltipLight: FC<Props> = (props) => {
	const { title, text, tooltipProps = {} } = props

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
					<p className={'mb-0 text-xs'} style={{ color: '#6D7483' }}>
						{text}
					</p>
				</>
			}
		>
			<InfoIcon16 className={'mr-2 cursor-pointer shrink-0'} />
		</Tooltip>
	)
}

export default React.memo(InfoTooltipLight)
