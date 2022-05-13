/* eslint-disable import/no-extraneous-dependencies */
import React from 'react'
import { ReactComponent as ATIcon } from '../../assets/flags/AT.svg'
import { ReactComponent as BEIcon } from '../../assets/flags/BE.svg'
import { ReactComponent as BYIcon } from '../../assets/flags/BY.svg'
import { ReactComponent as CHIcon } from '../../assets/flags/CH.svg'
import { ReactComponent as CZIcon } from '../../assets/flags/CZ.svg'
import { ReactComponent as DEIcon } from '../../assets/flags/DE.svg'
import { ReactComponent as DKIcon } from '../../assets/flags/DK.svg'
import { ReactComponent as ESIcon } from '../../assets/flags/ES.svg'
import { ReactComponent as FIIcon } from '../../assets/flags/FI.svg'
import { ReactComponent as FRIcon } from '../../assets/flags/FR.svg'
import { ReactComponent as GBIcon } from '../../assets/flags/GB.svg'
import { ReactComponent as GRIcon } from '../../assets/flags/GR.svg'
import { ReactComponent as HRIcon } from '../../assets/flags/HR.svg'
import { ReactComponent as HUIcon } from '../../assets/flags/HU.svg'
import { ReactComponent as ITIcon } from '../../assets/flags/IT.svg'
import { ReactComponent as NLIcon } from '../../assets/flags/NL.svg'
import { ReactComponent as PLIcon } from '../../assets/flags/PL.svg'
import { ReactComponent as PTIcon } from '../../assets/flags/PT.svg'
import { ReactComponent as ROIcon } from '../../assets/flags/RO.svg'
import { ReactComponent as RUIcon } from '../../assets/flags/RU.svg'
import { ReactComponent as SEIcon } from '../../assets/flags/SE.svg'
import { ReactComponent as SIIcon } from '../../assets/flags/SI.svg'
import { ReactComponent as SKIcon } from '../../assets/flags/SK.svg'
import { ReactComponent as UAIcon } from '../../assets/flags/UA.svg'
import { ReactComponent as USAIcon } from '../../assets/flags/USA.svg'

export default {
	title: 'Assets/Flags'
}

export const AllFlags = () => {
	return (
		<div className='flex gap-3 flex-wrap'>
			<ATIcon />
			<BEIcon />
			<BYIcon />
			<CHIcon />
			<CZIcon />
			<DEIcon />
			<DKIcon />
			<ESIcon />
			<FIIcon />
			<FRIcon />
			<GBIcon />
			<GRIcon />
			<HRIcon />
			<HUIcon />
			<ITIcon />
			<NLIcon />
			<PLIcon />
			<PTIcon />
			<ROIcon />
			<RUIcon />
			<SEIcon />
			<SIIcon />
			<SKIcon />
			<UAIcon />
			<USAIcon />
		</div>
	)
}
