import React, { FC } from 'react'
import { Popover } from 'antd'
import { isEmpty } from 'lodash'

interface TooltipListElement {
	name: string
}

type Props = {
	elements?: TooltipListElement[]
}

const PopoverList: FC<Props> = (props) => {
	const { elements } = props

	return (
		<>
			{!isEmpty(elements) && elements ? (
				<div className={'flex items-center h-max'}>
					{elements?.[0]?.name}{' '}
					{elements.length > 1 ? (
						<Popover
							placement={'right'}
							content={elements?.map((element, index) => (
								<p key={index} className={'m-0'}>
									{element.name}
								</p>
							))}
						>
							<div className={'circle'}>+ {elements.length - 1}</div>{' '}
						</Popover>
					) : (
						''
					)}
				</div>
			) : undefined}
		</>
	)
}

export default PopoverList
