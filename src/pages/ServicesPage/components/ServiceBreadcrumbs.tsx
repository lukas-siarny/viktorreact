import React, { FC } from 'react'
import cx from 'classnames'

type Props = {
	breadcrumbs: (string | undefined)[]
	wrapperClassname?: string
}

const ServiceBreadcrumbs: FC<Props> = (props) => {
	const { breadcrumbs, wrapperClassname } = props

	return breadcrumbs.length ? (
		<div className={cx('flex items-center flex-wrap gap-1', wrapperClassname)}>
			{breadcrumbs?.map((breadcrumb) =>
				breadcrumb ? (
					<div className={'service-badge'}>
						<span>{breadcrumb}</span>
					</div>
				) : null
			)}
		</div>
	) : null
}

export default ServiceBreadcrumbs
