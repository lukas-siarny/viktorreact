import React from 'react'
import SelectField, { Props as SelectProps } from './SelectField'

type Props = SelectProps & {
	flagField?: string // flag field name in itemData
}

/**
 * options example
 * [{
		key: '1',
		label: '+421',
		value: 'SK',
		flag: 'https://flagcdn.com/h20/sk.png',
	},
	{
		key: '2',
		label: '+420',
		value: 'CZ',
		flag: 'https://flagcdn.com/h20/cz.png',
	}]
 */
const PhonePrefixField = (props: Props) => {
	const { flagField = 'flag', ...otherProps } = props

	const optionRender = (itemData: any) => {
		const { value, label } = itemData
		const flag = itemData[flagField]
		return (
			<div className='noti-phone-prefix-render'>
				<img className='noti-flag w-6 mr-1 rounded' src={flag} alt={value} />
				{label}
			</div>
		)
	}

	return <SelectField optionRender={optionRender} {...otherProps} />
}

export default PhonePrefixField
