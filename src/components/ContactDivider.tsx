import React, { useMemo } from 'react'
import ListDivided from './ListDivided'

type Props = {
	isFooter?: boolean
}

const ContactDivider = (props: Props) => {
	const { isFooter = false } = props

	const listDivided = useMemo(
		() => (
			<ListDivided
				items={[
					<>
						©<span className='current-date'>2022</span> KA-BE kovo s.r.o
					</>,
					<a href='mailto:kabekovo@gmail.com'>kabekovo@gmail.com</a>,
					<strong>
						<a href='tel:+421910539872'>+421 910 539 872</a>
					</strong>
				]}
			/>
		),
		[]
	)

	return isFooter ? <footer className='contact-divider container'>{listDivided}</footer> : <section className='contact-divider container'>{listDivided}</section>
}

export default ContactDivider
