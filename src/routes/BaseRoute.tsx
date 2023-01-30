import React, { useEffect, FC } from 'react'
import { RouteProps, Route, Outlet } from 'react-router-dom'

// utils
import PreventShowDeletedSalon from '../utils/PreventShowDeletedSalon'

type Props = RouteProps & {
	layout?: any
	element?: React.Component<any>
	preventShowDeletedSalon?: boolean
}

const BaseRoute: FC<Props> = (props) => {
	useEffect(() => {
		document.title = 'Notino B2B'
	}, [])
	const { layout: Layout, preventShowDeletedSalon = false } = props

	// TODO: zrusit ...props a vsetko otypovat
	if (Layout) {
		return (
			<Layout {...props}>
				{preventShowDeletedSalon ? (
					<PreventShowDeletedSalon>
						{/* // Outlet je Route component to iste ako <Route {...props} /> */}
						<Outlet />
					</PreventShowDeletedSalon>
				) : (
					<Outlet />
				)}
			</Layout>
		)
	}
	return <Outlet />
}

export default BaseRoute
