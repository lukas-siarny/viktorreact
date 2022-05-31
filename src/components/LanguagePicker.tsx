import React, { FC } from 'react'
import { Select, Menu, Row } from 'antd'
// eslint-disable-next-line import/no-extraneous-dependencies
import Icon from '@ant-design/icons'
import i18next from 'i18next'

// utils
import { LANGUAGE, LOCALES, DEFAULT_LANGUAGE } from '../utils/enums'

// hooks
import useMedia from '../hooks/useMedia'

const { Option } = Select
const { SubMenu } = Menu

const options = Object.values(LANGUAGE).map((value) => ({ label: value, value, icon: LOCALES[value].icon }))

type Props = {
	className?: string
	asMenuItem?: boolean
}

const LanguagePicker: FC<Props> = (props) => {
	const { className, asMenuItem } = props
	const isSmallDevice = useMedia(['(max-width: 744px)'], [true], false)

	const handleLanguageChange = (value: any) => {
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
		default:
			currentLanguage = DEFAULT_LANGUAGE
			break
	}
	return (
		<>
			{asMenuItem ? (
				<SubMenu key='currentLanguage' title={currentLanguage.toUpperCase()} icon={<Icon className={'language-picker-icon'} component={LOCALES[currentLanguage].icon} />}>
					{options.map((option: any, index: number) => (
						<Menu.Item onClick={() => handleLanguageChange(option.value)} key={index} icon={<Icon className='mr-2 language-picker-icon' component={option.icon} />}>
							{option.label.toUpperCase()}
						</Menu.Item>
					))}
				</SubMenu>
			) : (
				<div className={`${className} ant-form-item`}>
					<Select defaultValue={i18next.resolvedLanguage} onChange={handleLanguageChange} className={'noti-select-input'} dropdownClassName={'noti-select-dropdown'}>
						{options.map((option: any, index: number) => (
							<Option value={option.value} key={index}>
								<Row>
									<Icon className='mr-2 language-picker-icon' component={option.icon} />
									{!isSmallDevice && option.label.toUpperCase()}
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
