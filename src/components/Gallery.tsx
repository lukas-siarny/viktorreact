import { useTranslation } from 'react-i18next'
import React, { useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import { SECTIONS } from '../utils/enums'

interface IBlurImage {
	thumbnail: string
	original: string
	width: number
	height: number
}

export const images: IBlurImage[] = [
	{
		thumbnail: '/gallery/thumbnails/1.jpg',
		original: '/gallery/1.jpg',
		width: 1320,
		height: 1980
	},
	{
		thumbnail: '/gallery/thumbnails/2.jpg',
		original: '/gallery/2.jpg',
		width: 1980,
		height: 1320
	},
	{
		thumbnail: '/gallery/thumbnails/3.jpg',
		original: '/gallery/3.jpg',
		width: 1320,
		height: 1980
	},
	{
		thumbnail: '/gallery/thumbnails/4.jpg',
		original: '/gallery/4.jpg',
		width: 1980,
		height: 1320
	},
	{
		thumbnail: '/gallery/thumbnails/5.jpg',
		original: '/gallery/5.jpg',
		width: 1320,
		height: 1980
	},
	{
		thumbnail: '/gallery/thumbnails/6.jpg',
		original: '/gallery/6.jpg',
		width: 1980,
		height: 1320
	},
	{
		thumbnail: '/gallery/thumbnails/7.jpg',
		original: '/gallery/7.jpg',
		width: 1980,
		height: 1320
	},
	{
		thumbnail: '/gallery/thumbnails/8.jpg',
		original: '/gallery/8.jpg',
		width: 1980,
		height: 1320
	},
	{
		thumbnail: '/gallery/thumbnails/9.jpg',
		original: '/gallery/9.jpg',
		width: 1980,
		height: 1320
	},
	{
		thumbnail: '/gallery/thumbnails/10.jpg',
		original: '/gallery/10.jpg',
		width: 1980,
		height: 1320
	},
	{
		thumbnail: '/gallery/thumbnails/11.jpg',
		original: '/gallery/11.jpg',
		width: 1320,
		height: 1980
	},
	{
		thumbnail: '/gallery/thumbnails/12.jpg',
		original: '/gallery/12.jpg',
		width: 1320,
		height: 1980
	},
	{
		thumbnail: '/gallery/thumbnails/13.jpg',
		original: '/gallery/13.jpg',
		width: 1980,
		height: 1320
	},
	{
		thumbnail: '/gallery/thumbnails/14.jpg',
		original: '/gallery/14.jpg',
		width: 1980,
		height: 1320
	},
	{
		thumbnail: '/gallery/thumbnails/15.jpg',
		original: '/gallery/15.jpg',
		width: 1980,
		height: 1320
	},
	{
		thumbnail: '/gallery/thumbnails/16.jpg',
		original: '/gallery/16.jpg',
		width: 1980,
		height: 1320
	}
]

type BlurImageProps = {
	image: IBlurImage
	handleClick: () => void
}

const BlurImage = (props: BlurImageProps) => {
	const [isLoading, setLoading] = useState(false)
	const { image, handleClick } = props

	return (
		<div className='blur-image-wrapper' onClick={handleClick}>
			<img
				alt=''
				src={image.thumbnail}
				// layout='fill'
				// objectFit='cover'
				className={`blur-image ${isLoading ? 'is-loading' : ''}`}
				// onLoadingComplete={() => setLoading(false)}
			/>
		</div>
	)
}

const slides = images.map(({ original, width, height }) => ({
	src: original,
	width,
	height
}))

const GallerySection = () => {
	const [index, setIndex] = useState(-1)

	const { i18n } = useTranslation()

	const sections = SECTIONS[i18n.language as keyof typeof SECTIONS]

	return (
		<section className='gallery' id={sections.WORK}>
			<div className='gallery-content container'>
				{images.map((image, i) => (
					<BlurImage key={i} image={image} handleClick={() => setIndex(i)} />
				))}
				<Lightbox slides={slides} open={index >= 0} index={index} close={() => setIndex(-1)} />
			</div>
		</section>
	)
}

export default GallerySection
