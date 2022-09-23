import React, { useEffect, FC } from 'react'
import { RouteProps } from 'react-router-dom'

// utils
import PreventShowDeletedSalon from '../utils/PreventShowDeletedSalon'

type Props = RouteProps & {
	layout: any
	component: React.Component<any>
	preventShowDeletedSalon?: boolean
}

const BaseRoute: FC<Props> = (props) => {
	useEffect(() => {
		document.title = 'Notino B2B'
	}, [])
	const { layout: Layout, preventShowDeletedSalon = false, component: Component } = props
	if (Layout) {
		return (
			<Layout {...props}>
				{preventShowDeletedSalon ? (
					<PreventShowDeletedSalon>
						<Component {...(props as any)} />
					</PreventShowDeletedSalon>
				) : (
					<Component {...(props as any)} />
				)}
			</Layout>
		)
	}

	return <Component {...(props as any)} />
}

export default BaseRoute
