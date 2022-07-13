import React, { ReactNode, useMemo } from 'react'

// utils
import { RESOLUTIONS } from '../utils/enums'

// components
import LanguagePicker from '../components/LanguagePicker'

// hooks
import useMedia from '../hooks/useMedia'

// assets
import { ReactComponent as MdLogo } from '../assets/images/md-device-logo.svg'
import { ReactComponent as SmLogo } from '../assets/images/sm-device-logo.svg'
import FullLogo from '../assets/images/public-logo-full.png'
import ThinLogo from '../assets/images/public-logo-thin.png'

interface Props {
	children: ReactNode
}

const PublicLayout = (props: Props) => {
	// breakpoints are defined in tailwind config
	const size = useMedia(['(max-width: 744px)', '(max-width: 1280px)'], [RESOLUTIONS.SM, RESOLUTIONS.MD], RESOLUTIONS.XL)

	const content = useMemo(() => {
		switch (size) {
			case RESOLUTIONS.SM:
				return (
					<div className='public-layout grid place-items-center h-screen w-screen bg-notino-grayLighter'>
						<div className='bg-notino-grayLighter flex flex-col items-center overflow-hidden'>
							<SmLogo className='mb-6' />

							<div className='flex-auto relative'>
								{props.children}
								<LanguagePicker className='-bottom-1 right-0 absolute mb-0' />
							</div>
						</div>
					</div>
				)

			case RESOLUTIONS.MD:
				return (
					<div className='public-layout grid place-items-center h-screen w-screen'>
						<div className='layout-content flex'>
							<div className='block' style={{ width: '248px' }}>
								<img src={ThinLogo} alt='propagation logo' className='block' />
							</div>
							<div className='bg-notino-grayLighter flex flex-col items-center relative w-full'>
								<MdLogo className='mt-8 mb-6' />
								<LanguagePicker className='bottom-5 right-5 absolute mb-0' />
								{props.children}
							</div>
						</div>
					</div>
				)

			default:
				return (
					<div className='public-layout grid place-items-center h-screen w-screen'>
						<div className='layout-content grid grid-cols-2 gap-0'>
							<div className='block'>
								<img src={FullLogo} alt='propagation logo' className='block' />
							</div>
							<div className='bg-notino-grayLighter flex flex-col items-center relative'>
								<MdLogo className='mt-8 mb-6' />
								<LanguagePicker className='bottom-5 right-5 absolute mb-0' />
								{props.children}
							</div>
						</div>
					</div>
				)
		}
	}, [size, props.children])

	return <>{content}</>
}

export default PublicLayout
