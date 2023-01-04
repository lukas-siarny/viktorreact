import React, { useRef, memo, useState, useEffect } from 'react'
import { GoogleMap, Marker, GoogleMapProps } from '@react-google-maps/api'
import { useTranslation } from 'react-i18next'
import { MAP, LANGUAGE } from '../utils/enums'

type Props = GoogleMapProps & {
	lat: number
	long: number
	onLocationChange: (e: any) => void
	onError: (message: string) => void
	zoomChanged?: (newZoom: number) => void
	disabled?: boolean
}

const MapContainer = (props: Props) => {
	const { onLocationChange, lat, long, zoom = MAP.defaultZoom, zoomChanged, disabled, onError } = props
	const { i18n } = useTranslation()
	const [currentZoom, setCurrentZoom] = useState<number>(zoom)
	const [position, setPosition] = useState<{ [key: string]: number }>(MAP.defaultLocation)

	// catch google API authentication errors
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	window.gm_authFailure = () => {
		onError('Goggle Map auth error')
	}

	const mapRef: any = useRef()

	const updatePosition = (newPosition: { [key: string]: number }) => {
		setPosition({ ...newPosition })
	}

	useEffect(() => {
		const validLat = lat < MAP.maxLatitude && lat > MAP.minLatitude
		const validLng = long < MAP.maxLongitude && long > MAP.minLongitude

		if (validLat && validLng) {
			updatePosition({ lat, lng: long })
			setCurrentZoom(MAP.placeZoom)
		} else {
			const positionByLanguage = MAP.locations[i18n.language as LANGUAGE] ?? MAP.defaultLocation
			updatePosition({ ...positionByLanguage })
		}
	}, [lat, long, i18n])

	const onChange = (e: any) => {
		if (onLocationChange) {
			onLocationChange(e)
		}
	}

	const handleZoomChanged = () => {
		if (zoomChanged && mapRef.current.getZoom()) {
			zoomChanged(mapRef.current.getZoom())
		}
	}

	return (
		<GoogleMap
			defaultCenter={position}
			center={position}
			defaultZoom={MAP.defaultZoom}
			zoom={currentZoom}
			// ref={mapRef}
			onRightClick={onChange}
			onZoomChanged={handleZoomChanged}
			// OPTIONS: https://developers.google.com/maps/documentation/javascript/reference/map
			options={{
				maxZoom: MAP.maxZoom,
				minZoom: MAP.minZoom
			}}
		>
			<Marker position={position} draggable={!disabled} onDragEnd={onChange} onRightClick={onChange} />
		</GoogleMap>
	)
}

export default memo(MapContainer)
