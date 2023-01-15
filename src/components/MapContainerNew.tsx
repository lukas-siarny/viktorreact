import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api'

type Props = {
	lat: number
	long: number
	onLocationChange: (e: any) => void
	onError: (message: string) => void
	zoomChanged?: (newZoom: number) => void
	disabled?: boolean
}

const MapContainer = (props: Props) => {
	const [t] = useTranslation()
	const { long, lat, zoomChanged, onLocationChange, onError, disabled } = props
	const { isLoaded } = useJsApiLoader({
		googleMapsApiKey: 'AIzaSyBhOQaTtVjyO_0Ff5gftAXNb93NiFhglQg'
	})

	return isLoaded ? (
		<div>
			<GoogleMap zoom={15} center={{ lat: 15, lng: 80 }}>
				<Marker position={{ lat: 15, lng: 80 }} />
			</GoogleMap>
		</div>
	) : (
		<div>Loading</div>
	)
}

export default MapContainer
