import React from 'react'
import { useTranslation } from 'react-i18next'
import { Field, FieldArray, InjectedFormProps, reduxForm } from 'redux-form'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Col, Collapse, Divider, Form, Row, Space, Spin, Tag } from 'antd'

// atoms
import SwitchField from '../../../atoms/SwitchField'

// types
import { IReservationSystemSettingsForm } from '../../../types/interfaces'

// utils
import { FORM, UPLOAD_IMG_CATEGORIES, URL_UPLOAD_IMAGES } from '../../../utils/enums'
import { showErrorNotification /* , showServiceCategory, validationNumberMin */ } from '../../../utils/helper'
import { withPromptUnsavedChanges } from '../../../utils/promptUnsavedChanges'

// validations
import validateReservationSystemSettingsForm from './validateReservationSystemSettingsForm'

// assets
import { ReactComponent as GlobeIcon } from '../../../assets/icons/globe-24.svg'
import { ReactComponent as SettingsIcon } from '../../../assets/icons/setting.svg'

type ComponentProps = {
	salonID: string
}

type Props = InjectedFormProps<IReservationSystemSettingsForm, ComponentProps> & ComponentProps

const ReservationSystemSettingsForm = (props: Props) => {
	const { salonID, handleSubmit, pristine } = props
	const [t] = useTranslation()
	const dispatch = useDispatch()

	return (
		<Form layout='vertical' className='w-full' onSubmitCapture={handleSubmit}>
			<div className={'flex'}>
				<h3 className={'mb-0 mt-0 flex items-center'}>
					<GlobeIcon className={'text-notino-black mr-2'} />
					{t('loc:Rezervačný systém')}

					<Field
						className='mb-0 pb-0 ml-2'
						component={SwitchField}
						onClick={(checked: boolean, event: Event) => event.stopPropagation()}
						name='enabledReservations'
						size='middle'
					/>
				</h3>
			</div>
			<Divider className={'my-3'} />
			<p className='x-regular text-notino-grayDark'>
				{t('loc:Zapína a vypína rezervačný systém, cez ktorý je možné v kalendári spravovať salónové rezervácie a smeny zamestnancov.')}
			</p>
		</Form>
	)
}

const form = reduxForm<IReservationSystemSettingsForm, ComponentProps>({
	form: FORM.RESEVATION_SYSTEM_SETTINGS,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	destroyOnUnmount: true,
	onSubmitFail: showErrorNotification,
	validate: validateReservationSystemSettingsForm
})(ReservationSystemSettingsForm)
// })(withPromptUnsavedChanges(ReservationSystemSettingsForm))

export default form
