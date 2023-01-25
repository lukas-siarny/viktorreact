import React, { FC, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export const scrollToTopFn = () => {
	window.scrollTo({
		top: 0,
		behavior: 'smooth'
	})
}

const ScrollToTop: FC = (props) => {
	const navigate = useNavigate()
	const location = useLocation()
	useEffect(() => {
		// TODO: listne neexistuje
		// const unlisten = navigate.listen(scrollToTopFn)
		//
		// return () => {
		// 	unlisten()
		// }
	}, [navigate])

	return <>{props.children}</>
}

export default ScrollToTop
