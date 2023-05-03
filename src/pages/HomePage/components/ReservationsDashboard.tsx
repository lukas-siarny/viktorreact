import React, { PropsWithChildren } from 'react'

type Props = PropsWithChildren & {}

const ReservationsDashboard = (props: Props) => {
	const { children } = props

	return <div>{children}</div>
}

export default ReservationsDashboard
