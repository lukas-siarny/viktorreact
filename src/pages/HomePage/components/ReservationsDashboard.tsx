import React, { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'

type Props = PropsWithChildren & {}

const ReservationsDashboard = (props: Props) => {
	const [t] = useTranslation()
	const { children } = props

	return <div>{children}</div>
}

export default ReservationsDashboard
