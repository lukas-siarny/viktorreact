import React, { FC, useEffect } from 'react'
import { withRouter, useHistory } from 'react-router-dom'

const ScrollToTop: FC = (props) => {
	const history = useHistory()

	useEffect(() => {
		const unlisten = history.listen(() => {
			window.scrollTo({
				top: 0,
				behavior: 'smooth'
			})
		})

		return () => {
			unlisten()
		}
	}, [history])

	return <>{props.children}</>
}

export default withRouter(ScrollToTop)
