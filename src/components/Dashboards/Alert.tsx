import React from 'react'
import { isString } from 'lodash'
import { Button } from 'antd'

// assets
import { ReactComponent as ExclamationIcon } from '../../assets/icons/exclamation-pink.svg'

type Props = {
	icon?: React.ReactNode
	title: React.ReactNode
	message: React.ReactNode
	actionItem?: React.ReactNode
	actionLabel?: string
	onActionItemClick?: () => void
	className?: string
}

const Alert = (props: Props) => {
	const { title, message, actionItem, icon, actionLabel, onActionItemClick, className = '' } = props

	return (
		<div className={`min-w-full p-4 flex rounded shadow-lg bg-notino-white ${className}`}>
			<div className='h-full w-6 mr-4'>{icon || <ExclamationIcon />}</div>
			<div className='flex justify-between'>
				<div>
					{isString(title) ? <h4>{title}</h4> : title}
					{isString(message) ? <div className='base-regular text-notino-grayDarker'>{message}</div> : message}
				</div>

				{actionItem || (
					<Button className='p-2 ml-2 m-semibold hover:text-notino-pink' type={'link'} htmlType={'button'} onClick={() => onActionItemClick && onActionItemClick()}>
						{actionLabel}
					</Button>
				)}
			</div>
		</div>
	)
}

export default Alert
