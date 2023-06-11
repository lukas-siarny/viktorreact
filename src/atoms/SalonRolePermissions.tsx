import React, { FC } from 'react'
import cx from 'classnames'

// types
import { ISalonRolePermission } from '../types/interfaces'

// assets
import { ReactComponent as CheckIcon } from '../assets/icons/check-icon-circle-filled-icon.svg'
import { ReactComponent as CrossedIcon } from '../assets/icons/checkbox-rejected.svg'

type Props = {
	permissions: ISalonRolePermission[]
	className?: string
}

const SalonRolePermissions: FC<Props> = (props) => {
	const { permissions, className } = props

	return (
		<ul className={cx('list-none pl-0 flex flex-col gap-1', className)}>
			{permissions?.map((permission, i) => {
				const icon = permission.checked ? <CheckIcon className={'text-notino-pink'} /> : <CrossedIcon />
				return (
					<li key={i} className={'flex items-start gap-2'}>
						<span>{icon}</span>
						<span>{permission.description}</span>
					</li>
				)
			})}
		</ul>
	)
}

export default SalonRolePermissions
