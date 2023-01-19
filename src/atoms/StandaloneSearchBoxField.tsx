import React, { memo, useEffect, useRef, useState } from 'react'
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api'
import cx from 'classnames'
import { Input, Form, Spin } from 'antd'
import { FormItemLabelProps } from 'antd/lib/form/FormItemLabel'
import { InputProps } from 'antd/lib/input'
import { formFieldID } from '../utils/helper'
import { ReactComponent as SearchIcon } from '../assets/icons/search-icon-16.svg'

type Props = FormItemLabelProps &
	InputProps & {
		onPlaceSelected: (place: google.maps.places.PlaceResult) => void
		containerElement: React.ReactNode
		error?: boolean
	}

const { Item } = Form

const StandaloneSearchBoxField = (props: Props) => {
	const { placeholder, label, required, type, style, className, error, disabled, form, name, onPlaceSelected } = props
	const [loaded, setLoaded] = useState(false)

	const { isLoaded, loadError } = useJsApiLoader({
		// https://react-google-maps-api-docs.netlify.app/#usejsapiloader
		id: 'google-map',
		googleMapsApiKey: String(process.env.REACT_APP_GOOGLE_MAPS_API_KEY),
		libraries: ['places']
	})
	const autocompleteRef = useRef<any>(null)

	useEffect(() => {
		if (!isLoaded || !loaded) {
			return
		}
		const listener = autocompleteRef?.current?.addListener('place_changed', () => {
			const place = autocompleteRef?.current?.getPlace()
			if (place) {
				onPlaceSelected(place)
			}
		})
		// eslint-disable-next-line consistent-return
		return () => {
			google.maps.event.removeListener(listener!)
		}
	}, [isLoaded, loaded, onPlaceSelected])

	if (loadError) {
		return <div>Goggle Map auth error.</div>
	}

	if (!isLoaded) {
		return <Spin className={'w-full'} />
	}

	return (
		<Item label={label} required={required} style={style} className={className}>
			<Autocomplete
				ref={autocompleteRef}
				onLoad={(autocomplete) => {
					autocompleteRef.current = autocomplete
					setLoaded(true)
				}}
			>
				<Input
					size='large'
					className={cx('h-10 m-0 noti-input', { 'border-danger': error })}
					placeholder={placeholder}
					type={type || 'text'}
					prefix={<SearchIcon />}
					disabled={disabled}
					id={formFieldID(form, name)}
				/>
			</Autocomplete>
		</Item>
	)
}

export default memo(StandaloneSearchBoxField)
