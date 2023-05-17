import React, { FC, PropsWithChildren, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import queryString from 'query-string'
import { useLocation } from 'react-router-dom'
import { isLoggedIn } from './auth'
import { logOutUser } from '../reducers/users/userActions'

type Props = PropsWithChildren & {
	skipLoginRedirect?: boolean
}

const LogoutUserBeforeNavigate: FC<Props> = (props) => {
	const { children, skipLoginRedirect = true } = props
	const dispatch = useDispatch()
	const { search } = useLocation()

	const { logout } = queryString.parse(search, { decode: false })

	useEffect(() => {
		if (logout === 'true' && isLoggedIn()) {
			dispatch(logOutUser(skipLoginRedirect))
		}
	}, [logout, dispatch, skipLoginRedirect])

	return <>{children}</>
}

export default React.memo(LogoutUserBeforeNavigate)
