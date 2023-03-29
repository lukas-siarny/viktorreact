import React, { FC } from 'react'
import { Field, InjectedFormProps, reduxForm, reset } from 'redux-form'
import { useTranslation } from 'react-i18next'
import { Alert, Button, Form, Modal, Spin } from 'antd'
import { useDispatch, useSelector } from 'react-redux'

// utils
import { formFieldID, optionRenderWithImage, showErrorNotification } from '../../../../utils/helper'
import { ENUMERATIONS_KEYS, FORM, SUBMIT_BUTTON_ID, REQUEST_STATUS } from '../../../../utils/enums'

// assets
import { ReactComponent as CloseIcon } from '../../../../assets/icons/close-icon.svg'
import { ReactComponent as GlobeIcon } from '../../../../assets/icons/globe-24.svg'
import { ReactComponent as InfoIcon } from '../../../../assets/icons/info-icon.svg'
import { ReactComponent as DownloadIcon } from '../../../../assets/icons/download-icon.svg'

// components
import SelectField from '../../../../atoms/SelectField'
import RequestSuccess from '../../../../components/RequestSuccess'

// types
import { ISalonsReportForm } from '../../../../types/interfaces'
import { RootState } from '../../../../reducers'

type ComponentProps = {
	visible: boolean
	setVisible: React.Dispatch<React.SetStateAction<boolean>>
	setRequestStatus: React.Dispatch<React.SetStateAction<REQUEST_STATUS | undefined>>
	requestStatus: REQUEST_STATUS | undefined
	disabledForm?: boolean
}

type Props = InjectedFormProps<ISalonsReportForm, ComponentProps> & ComponentProps

export const ALL_COUNTIRES_OPTION = 'ALL_COUNTIRES_OPTION'

const SalonsReportModal: FC<Props> = (props) => {
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const { handleSubmit, submitting, disabledForm, visible, setVisible, setRequestStatus, requestStatus } = props

	const resetUploadForm = () => {
		setRequestStatus(undefined)
		dispatch(reset(FORM.SALONS_REPORT))
	}

	const countries = useSelector((state: RootState) => state.enumerationsStore[ENUMERATIONS_KEYS.COUNTRIES])

	const options = [{ key: ALL_COUNTIRES_OPTION, label: t('loc:Všetky krajiny'), value: ALL_COUNTIRES_OPTION }, ...countries.enumerationsOptions]

	return (
		<Modal
			className='rounded-fields'
			title={t('loc:Stiahnuť report salónov')}
			centered
			open={visible}
			destroyOnClose
			footer={null}
			onCancel={() => {
				resetUploadForm()
				setVisible(false)
			}}
			closeIcon={<CloseIcon />}
			width={394}
			maskClosable={false}
			keyboard={false}
		>
			<Spin spinning={requestStatus === REQUEST_STATUS.SUBMITTING || countries.isLoading}>
				{requestStatus === REQUEST_STATUS.SUCCESS ? (
					<RequestSuccess
						onRequestAgain={resetUploadForm}
						description={t('loc:Po úspešnom spracovaní vám na vašu e-mailovú adresu zašleme report salónov vo formáte .xlxs')}
						buttonText={t('loc:Stiahnuť ďalšie')}
						buttonIcon={<DownloadIcon />}
					/>
				) : (
					<Form onSubmitCapture={handleSubmit} layout={'vertical'} className={'form'}>
						<Field
							component={SelectField}
							optionRender={(itemData: any) => optionRenderWithImage(itemData, <GlobeIcon />)}
							name={'countryCode'}
							placeholder={t('loc:Krajina')}
							size={'middle'}
							label={t('loc:Krajina')}
							filterOptions
							options={options}
							loading={countries?.isLoading}
							disabled={countries?.isLoading}
						/>
						<Button
							id={formFieldID(FORM.IMPORT_FORM, SUBMIT_BUTTON_ID)}
							className='noti-btn'
							block
							size='large'
							type='primary'
							htmlType='submit'
							disabled={disabledForm || submitting}
							loading={submitting}
						>
							{t('loc:Stiahnuť')}
						</Button>
					</Form>
				)}
			</Spin>
		</Modal>
	)
}

const form = reduxForm<ISalonsReportForm, ComponentProps>({
	form: FORM.SALONS_REPORT,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	destroyOnUnmount: true,
	onSubmitFail: showErrorNotification
})(SalonsReportModal)

export default form
