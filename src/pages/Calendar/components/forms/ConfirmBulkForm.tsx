import React, { FC } from 'react'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { Form } from 'antd'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

// utils
import { showErrorNotification } from '../../../../utils/helper'
import { CALENDAR_DISABLED_NOTIFICATION_TYPE, CALENDAR_EVENT_TYPE, CONFIRM_BULK, FORM, REQUEST_TYPE, STRINGS } from '../../../../utils/enums'
import { getConfirmModalText } from '../../calendarHelpers'

// components
import RadioGroupField from '../../../../atoms/RadioGroupField'

// types
import { IBulkConfirmForm } from '../../../../types/interfaces'
import { RootState } from '../../../../reducers'

type ComponentProps = {
	requestType: REQUEST_TYPE
	eventType?: CALENDAR_EVENT_TYPE
}

type Props = InjectedFormProps<IBulkConfirmForm, ComponentProps> & ComponentProps

const formName = FORM.CONFIRM_BULK_FORM

const ConfirmBulkForm: FC<Props> = (props) => {
	const { handleSubmit, requestType, eventType } = props
	const [t] = useTranslation()
	const disabledNotifications = useSelector((state: RootState) => state.selectedSalon.selectedSalon.data?.settings?.disabledNotifications)

	const options = [
		{
			key: CONFIRM_BULK.SINGLE_RECORD,
			value: CONFIRM_BULK.SINGLE_RECORD,
			label: requestType === REQUEST_TYPE.PATCH ? STRINGS(t).edit(t('loc:len tento záznam')) : STRINGS(t).delete(t('loc:len tento záznam'))
		},
		{
			key: CONFIRM_BULK.BULK,
			value: CONFIRM_BULK.BULK,
			label: requestType === REQUEST_TYPE.PATCH ? STRINGS(t).edit(t('loc:všetky záznamy')) : STRINGS(t).delete(t('loc:všetky záznamy'))
		}
	]

	const getMessage = () => {
		if (requestType === REQUEST_TYPE.PATCH) {
			return t('loc:Upravujete záznam, ktorý sa opakuje. Aktualizácia nadchádzajúcich zmien prepíše prebiehajúce plánovanie.')
		}
		const deleteMessage = t('loc:Odstraňujete záznam, ktorý sa opakuje. Odstránenie nadchádzajúcich zmien prepíše prebiehajúce plánovanie.')
		if (eventType === CALENDAR_EVENT_TYPE.RESERVATION) {
			return getConfirmModalText(deleteMessage, CALENDAR_DISABLED_NOTIFICATION_TYPE.RESERVATION_CANCELLED, disabledNotifications)
		}

		return deleteMessage
	}

	return (
		<Form layout='vertical' className='w-full h-full flex flex-col gap-2' onSubmitCapture={handleSubmit}>
			<p>{getMessage()}</p>
			<Field className={'p-0 m-0 nc-radio-event-type'} component={RadioGroupField} name={'actionType'} options={options} direction={'vertical'} />
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
