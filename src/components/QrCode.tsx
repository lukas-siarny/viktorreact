import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from 'antd'

import qrTemplateSmall from '../assets/images/qrcode-small-template.png'
import { ReactComponent as DownloadIcon } from '../assets/icons/download-icon.svg'
import { handleAuthorizedDownload } from '../utils/helper'
import { getAccessToken } from '../utils/auth'

type Props = {
	link: string
	name: string
	description: string
}

const QrCode = (props: Props) => {
	const [t] = useTranslation()
	const { link, description, name } = props
	console.log('link', `${link}&t=${getAccessToken()}`)
	return (
		<div className={'flex items-center'}>
			<img src={qrTemplateSmall} alt='qr code' className='block' />
			<div className={'flex flex-col'}>
				<h4>{t('loc:Digitálny QR kód')}</h4>
				<span className={'mb-4 text-notino-grayDark'}>{description}</span>
				<Button
					className={'noti-btn w-min'}
					href={`${link}&t=${getAccessToken()}`}
					// href={'#'}
					onClick={(e) => handleAuthorizedDownload(e, link, name)}
					rel='noopener noreferrer'
					type={'primary'}
					htmlType={'button'}
					title='Download file'
					icon={<DownloadIcon width={24} />}
					download
				>
					{t('loc:Stiahnuť')}
				</Button>
			</div>
		</div>
	)
}

export default QrCode
