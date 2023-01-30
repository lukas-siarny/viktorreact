import React, { FC, useEffect } from 'react'
import { history } from '../utils/history'

export const scrollToTopFn = () => {
	window.scrollTo({
		top: 0,
		behavior: 'smooth'
	})
}

const ScrollToTop: FC = (props) => {
	useEffect(() => {
		const unlisten = history.listen(scrollToTopFn)

		return () => {
			unlisten()
		}
	}, [history])

	return <>{props.children}</>
}

export default ScrollToTop
