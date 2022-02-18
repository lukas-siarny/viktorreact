import React, { useEffect, FC } from 'react'
import { RouteProps } from 'react-router-dom'

type Props = RouteProps & {
	layout: any
	component: React.Component<any>
}

const BaseRoute: FC<Props> = (props) => {
	useEffect(() => {
		document.title = 'Notino B2B'
	}, [])
	const Layout = props.layout
	const Component = props.component
	if (Layout) {
		return (
			<Layout {...props}>
				<Component {...(props as any)} />
			</Layout>
		)
	}
	return <Component {...(props as any)} />
}

export default BaseRoute
