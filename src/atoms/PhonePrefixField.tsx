import React from 'react'
import { optionRenderWithImage } from '../utils/helper'
import SelectField, { Props as SelectProps } from './SelectField'
import { ReactComponent as PhoneIcon } from '../assets/icons/phone-2-icon.svg'

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
	return <SelectField optionRender={(itemData: any) => optionRenderWithImage(itemData, <PhoneIcon />)} {...props} />
}

export default PhonePrefixField
