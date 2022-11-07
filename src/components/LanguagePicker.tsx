import React, { FC } from 'react'
import { Select, Row } from 'antd'
// eslint-disable-next-line import/no-extraneous-dependencies
import Icon from '@ant-design/icons'
import i18next from 'i18next'
import cx from 'classnames'
import { useDispatch } from 'react-redux'
import { get } from 'lodash'
import { ItemType } from 'antd/lib/menu/hooks/useItems'

// utils
import sk_SK from 'antd/lib/locale-provider/sk_SK'
import cs_CZ from 'antd/lib/locale-provider/cs_CZ'
import en_GB from 'antd/lib/locale-provider/en_GB'
/* import hu_HU from 'antd/lib/locale-provider/hu_HU'
import ro_RO from 'antd/lib/locale-provider/ro_RO'
import bg_BG from 'antd/lib/locale-provider/bg_BG'
import it_IT from 'antd/lib/locale-provider/it_IT' */
// import { useSelector } from 'react-redux'
// eslint-disable-next-line import/no-cycle
// import { RootState } from '../reducers'
import { LANGUAGE, DEFAULT_LANGUAGE } from '../utils/enums'

// hooks
import useMedia from '../hooks/useMedia'

// redux
// eslint-disable-next-line import/no-cycle
import { getCountries } from '../reducers/enumerations/enumerationActions'

// assets
import { ReactComponent as SK_Flag } from '../assets/flags/SK.svg'
import { ReactComponent as EN_Flag } from '../assets/flags/GB.svg'
import { ReactComponent as CZ_Flag } from '../assets/flags/CZ.svg'
/* import { ReactComponent as HU_Flag } from '../assets/flags/HU.svg'
import { ReactComponent as RO_Flag } from '../assets/flags/RO.svg'
import { ReactComponent as BG_Flag } from '../assets/flags/BG.svg'
import { ReactComponent as IT_Flag } from '../assets/flags/IT.svg' */

export const LOCALES = {
	[LANGUAGE.SK]: {
		ISO_639: 'sk',
		antD: sk_SK,
		icon: SK_Flag,
		countryCode: 'SK'
	},
	[LANGUAGE.CZ]: {
		ISO_639: 'cs',
		antD: cs_CZ,
		icon: CZ_Flag,
		displayAs: 'cz',
		countryCode: 'CZ'
	},
	[LANGUAGE.EN]: {
		ISO_639: 'en',
		antD: en_GB,
		icon: EN_Flag,
		countryCode: 'EN'
	} /* ,
	[LANGUAGE.HU]: {
		ISO_639: 'hu',
		antD: hu_HU,
		icon: HU_Flag,
		countryCode: 'HU'
	},
	[LANGUAGE.RO]: {
		ISO_639: 'ro',
		antD: ro_RO,
		icon: RO_Flag,
		countryCode: 'RO'
	},
	[LANGUAGE.BG]: {
		ISO_639: 'bg',
		antD: bg_BG,
		icon: BG_Flag,
		countryCode: 'BG'
	},
	[LANGUAGE.IT]: {
		ISO_639: 'it',
		antD: it_IT,
		icon: IT_Flag,
		countryCode: 'IT'
	} */
}

// default language must be first
export const EMPTY_NAME_LOCALIZATIONS = Object.keys(LOCALES)
	.sort((a: string, b: string) => {
		if (a === DEFAULT_LANGUAGE) {
			return -1
		}
		return b === DEFAULT_LANGUAGE ? 1 : 0
	})
	.map((language) => ({ language }))

const { Option } = Select

type Props = {
	className?: string
	reloadPageAfterChange?: boolean
}

export const handleLanguageChange = (value: any, dispatch: any, reloadPageAfterChange = true) => {
	if (reloadPageAfterChange) {
		// reload page after change language
		document.location.reload()
	} else {
		// refetch countries
		dispatch(getCountries())
	}
	i18next.changeLanguage(value)
}

const options = Object.entries(LANGUAGE).map(([key, value]) => ({ label: key, value, icon: LOCALES[value].icon }))

const getLanguageFlag = (countryCode: LANGUAGE) => <Icon className={'language-picker-icon'} component={LOCALES[countryCode].icon} />

export const getLanguagePickerAsSubmenuItem = (dispatch: any, reloadPageAfterChange = true): ItemType => {
	let currentLanguage: LANGUAGE

	switch (i18next.resolvedLanguage) {
		case LANGUAGE.SK:
			currentLanguage = LANGUAGE.SK
			break
		case LANGUAGE.CZ:
			currentLanguage = LANGUAGE.CZ
			break
		case LANGUAGE.EN:
			currentLanguage = LANGUAGE.EN
			break
		/* case LANGUAGE.HU:
			currentLanguage = LANGUAGE.HU
			break
		case LANGUAGE.BG:
			currentLanguage = LANGUAGE.BG
			break
		case LANGUAGE.RO:
			currentLanguage = LANGUAGE.RO
			break
		case LANGUAGE.IT:
			currentLanguage = LANGUAGE.IT
			break */
		default:
			currentLanguage = DEFAULT_LANGUAGE
			break
	}

	return {
		key: 'currentLanguage',
		className: 'language-picker',
		label: get(LOCALES[currentLanguage], 'displayAs', currentLanguage).toUpperCase(),
		icon: getLanguageFlag(currentLanguage),
		popupOffset: [0, -75],
		children: options?.map((option: any, index: number) => ({
			key: index,
			icon: getLanguageFlag(option.value),
			label: option.label,
			onClick: () => handleLanguageChange(option.value, dispatch, reloadPageAfterChange)
		}))
	}
}

const LanguagePicker: FC<Props> = (props) => {
	const { className, reloadPageAfterChange = true } = props
	const isSmallDevice = useMedia(['(max-width: 744px)'], [true], false)
	const dispatch = useDispatch()

	return (
		<div className={`${className} language-picker-select ant-form-item`}>
			<Select
				defaultValue={i18next.resolvedLanguage}
				onChange={(value) => handleLanguageChange(value, dispatch, reloadPageAfterChange)}
				className={'noti-select-input'}
				dropdownClassName={'noti-select-dropdown'}
			>
				{options?.map((option: any, index: number) => (
					<Option value={option.value} key={index}>
						<Row className={cx('items-center', { 'justify-center': isSmallDevice })}>
							{getLanguageFlag(option.value)}
							{!isSmallDevice && option.label}
						</Row>
					</Option>
				))}
			</Select>
		</div>
	)
}

export default LanguagePicker
