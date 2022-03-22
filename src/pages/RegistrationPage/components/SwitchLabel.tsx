import React from 'react'

type Props = { label: string; anchorText: string; href: string }

const SwitchLabel = (props: Props) => {
	const { label, href, anchorText } = props
	return (
		<div className='text-notino-grayDark s-regular'>
			<span className='mr-1'>{label}</span>
			<a className='text-notino-grayDarker' href={href} target='_blank' rel='noreferrer'>
				{anchorText}
			</a>
		</div>
	)
}

export default SwitchLabel
