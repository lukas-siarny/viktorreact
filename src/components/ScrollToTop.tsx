import React, { FC, PropsWithChildren, useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

export const scrollToTopFn = () => {
	window.scrollTo({
		top: 0,
		behavior: 'smooth'
	})
}

const ScrollToTop: FC<PropsWithChildren> = (props) => {
	const location = useLocation()

	useLayoutEffect(() => {
		scrollToTopFn()
		return () => {
			scrollToTopFn()
		}
		// NOTE: pocuva na zmenu location (ked sa zmeni url path)
	}, [location])

	return <>{props.children}</>
}

export default ScrollToTop
