import React from 'react'

type Props = {
	items: React.ReactNode[]
}

const ListDivided = (props: Props) => {
	const { items } = props

	return (
		<ul className='list-divided'>
			{items.map((item, index) => (
				<li key={index}>{item}</li>
			))}
		</ul>
	)
}

export default ListDivided
