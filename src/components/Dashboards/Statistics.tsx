import React from 'react'
import { Button } from 'antd'
import { useTranslation } from 'react-i18next'

// assets
import { ReactComponent as ChevronIcon } from '../../assets/icons/chevron-pink.svg'

type Props = {
	title: React.ReactNode
	count: React.ReactNode
	actionLabel?: React.ReactNode
	onActionItemClick: () => void
	className?: string
}

const Statistics = (props: Props) => {
	const [t] = useTranslation()
	const { title, count, actionLabel = t('loc:Zobraziť'), onActionItemClick, className = '' } = props

	return (
		<div className={`relative rounded shadow-lg bg-notino-white p-4 min-h-40 ${className}`}>
			<div className='w-full m-regular text-notino-grayDark mb-2'>{title}</div>
			<div className='absolute bottom-4 left-4 right-4'>
				<h3>{count}</h3>
				<Button
					className='float-right m-semibold p-0 flex h-auto hover:text-notino-pink focus:text-notino-pink'
					type={'link'}
					htmlType={'button'}
					onClick={onActionItemClick}
				>
					{actionLabel}
					<ChevronIcon className='ml-2' />
				</Button>
			</div>
		</div>
	)
}

export default Statistics
