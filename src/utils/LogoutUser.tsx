import React, { FC, PropsWithChildren, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import queryString from 'query-string'
import { useLocation } from 'react-router-dom'
import { isLoggedIn } from './auth'
import { logOutUser } from '../reducers/users/userActions'

type Props = PropsWithChildren & {
	skipRedirectToLoginPage?: boolean
}

const LogoutUser: FC<Props> = (props) => {
	const { children, skipRedirectToLoginPage = true } = props
	const dispatch = useDispatch()
	const { search } = useLocation()

	const { logout } = queryString.parse(search, { decode: false })
	const logoutUser = logout === 'true'

	useEffect(() => {
		if (logoutUser && isLoggedIn()) {
			dispatch(logOutUser(skipRedirectToLoginPage))
		}
	}, [logoutUser, dispatch, skipRedirectToLoginPage])

	return <>{React.Children.map(children, (child) => React.isValidElement(child) && React.cloneElement(child, { ...props, logoutUser } as Props & { logoutUser: boolean }))}</>
}

export default React.memo(LogoutUser)
