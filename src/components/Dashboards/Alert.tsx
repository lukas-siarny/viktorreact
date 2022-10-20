import React from 'react'
import { isString } from 'lodash'
import { Button } from 'antd'

// assets
import { ReactComponent as ExclamationIcon } from '../../assets/icons/exclamation-pink.svg'

type Props = {
	icon?: React.ReactNode
	title: React.ReactNode
	subTitle?: React.ReactNode
	message: React.ReactNode
	actionItem?: React.ReactNode
	actionLabel?: string
	onActionItemClick?: () => void
	className?: string
}

const Alert = (props: Props) => {
	const { title, subTitle, message, actionItem, icon, actionLabel, onActionItemClick, className = '' } = props

	return (
		<div className={`min-w-full p-4 flex rounded shadow-lg bg-notino-white ${className}`}>
			<div className='h-full w-6 mr-4 pt-0-5'>{icon || <ExclamationIcon />}</div>
			<div className='w-full'>
				<div className='flex justify-between flex-start w-full flex-wrap mb-2'>
					{isString(title) ? <h4 className='m-0'>{title}</h4> : title}
					{actionItem || (
						<Button
							className='p-0 m-semibold hover:text-notino-pink focus:text-notino-pink'
							type={'link'}
							htmlType={'button'}
							onClick={() => onActionItemClick && onActionItemClick()}
						>
							{actionLabel}
						</Button>
					)}
				</div>
				{isString(subTitle) ? <p className='base-regular text-notino-grayDarker mb-1'>{subTitle}</p> : subTitle}
				{isString(message) ? <div className='base-regular text-notino-grayDarker'>{message}</div> : message}
			</div>
		</div>
	)
}

export default Alert
