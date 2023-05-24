import React from 'react'
import cx from 'classnames'

import { ReactComponent as SkFlag } from '../assets/flags/SK.svg'
import { ReactComponent as EnFlag } from '../assets/flags/GB.svg'
import { ReactComponent as CzFlag } from '../assets/flags/CZ.svg'
import { ReactComponent as HuFlag } from '../assets/flags/HU.svg'
import { ReactComponent as RoFlag } from '../assets/flags/RO.svg'
import { ReactComponent as BgFlag } from '../assets/flags/BG.svg'
import { LANGUAGE } from '../utils/enums'

type Props = {
	countryCode: LANGUAGE
	className?: string
}

const FlagIcon = ({ countryCode, className }: Props) => {
	let icon
	switch (countryCode) {
		case LANGUAGE.SK:
			icon = <SkFlag />
			break
		case LANGUAGE.EN:
			icon = <EnFlag />
			break
		case LANGUAGE.CZ:
			icon = <CzFlag />
			break
		case LANGUAGE.HU:
			icon = <HuFlag />
			break
		case LANGUAGE.RO:
			icon = <RoFlag />
			break
		case LANGUAGE.BG:
			icon = <BgFlag />
			break
		default:
			return <SkFlag />
	}
	return <span className={cx(className, 'flag-icon')}>{icon}</span>
}

export default FlagIcon
