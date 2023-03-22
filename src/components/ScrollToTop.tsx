import React, { FC, PropsWithChildren, useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

export const scrollToTopFn = () => {
	try {
		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		})
	} catch {
		try {
			window.scrollTo(0, 0)
		} catch {
			// eslint-disable-next-line no-console
			console.warn(`window.scrollTo() is not supported in your browser`)
		}
	}
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
