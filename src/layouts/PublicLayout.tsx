import React, { ReactNode, useRef, useCallback } from 'react'
import { Carousel } from 'antd'
import { CarouselRef } from 'antd/lib/carousel'

import { ReactComponent as Logo } from '../assets/images/logo.svg'
import { ReactComponent as Chevron } from '../assets/icons/chevron-right.svg'

interface Props {
	children: ReactNode
}

const mock = [
	{
		src: 'https://cdn.notinoimg.com/images/gallery/act/1/notino_gift_w08_20220218_14.jpg',
		title: 'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae.',
		description: '15 % zľava na značku Notino a hodnotná sada štetcov k nákupu produktov Notino Beauty Electro Collection ZADARMO.'
	},
	{
		src: 'https://cdn.notinoimg.com/images/gallery/act/1/tommy_hilfiger_gift_w08_20220216_30.jpg',
		title: 'Vestibulum ac diam sit amet quam vehicula elementum sed sit amet dui.',
		description: 'Nakúpte produkty značky Tommy Hilfiger nad 30 € a spríjemníme vám deň výberom jednej z 2 kozmetických taštičiek ZADARMO.'
	},
	{
		src: 'https://cdn.notinoimg.com/images/gallery/act/1/comme_des_gorcons_gift_w03_20220113_15.jpg',
		title: 'Curabitur aliquet quam id dui posuere blandit. Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a.',
		description: 'K nákupu parfémov značky Comme Des Garçons si v košíku vyberiete mini vôňu. A naviac vám objednávku doručíme bez poštovného.'
	}
]

const PublicLayout = (props: Props) => {
	const carouselRef = useRef(null)

	const handleNext = useCallback(() => {
		const ref = carouselRef?.current
		if (ref) {
			;(ref as CarouselRef).next()
		}
	}, [carouselRef])

	return (
		<div className='simple-layout grid place-items-center h-screen w-screen'>
			<div className='layout-content grid md:grid-cols-2 grid-cols-1 gap-0'>
				<div className='bg-white p-45px relative md:block hidden'>
					<Carousel ref={carouselRef}>
						{mock.map((item, index) => (
							<div key={index} className='carousel-content rounded-3xl flex flex-col justify-between'>
								<img src={item.src} alt={item.title} className='rounded-3xl' />
								<div>
									<h4 className='mt-11'>{item.title}</h4>
									<div className='mt-3 mb-12 base-regular'>{item.description}</div>
								</div>
							</div>
						))}
					</Carousel>
					<Chevron onClick={handleNext} className='absolute bottom-45px right-45px cursor-pointer' />
				</div>
				<div className='bg-notino-grayLighter pt-21 pb-12 flex flex-col items-center'>
					<Logo />
					<div className='mt-16 flex-auto'>{props.children}</div>
				</div>
			</div>
		</div>
	)
}

export default PublicLayout
