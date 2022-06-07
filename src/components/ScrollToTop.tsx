import React, { FC, useEffect } from 'react'
import { withRouter, useHistory } from 'react-router-dom'

export const scrollToTopFn = () => {
	window.scrollTo({
		top: 0,
		behavior: 'smooth'
	})
}

const ScrollToTop: FC = (props) => {
	const history = useHistory()

	useEffect(() => {
		const unlisten = history.listen(scrollToTopFn)

		return () => {
			unlisten()
		}
	}, [history])

	return <>{props.children}</>
}

export default withRouter(ScrollToTop)
