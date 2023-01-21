import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import useBackUrl from '../hooks/useBackUrl'
import { ReactComponent as BreadcrumbSeparator } from '../assets/icons/breadcrumb-separator.svg'

import { ReactComponent as BackButtonIcon } from '../assets/icons/back-icon.svg'

type Props = {
	path: string
	defaultBackButtonAction?: any // Extra akcia ktora sa ma vykonat ku presmerovaniu (eg. premazat urcite data pri kliknuti spat atd...)
	showSeparator?: boolean
	className?: string
}

const BackButton = ({ path, defaultBackButtonAction, showSeparator = true, className }: Props) => {
	const [t] = useTranslation()
	const [backUrlLink] = useBackUrl(path)

	return backUrlLink ? (
		<div className={cx('flex items-center', className)}>
			<Link className={'flex items-center group'} onClick={defaultBackButtonAction} to={backUrlLink}>
				<BackButtonIcon className={'small-icon text-gray-600 group-hover:text-notino-black mr-1'} />
				<span className='text-gray-600 align-text-bottom text-base font-normal group-hover:text-notino-black'>{t('loc:Späť')}</span>
			</Link>
			{showSeparator && <BreadcrumbSeparator className={'text-gray-600'} />}
		</div>
	) : null
}

export default BackButton
