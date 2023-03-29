import React from 'react'
import { Alert, Button } from 'antd'
import i18next from 'i18next'

// assets
import { ReactComponent as UploadIcon } from '../assets/icons/upload-icon.svg'
import { ReactComponent as CheckIcon } from '../assets/icons/check-icon-success.svg'

type Props = {
	onRequestAgain: () => void
	successMessage?: string
	description?: string | null
	buttonText?: string
	buttonIcon?: React.ReactNode
}

const RequestSuccess = (props: Props) => {
	const {
		onRequestAgain,
		successMessage = i18next.t('loc:Požiadavka na spracovanie dát bola úspešne vytvorená.'),
		description = i18next.t('loc:Po spracovaní vám na vašu e-mailovú adresu zašleme súhrnnú správu o importe.'),
		buttonIcon = <UploadIcon />,
		buttonText = i18next.t('loc:Importovať ďalšie')
	} = props

	return (
		<div className={'data-upload-success flex items-center gap-4 flex-col'}>
			<Alert message={successMessage} type={'success'} className={'noti-alert success-request-alert'} showIcon icon={<CheckIcon />} />
			{description && <p className={'mb-0'}>{description}</p>}
			<Button onClick={onRequestAgain} type='primary' htmlType='button' className={'noti-btn'} icon={buttonIcon}>
				{buttonText}
			</Button>
		</div>
	)
}

export default RequestSuccess
