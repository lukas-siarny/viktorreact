import React, { FC } from 'react'
import { Select } from 'antd'
import i18next from 'i18next'

// utils
import { LANGUAGE } from '../utils/enums'

const { Option } = Select

const options = Object.values(LANGUAGE).map((value) => ({ label: value, value }))

type Props = {
	className?: string
}

const LanguagePicker: FC<Props> = (props) => {
	const { className } = props

	const handleLanguageChange = (value: any) => {
		i18next.changeLanguage(value)
	}

	return (
		<div className={`${className} ant-form-item`}>
			<Select defaultValue={i18next.resolvedLanguage} onChange={handleLanguageChange} className={'noti-select-input'} dropdownClassName={'noti-select-dropdown'}>
				{options.map((option: any, index: number) => (
					<Option value={option.value} key={index}>
						{option.label}
					</Option>
				))}
			</Select>
		</div>
	)
}

export default LanguagePicker
