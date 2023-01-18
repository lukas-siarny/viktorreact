import React, { memo } from 'react'
import { StandaloneSearchBox, useJsApiLoader } from '@react-google-maps/api'

type Props = {}

const StandaloneSearchBoxField = (props: Props) => {
	const { isLoaded } = useJsApiLoader({
		// https://react-google-maps-api-docs.netlify.app/#usejsapiloader
		id: 'google-map',
		googleMapsApiKey: String(process.env.REACT_APP_GOOGLE_MAPS_API_KEY),
		libraries: ['places']
	})

	return isLoaded ? (
		<StandaloneSearchBox>
			<input
				type='text'
				placeholder='Customized your placeholder'
				style={{
					boxSizing: `border-box`,
					border: `1px solid transparent`,
					width: `240px`,
					height: `32px`,
					padding: `0 12px`,
					borderRadius: `3px`,
					boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
					fontSize: `14px`,
					outline: `none`,
					textOverflow: `ellipses`,
					position: 'absolute',
					left: '50%',
					marginLeft: '-120px'
				}}
			/>
		</StandaloneSearchBox>
	) : (
		<div>loading</div>
	)
}

export default memo(StandaloneSearchBoxField)
