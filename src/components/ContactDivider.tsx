import React, { useMemo } from 'react'
import ListDivided from './ListDivided'

const ContactDivider = () => {
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

	return <section className='contact-divider container'>{listDivided}</section>
}

export default ContactDivider
