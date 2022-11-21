import React, { FC } from 'react'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { Form } from 'antd'
import { useTranslation } from 'react-i18next'

// utils
import { showErrorNotification } from '../../../../utils/helper'
import { CONFIRM_BULK, FORM } from '../../../../utils/enums'

// components
import RadioGroupField from '../../../../atoms/RadioGroupField'

import { IBulkConfirmForm } from '../../../../types/interfaces'

type ComponentProps = {}

type Props = InjectedFormProps<IBulkConfirmForm, ComponentProps> & ComponentProps

const formName = FORM.CONFIRM_BULK_FORM

const ConfirmBulkForm: FC<Props> = (props) => {
	const { handleSubmit } = props
	const [t] = useTranslation()

	const options = [
		{
			key: CONFIRM_BULK.SINGLE_RECORD,
			value: CONFIRM_BULK.SINGLE_RECORD,
			label: t('loc:Edit this shift only')
		},
		{
			key: CONFIRM_BULK.BULK,
			value: CONFIRM_BULK.BULK,
			label: t('loc:Edit upcoming shifts')
		}
	]
	return (
		<Form layout='vertical' className='w-full h-full flex flex-col gap-4' onSubmitCapture={handleSubmit}>
			<Field className={'p-0 m-0 nc-radio-event-type'} component={RadioGroupField} name={'actionType'} options={options} direction={'vertical'} size={'small'} />
		</Form>
	)
}

const form = reduxForm<IBulkConfirmForm, ComponentProps>({
	form: formName,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	destroyOnUnmount: true,
	onSubmitFail: showErrorNotification
})(ConfirmBulkForm)

export default form
