import React, { memo } from 'react'
import { StandaloneSearchBox, useJsApiLoader } from '@react-google-maps/api'
import cx from 'classnames'
import { Input, Form } from 'antd'
import { FormItemLabelProps } from 'antd/lib/form/FormItemLabel'
import { InputProps } from 'antd/lib/input'
import { formFieldID } from '../utils/helper'
import { ReactComponent as SearchIcon } from '../assets/icons/search-icon-16.svg'

type Props = FormItemLabelProps &
	InputProps & {
		error?: boolean
	}

const { Item } = Form

const StandaloneSearchBoxField = (props: Props) => {
	const { placeholder, label, required, type, style, className, error, disabled, form, name } = props
	const { isLoaded } = useJsApiLoader({
		// https://react-google-maps-api-docs.netlify.app/#usejsapiloader
		id: 'google-map',
		googleMapsApiKey: String(process.env.REACT_APP_GOOGLE_MAPS_API_KEY),
		libraries: ['places']
	})

	return isLoaded ? (
		<Item label={label} required={required} style={style} className={className}>
			<StandaloneSearchBox>
				<Input
					size='large'
					className={cx('h-10 m-0 noti-input', { 'border-danger': error })}
					placeholder={placeholder}
					type={type || 'text'}
					// value={place.placeName}
					// onChange={this.onChange}
					prefix={<SearchIcon />}
					disabled={disabled}
					id={formFieldID(form, name)}
				/>
			</StandaloneSearchBox>
		</Item>
	) : (
		<div>loading</div>
	)
}

export default memo(StandaloneSearchBoxField)
