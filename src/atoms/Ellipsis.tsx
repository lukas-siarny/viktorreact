import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'

type Props = {
	text: string
	maxLength?: number
	className?: string
}

const Ellipsis = (props: Props) => {
	const { text, maxLength = 100, className } = props
	const [t] = useTranslation()

	const [expadned, setExpaned] = useState(false)
	const showEllipsis = text.length > maxLength

	return (
		<p className={className}>
			<span className={cx({ 'mr-1': showEllipsis })}>{expadned ? text : `${text.slice(0, maxLength)}${showEllipsis ? '…' : ''}`}</span>
			{showEllipsis && (
				<button
					type={'button'}
					className={'underline cursor-pointer break-normal outline-none border-none bg-transparent p-0 noti-show-more-button'}
					onClick={() => setExpaned(!expadned)}
				>
					{expadned ? t('loc:zobraziť menej') : t('loc:zobraziť viac')}
				</button>
			)}
		</p>
	)
}

export default Ellipsis
