import React, { FC } from 'react'
import { Field, InjectedFormProps, reduxForm, reset } from 'redux-form'
import { useTranslation } from 'react-i18next'
import { Button, Form, Modal, Spin } from 'antd'
import { useDispatch, useSelector } from 'react-redux'

// utils
import { formFieldID, optionRenderWithImage, showErrorNotification } from '../../../../utils/helper'
import { ENUMERATIONS_KEYS, FORM, SUBMIT_BUTTON_ID, REQUEST_STATUS, STRINGS } from '../../../../utils/enums'

// assets
import { ReactComponent as CloseIcon } from '../../../../assets/icons/close-icon-modal.svg'
import { ReactComponent as GlobeIcon } from '../../../../assets/icons/globe-24.svg'
import { ReactComponent as FilesIcon } from '../../../../assets/icons/files-icon.svg'

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

export const ALL_COUNTRIES_OPTION = 'ALL_COUNTRIES_OPTION'

const SalonsReportModal: FC<Props> = (props) => {
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const { handleSubmit, submitting, disabledForm, visible, setVisible, setRequestStatus, requestStatus } = props

	const resetUploadForm = () => {
		setRequestStatus(undefined)
		dispatch(reset(FORM.SALONS_REPORT))
	}

	const countries = useSelector((state: RootState) => state.enumerationsStore[ENUMERATIONS_KEYS.COUNTRIES])

	const options = [{ key: ALL_COUNTRIES_OPTION, label: t('loc:Všetky krajiny'), value: ALL_COUNTRIES_OPTION }, ...countries.enumerationsOptions]

	return (
		<Modal
			className='rounded-fields'
			title={STRINGS(t).generate(t('loc:report salónov'))}
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
						buttonText={STRINGS(t).generate(t('loc:ďalšie'))}
						buttonIcon={<FilesIcon />}
					/>
				) : (
					<Form onSubmitCapture={handleSubmit} layout={'vertical'} className={'form'}>
						<strong>{t('loc:Report pre každý salón zahŕňa')}:</strong>
						<ul className={'pl-5'}>
							<li>{t('loc:základné informácie')}</li>
							<li>{t('loc:kontaktné údaje')}</li>
							<li>{t('loc:stav salónu')}</li>
							<li>{t('loc:informácie o rezervačnom systéme')}</li>
							<li>{t('loc:informácie o ponúkaných službách')}</li>
							<li>{t('loc:počet kolegov a klientov')}</li>
						</ul>

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
							{STRINGS(t).generate('').trim()}
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
