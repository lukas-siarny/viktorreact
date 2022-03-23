import React, { useRef, memo } from 'react'
import { withScriptjs, withGoogleMap, GoogleMap, Marker, GoogleMapProps } from 'react-google-maps'
import { MAP } from '../utils/enums'

type Props = GoogleMapProps & {
	lat: number
	long: number
	onLocationChange: (e: any) => void
	zoomChanged: (newZoom: number) => void
}

const MapContainer = (props: Props) => {
	const { onLocationChange, lat, long, zoom = MAP.defaultZoom, zoomChanged } = props

	const mapRef: any = useRef()

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

	const position = {
		lat: Number(lat) || MAP.defaultLatitude,
		lng: Number(long) || MAP.defaultLongitude
	}

	return (
		<GoogleMap
			defaultCenter={position}
			center={position}
			defaultZoom={Number(zoom)}
			zoom={Number(zoom)}
			ref={mapRef}
			onRightClick={onChange}
			onZoomChanged={handleZoomChanged}
			// OPTIONS: https://developers.google.com/maps/documentation/javascript/reference/map
			options={{
				maxZoom: MAP.maxZoom,
				minZoom: MAP.minZoom
			}}
		>
			<Marker position={position} draggable={true} onDragEnd={onChange} onRightClick={onChange} />
		</GoogleMap>
	)
}

export default withScriptjs(withGoogleMap(memo(MapContainer)))
