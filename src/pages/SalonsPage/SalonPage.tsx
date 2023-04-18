import React, { FC, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { map } from 'lodash'

// components
import SalonCreatePage from './SalonCreatePage'
import SalonEditPage from './SalonEditPage'

// utils
import { getPrefixCountryCode } from '../../utils/helper'

// enums
import { ENUMERATIONS_KEYS, FORM, NEW_SALON_ID, PERMISSION } from '../../utils/enums'

// reducers
import { getSalonLanguages } from '../../reducers/languages/languagesActions'

// types
import { SalonPageProps, SalonSubPageProps } from '../../types/interfaces'
import { RootState } from '../../reducers'
import { checkPermissions } from '../../utils/Permissions'

// hooks
import useBackUrl from '../../hooks/useBackUrl'
import { useChangeOpeningHoursFormFields } from '../../components/OpeningHours/OpeningHoursUtils'
import { getPendingReservationsCount } from '../../reducers/calendar/calendarActions'

const SalonPage: FC<SalonSubPageProps> = (props) => {
	const [t] = useTranslation()
	const dispatch = useDispatch()

	const { salonID } = props

	const authUser = useSelector((state: RootState) => state.user.authUser)
	const phonePrefixes = useSelector((state: RootState) => state.enumerationsStore?.[ENUMERATIONS_KEYS.COUNTRIES_PHONE_PREFIX])

	const formValues = useSelector((state: RootState) => state.form?.[FORM.SALON]?.values)

	const phonePrefixCountryCode = getPrefixCountryCode(map(phonePrefixes?.data, (item) => item.code))

	const isNotinoUser = useMemo(() => checkPermissions(authUser.data?.uniqPermissions, [PERMISSION.NOTINO]), [authUser])

	const isNewSalon = salonID === NEW_SALON_ID

	const [backUrl] = useBackUrl(t('paths:salons'))

	const sameOpenHoursOverWeekFormValue = formValues?.sameOpenHoursOverWeek
	const openOverWeekendFormValue = formValues?.openOverWeekend

	useChangeOpeningHoursFormFields(FORM.SALON, formValues?.openingHours, sameOpenHoursOverWeekFormValue, openOverWeekendFormValue)

	useEffect(() => {
		dispatch(getPendingReservationsCount(salonID))
		dispatch(getSalonLanguages())
	}, [dispatch, salonID])

	const commonProps: SalonPageProps = {
		isNotinoUser,
		backUrl,
		phonePrefixCountryCode,
		authUser,
		phonePrefixes
	}

	return isNewSalon ? <SalonCreatePage {...commonProps} /> : <SalonEditPage salonID={props.salonID} {...commonProps} />
}

export default SalonPage
