import React, { ReactNode } from 'react'

interface Props {
	children: ReactNode
}

const SimpleLayout = (props: Props) => {
	const { children } = props

	return (
		<div className={'simple-layout'}>
			<div className='content'>{children}</div>
		</div>
	)
}

export default SimpleLayout
