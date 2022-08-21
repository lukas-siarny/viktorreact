import React, { useMemo } from 'react'
import { Button } from 'antd'
import { useTranslation } from 'react-i18next'
import useMedia from '../hooks/useMedia'
import { RESOLUTIONS } from '../utils/enums'
import { ReactComponent as ErrorImage } from '../assets/images/Error-503-image.svg'

const Error503Page = () => {
	const [t] = useTranslation()
	const size = useMedia(['(max-width: 744px)', '(max-width: 1280px)'], [RESOLUTIONS.SM, RESOLUTIONS.MD], RESOLUTIONS.XL)

	const handleRedirect = () => {
		// TODO toto ma pochopitelne neredirectne na notino ale zostane to tu.
		window.location.replace('/')
	}

	const content = useMemo(() => {
		switch (size) {
			case RESOLUTIONS.SM:
				return (
					<div className={'bg-notino-grayLighter min-h-screen h-full flex-center flex-col text-center'}>
						<span className={'text-xl text-notino-grayDarker opacity-10'} style={{ fontSize: '150px' }}>
							503
						</span>
						<div className={'bg-notino-grayLighter z-10 mt-4'}>
							<ErrorImage width={'185px'} height={'138px'}/>
						</div>
						<span className={'heading-2 mt-4'}>
							{t('loc:Ooops...')}
						</span>
						<span className={'m-regular mt-3 max-w-sm'} style={{ fontSize: '16px', lineHeight: '18.8px' }}>
							{t(`loc:Sorry, we're under maintance! hang on till we get the error fixed. You may also refresh the page or try again later.`)}
						</span>
						<Button type={'primary'} className={'noti-btn m-regular mt-4'} onClick={handleRedirect}>
							{t('loc:Refresh')}
						</Button>
					</div>
				)
			case RESOLUTIONS.MD:
				return (
					<div className={'bg-notino-grayLighter min-h-screen h-full flex-center flex-col text-center'}>
						<span className={'text-xl text-notino-grayDarker opacity-10'} style={{ fontSize: '250px' }}>
							503
						</span>
						<div className={'bg-notino-grayLighter z-10 mt-6'}>
							<ErrorImage width={'185px'} height={'138px'}/>
						</div>
						<span className={'heading-2 mt-6'}>
							{t('loc:Ooops...')}
						</span>
						<span className={'m-regular mt-3 max-w-md'} style={{ fontSize: '16px', lineHeight: '18.8px' }}>
							{t(`loc:Sorry, we're under maintance! hang on till we get the error fixed. You may also refresh the page or try again later.`)}
						</span>
						<Button type={'primary'} className={'noti-btn m-regular mt-4'} onClick={handleRedirect}>
							{t('loc:Refresh')}
						</Button>
					</div>
				)
			default:
				return (
					<div className={'bg-notino-grayLight min-h-screen h-full p-10'}>
						<div className={'bg-notino-grayLighter border-4 shadow-lg h-full flex-center'} style={{ minHeight: 'calc(100vh - 80px)'}}>
							<div className={'flex-center flex-col text-center mt-36'}>
								<span className={'text-xl text-notino-grayDarker opacity-10'} style={{ fontSize: '350px' }}>
									503
								</span>
								<div className={'bg-notino-grayLighter z-10 mt-8'}>
									<ErrorImage width={'229px'} height={'171px'}/>
								</div>
								<span className={'heading-2 mt-8'}>
									{t('loc:Ooops...')}
								</span>
								<span className={'m-regular mt-3'} style={{ maxWidth: '460px', fontSize: '16px', lineHeight: '19px' }}>
									{t(`loc:Sorry, we're under maintance! hang on till we get the error fixed. You may also refresh the page or try again later.`)}
								</span>
								<Button type={'primary'} className={'noti-btn m-regular mt-4'} onClick={handleRedirect}>
									{t('loc:Refresh')}
								</Button>
							</div>
						</div>
					</div>
				)
		}
	}, [size])

	return <>{content}</>
}

export default Error503Page
