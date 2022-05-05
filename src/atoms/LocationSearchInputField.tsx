import React from 'react'
import { withScriptjs } from 'react-google-maps'
import { compose } from 'redux'
import { Form, Input } from 'antd'
import { FormItemLabelProps } from 'antd/lib/form/FormItemLabel'
import { InputProps } from 'antd/lib/input'
import cx from 'classnames'
import { ReactComponent as SearchIcon } from '../assets/icons/search-icon-16.svg'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { StandaloneSearchBox } = require('react-google-maps/lib/components/places/StandaloneSearchBox')

const { Item } = Form

type Props = FormItemLabelProps &
	InputProps & {
		onPlaceSelected: (place: any) => void
		containerElement: React.ReactNode
		error?: boolean
	}

type State = {
	place: any
	onSearchBoxMounted: (ref: any) => void
	onPlacesChanged: () => void
}

class LocationSearchInputField extends React.Component<Props, State> {
	constructor(props: any) {
		super(props)

		const refs: any = {}

		this.state = {
			place: {},
			onSearchBoxMounted: (ref: any) => {
				refs.searchBox = ref
			},
			onPlacesChanged: () => {
				const { onPlaceSelected } = this.props
				const places = refs.searchBox.getPlaces()
				const place = {
					...places?.[0],
					placeName: places?.[0]?.name,
					location: places?.[0]?.geometry?.location
				}
				onPlaceSelected(place)
				// NOTE: Clear input after selection
				this.setState({
					place: {
						// eslint-disable-next-line react/no-access-state-in-setstate
						...this.state.place,
						placeName: null
					}
				})
			}
		}
	}

	onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({
			place: {
				// eslint-disable-next-line react/no-access-state-in-setstate
				...this.state.place,
				placeName: e.target.value
			}
		})
	}

	render() {
		const { placeholder, label, required, type, style, className, error } = this.props
		const { onSearchBoxMounted, onPlacesChanged, place } = this.state

		return (
			<Item label={label} required={required} style={style} className={className}>
				<StandaloneSearchBox ref={onSearchBoxMounted} onPlacesChanged={onPlacesChanged}>
					<Input
						size='large'
						className={cx('h-10 m-0 noti-input', { 'border-danger': error })}
						placeholder={placeholder}
						type={type || 'text'}
						value={place.placeName}
						onChange={this.onChange}
						prefix={<SearchIcon />}
						id={'address-search'}
					/>
				</StandaloneSearchBox>
			</Item>
		)
	}
}

export default compose(withScriptjs)(LocationSearchInputField)
