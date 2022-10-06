import React from 'react'
import { Breadcrumb } from 'antd'
import { Link } from 'react-router-dom'
import { map } from 'lodash'
import cx from 'classnames'

// components
import BackButton from './BackButton'
import { ReactComponent as BreadcrumbSeparator } from '../assets/icons/breadcrumb-separator.svg'

import { IBreadcrumbs, IBreadcrumbItem } from '../types/interfaces'

const { Item } = Breadcrumb

type Props = {
	breadcrumbs?: IBreadcrumbs
	backButtonPath?: string
	defaultBackButtonAction?: any
}

const Breadcrumbs = (props: Props) => {
	const { breadcrumbs, backButtonPath, defaultBackButtonAction } = props

	return (
		<div className={'flex items-center flex-wrap w-full mb-2 mt-2'}>
			{backButtonPath && <BackButton path={backButtonPath} defaultBackButtonAction={defaultBackButtonAction} />}
			{breadcrumbs && (
				<Breadcrumb className={'noti-breadcrumb'} separator={<BreadcrumbSeparator className={'text-gray-600'} />}>
					{map(breadcrumbs.items, (item: IBreadcrumbItem, index) => (
						<Item className={cx({ last: index + 1 === breadcrumbs.items.length })} key={index}>
							{item.link ? (
								<Link onClick={item.action} to={item.link} className={'group flex'}>
									<span className='text-gray-600 text-base group-hover:text-notino-black font-normal'>{item.name}</span>
									{item.titleName && <span className={'text-gray-600 group-hover:text-notino-black text-base'}> - {item.titleName}</span>}
								</Link>
							) : (
								<>
									<span className='text-gray-600 text-base font-normal'>{item.name}</span>
									{item.titleName && <span className={'text-gray-600 text-base'}>&nbsp; - {item.titleName}</span>}
								</>
							)}
						</Item>
					))}
				</Breadcrumb>
			)}
		</div>
	)
}

export default Breadcrumbs
