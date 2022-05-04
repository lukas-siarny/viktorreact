import React, { ReactNode, useRef, useCallback, useLayoutEffect, useState } from 'react'
import { Carousel } from 'antd'
import { CarouselRef } from 'antd/lib/carousel'

import { ReactComponent as Logo } from '../assets/images/logo.svg'
import { ReactComponent as Chevron } from '../assets/icons/chevron-right.svg'

// utils
import { MIN_SUPPORTED_RESOLUTION } from '../utils/enums'

// components
import LanguagePicker from '../components/LanguagePicker'

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
	const [isMobile, setIsMobile] = useState(false)

	useLayoutEffect(() => {
		const detectMobile = () => setIsMobile(window.innerWidth < MIN_SUPPORTED_RESOLUTION)

		window.addEventListener('resize', detectMobile)
		detectMobile()

		return () => window.removeEventListener('resize', detectMobile)
	}, [])

	const handleNext = useCallback(() => {
		const ref = carouselRef?.current
		if (ref) {
			;(ref as CarouselRef).next()
		}
	}, [carouselRef])

	return (
		<>
			{isMobile ? (
				<div className='simple-layout grid place-items-center h-screen w-screen bg-notino-grayLighter relative'>
					<div className='bg-notino-grayLighter sm:pt-4 flex flex-col items-center overflow-hidden'>
						<Logo />
						<LanguagePicker className='top-16 sm:top-12 right-2 absolute' />
						<div className='flex-auto'>{props.children}</div>
					</div>
				</div>
			) : (
				<div className='simple-layout grid place-items-center h-screen w-screen'>
					<div className='layout-content grid md:grid-cols-2 grid-cols-1 gap-0'>
						<div className='bg-white px-45px py-4 relative block'>
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
						<div className='bg-notino-grayLighter py-4 flex flex-col items-center relative'>
							<Logo />
							<LanguagePicker className='top-4 right-2 absolute' />
							<div className='flex-auto'>{props.children}</div>
						</div>
					</div>
				</div>
			)}
		</>
	)
}

export default PublicLayout
