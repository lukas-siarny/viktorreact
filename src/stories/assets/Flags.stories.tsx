/* eslint-disable import/no-extraneous-dependencies */
import React from 'react'
import { ReactComponent as BYIcon } from '../../assets/flags/BY.svg'
import { ReactComponent as CZIcon } from '../../assets/flags/CZ.svg'
import { ReactComponent as GBIcon } from '../../assets/flags/GB.svg'
import { ReactComponent as HUIcon } from '../../assets/flags/HU.svg'
import { ReactComponent as ITIcon } from '../../assets/flags/IT.svg'
import { ReactComponent as ROIcon } from '../../assets/flags/RO.svg'
import { ReactComponent as SKIcon } from '../../assets/flags/SK.svg'
import { ReactComponent as USAIcon } from '../../assets/flags/USA.svg'

export default {
	title: 'Assets/Flags'
}

export const AllFlags = () => {
	return (
		<div className='flex gap-3 flex-wrap'>
			<BYIcon />
			<CZIcon />
			<GBIcon />
			<HUIcon />
			<ITIcon />
			<ROIcon />
			<SKIcon />
			<USAIcon />
		</div>
	)
}
