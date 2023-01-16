import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { GoogleMap, useJsApiLoader, Marker, GoogleMapProps } from '@react-google-maps/api'

type Props = GoogleMapProps & {
	lat: number
	lng: number
	onLocationChange: (e: any) => void
	onError: (message: string) => void
	zoomChanged?: (newZoom: number) => void
	disabled?: boolean
	googleMapURL: any
}

const MapContainer = (props: Props) => {
	const [t] = useTranslation()
	const { lng, lat, zoomChanged, onLocationChange, onError, disabled, googleMapURL } = props
	console.log('googleMapURL', googleMapURL)
	const { isLoaded } = useJsApiLoader({
		googleMapsApiKey: 'AIzaSyBhOQaTtVjyO_0Ff5gftAXNb93NiFhglQg'
	})

	return isLoaded ? (
		<GoogleMap mapContainerClassName={'map'} zoom={15} center={{ lat, lng }}>
			<Marker position={{ lat, lng }} />
		</GoogleMap>
	) : (
		<div>Loading</div>
	)
}

export default MapContainer
