import React from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import { PAGE } from '../utils/enums'

type Props = {
	pageEnum: PAGE
	showInMenu?: boolean
}
// Sluzi na conditionane renderovanie badgu s textom New podla toho co je setnute v localStoragi
const NewBadge = (props: Props) => {
	const [t] = useTranslation()
	const { pageEnum, showInMenu } = props
	const hideBadge = localStorage.getItem(`hide-${pageEnum}-badge`)

	return (
		<span
			className={cx('ml-4 bg-notino-pink text-white rounded-full leading-none', {
				hide: hideBadge,
				'text-[10px] px-1 py-0-5': showInMenu,
				'px-3 py-1 text-sm': !showInMenu
			})}
		>
			{t('loc:Nové')}
		</span>
	)
}

export default NewBadge
