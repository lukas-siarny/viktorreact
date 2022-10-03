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
		<div className={`relative rounded shadow-lg bg-notino-white p-4 ${className}`}>
			<div className='w-full m-regular text-notino-grayDark mb-2'>{title}</div>
			<h3 className='mb-2'>{count}</h3>
			<Button className='absolute bottom-4 right-4 m-semibold p-0 flex h-auto hover:text-notino-pink' type={'link'} htmlType={'button'} onClick={onActionItemClick}>
				{actionLabel}
				<ChevronIcon className='ml-2' />
			</Button>
		</div>
	)
}

export default Statistics
