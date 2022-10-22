import React from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'

const Header = () => {
	const [t] = useTranslation()

	return <div className='nc-header'>{'Calednar'}</div>
}

export default Header
