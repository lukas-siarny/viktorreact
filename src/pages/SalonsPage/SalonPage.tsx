import React, { FC, useEffect } from 'react'
import { useDispatch } from 'react-redux'

// components
import SalonCreatePage from './SalonCreatePage'
import SalonEditPage from './SalonEditPage'

// enums
import { NEW_SALON_ID } from '../../utils/enums'

// reducers
import { getCosmetics } from '../../reducers/cosmetics/cosmeticsActions'
import { getSalonLanguages } from '../../reducers/languages/languagesActions'

// types
import { SalonSubPageProps } from '../../types/interfaces'

const SalonPage: FC<SalonSubPageProps> = (props) => {
	const dispatch = useDispatch()

	const { salonID } = props

	const isNewSalon = salonID === NEW_SALON_ID

	useEffect(() => {
		dispatch(getSalonLanguages())
		dispatch(getCosmetics())
	}, [dispatch])

	return isNewSalon ? <SalonCreatePage salonID={props.salonID} parentPath={props.parentPath} /> : <SalonEditPage salonID={props.salonID} parentPath={props.parentPath} />
}

export default SalonPage
