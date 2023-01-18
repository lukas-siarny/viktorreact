import React, { memo, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { GoogleMap, useJsApiLoader, Marker, GoogleMapProps } from '@react-google-maps/api'
import { Spin } from 'antd'

import { LANGUAGE, MAP } from '../utils/enums'

type Props = GoogleMapProps & {
	lat: number
	lng: number
	onLocationChange: (e: any) => void
	onError: (message: string) => void
	disabled?: boolean
}
// https://react-google-maps-api-docs.netlify.app/
const MapContainer = (props: Props) => {
	const { i18n } = useTranslation()
	const { lng, lat, onLocationChange, onError, disabled, zoom, options } = props
	const [position, setPosition] = useState<google.maps.LatLng | google.maps.LatLngLiteral>(MAP.defaultLocation)

	const { isLoaded } = useJsApiLoader({
		// https://react-google-maps-api-docs.netlify.app/#usejsapiloader
		googleMapsApiKey: String(process.env.REACT_APP_GOOGLE_MAPS_API_KEY)
	})

	// catch google API authentication errors
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	window.gm_authFailure = () => {
		onError('Goggle Map auth error')
	}

	const updatePosition = (newPosition: google.maps.LatLng | google.maps.LatLngLiteral) => {
		setPosition(newPosition)
	}

	useEffect(() => {
		const validLat = lat < MAP.maxLatitude && lat > MAP.minLatitude
		const validLng = lng < MAP.maxLongitude && lng > MAP.minLongitude

		if (validLat && validLng) {
			updatePosition({ lat, lng })
		} else {
			const positionByLanguage = MAP.locations[i18n.language as LANGUAGE] ?? MAP.defaultLocation
			updatePosition({ ...positionByLanguage })
		}
	}, [lat, lng, i18n])

	const onChange = (e: any) => {
		if (onLocationChange) {
			onLocationChange(e)
		}
	}

	return isLoaded ? (
		<GoogleMap
			options={{
				maxZoom: MAP.maxZoom || options?.maxZoom,
				minZoom: MAP.minZoom || options?.minZoom
			}}
			onRightClick={onChange}
			mapContainerClassName={'map'}
			zoom={MAP.placeZoom || zoom}
			center={position}
		>
			<Marker draggable={!disabled} position={position} onDragEnd={onChange} onRightClick={onChange} />
		</GoogleMap>
	) : (
		<Spin className={'w-full'} />
	)
}

export default memo(MapContainer)
