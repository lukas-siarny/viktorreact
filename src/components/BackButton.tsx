import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import useBackUrl from '../hooks/useBackUrl'
import { ReactComponent as BreadcrumbSeparator } from '../assets/icons/breadcrumb-separator.svg'

import { ReactComponent as BackButtonIcon } from '../assets/icons/back-icon.svg'

type Props = {
	path: string
	defaultBackButtonAction?: any // Extra akcia ktora sa ma vykonat ku presmerovaniu (eg. premazat urcite data pri kliknuti spat atd...)
}

const BackButton = ({ path, defaultBackButtonAction }: Props) => {
	const [t] = useTranslation()
	const [backUrlLink] = useBackUrl(path)

	return backUrlLink ? (
		<div className={'flex items-center'}>
			<Link className={'flex items-center group'} onClick={defaultBackButtonAction} to={backUrlLink}>
				<BackButtonIcon className={'small-icon text-gray-600 group-hover:textColor-notino-black'} />
				<span className='text-gray-600 align-text-bottom text-xs font-normal group-hover:textColor-notino-black'>{t('loc:Späť')}</span>
			</Link>
			<BreadcrumbSeparator className={'text-gray-600'} />
		</div>
	) : null
}

export default BackButton
