import React, { FC } from 'react'
import { Select, Menu, Row } from 'antd'
// eslint-disable-next-line import/no-extraneous-dependencies
import Icon from '@ant-design/icons'
import i18next from 'i18next'
import cx from 'classnames'
import { useDispatch } from 'react-redux'

// utils
import sk_SK from 'antd/lib/locale-provider/sk_SK'
import cs_CZ from 'antd/lib/locale-provider/cs_CZ'
import en_GB from 'antd/lib/locale-provider/en_GB'
import hu_HU from 'antd/lib/locale-provider/hu_HU'
import ro_RO from 'antd/lib/locale-provider/ro_RO'
import bg_BG from 'antd/lib/locale-provider/bg_BG'
import it_IT from 'antd/lib/locale-provider/it_IT'
// import { useSelector } from 'react-redux'
// eslint-disable-next-line import/no-cycle
// import { RootState } from '../reducers'
import { get } from 'lodash'
import { LANGUAGE, DEFAULT_LANGUAGE /* , ENUMERATIONS_KEYS */ } from '../utils/enums'

// hooks
import useMedia from '../hooks/useMedia'

// redux
// eslint-disable-next-line import/no-cycle
import { getCountries } from '../reducers/enumerations/enumerationActions'

// assets
import { ReactComponent as SK_Flag } from '../assets/flags/SK.svg'
import { ReactComponent as EN_Flag } from '../assets/flags/GB.svg'
import { ReactComponent as CZ_Flag } from '../assets/flags/CZ.svg'
import { ReactComponent as HU_Flag } from '../assets/flags/HU.svg'
import { ReactComponent as RO_Flag } from '../assets/flags/RO.svg'
import { ReactComponent as BG_Flag } from '../assets/flags/BG.svg'
import { ReactComponent as IT_Flag } from '../assets/flags/IT.svg'
import { NameLocalizationsItem } from '../types/interfaces'

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
	},
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
	}
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

export const sortNameLocalizationsWithDefaultLangFirst = (nameLocalizations?: { language: string; value: string | null }[]) => {
	return nameLocalizations?.sort((a, b) => {
		if (a.language === DEFAULT_LANGUAGE) {
			return -1
		}
		return b.language === DEFAULT_LANGUAGE ? 1 : 0
	})
}

const { Option } = Select
const { SubMenu } = Menu

type Props = {
	className?: string
	asMenuItem?: boolean
	reloadPageAfterChange?: boolean
}

/*
	NOT-1084: change of the language picker options:
	- picker options were fetched from roll-out countires BE endpoint
	- but supported language mutations are not the same as roll-out countries
	- we use harcoded options now, since locales are hardcoded on FE as well
*/
const LanguagePicker: FC<Props> = (props) => {
	const { className, asMenuItem, reloadPageAfterChange = true } = props
	const isSmallDevice = useMedia(['(max-width: 744px)'], [true], false)
	const dispatch = useDispatch()

	const options = Object.entries(LANGUAGE).map(([key, value]) => ({ label: key, value, icon: LOCALES[value].icon }))

	const handleLanguageChange = (value: any) => {
		if (reloadPageAfterChange) {
			// reload page after change language
			// eslint-disable-next-line no-restricted-globals
			location.reload()
		} else {
			// refetch countries
			dispatch(getCountries())
		}
		i18next.changeLanguage(value)
	}

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
		case LANGUAGE.HU:
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
			break
		default:
			currentLanguage = DEFAULT_LANGUAGE
			break
	}

	const getLanguageFlag = (countryCode: LANGUAGE) => <Icon className={'language-picker-icon'} component={LOCALES[countryCode].icon} />

	return (
		<>
			{asMenuItem ? (
				<SubMenu
					className={'language-picker'}
					key='currentLanguage'
					title={get(LOCALES[currentLanguage], 'displayAs', currentLanguage).toUpperCase()}
					icon={getLanguageFlag(currentLanguage)}
					// it is necessary to check whether menu is overflowing viewport everytime new language is added
					// if so, popupOffset needs to be changed manually
					popupOffset={[0, -100]}
				>
					{options?.map((option: any, index: number) => (
						<Menu.Item onClick={() => handleLanguageChange(option.value)} key={index} icon={getLanguageFlag(option.value)}>
							{option.label}
						</Menu.Item>
					))}
				</SubMenu>
			) : (
				<div className={`${className} language-picker-select ant-form-item`}>
					<Select defaultValue={i18next.resolvedLanguage} onChange={handleLanguageChange} className={'noti-select-input'} dropdownClassName={'noti-select-dropdown'}>
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
			)}
		</>
	)
}

export default LanguagePicker
