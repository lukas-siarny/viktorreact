import React, { FC } from 'react'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { Divider, Form } from 'antd'
import { useTranslation } from 'react-i18next'

// validate
// utils
import { showErrorNotification } from '../../../../utils/helper'
import { CALENDAR_EVENTS_VIEW_TYPE, EVENT_TYPE_OPTIONS, FORM } from '../../../../utils/enums'

// types
import { IEventTypeFilterForm } from '../../../../types/interfaces'

// assets

// components / atoms
import SelectField from '../../../../atoms/SelectField'

// redux

type ComponentProps = {
	eventsViewType: CALENDAR_EVENTS_VIEW_TYPE
	onChangeEventType: any
}

type Props = InjectedFormProps<IEventTypeFilterForm, ComponentProps> & ComponentProps

const formName = FORM.EVENT_TYPE_FILTER_FORM

const EventTypeFilterForm: FC<Props> = (props) => {
	const { handleSubmit, eventsViewType, onChangeEventType } = props
	const [t] = useTranslation()

	return (
		<Form layout='vertical' onSubmitCapture={handleSubmit}>
			<Field
				component={SelectField}
				label={t('loc:Typ udalosti')}
				placeholder={t('loc:Vyberte typ')}
				name={'eventType'}
				options={EVENT_TYPE_OPTIONS(eventsViewType)}
				size={'large'}
				className={'pb-0'}
				onChange={onChangeEventType}
				filterOption={false}
				allowInfinityScroll
			/>
			<Divider className={'mb-3 mt-3'} />
		</Form>
	)
}

const form = reduxForm<IEventTypeFilterForm, ComponentProps>({
	form: formName,
	forceUnregisterOnUnmount: false,
	touchOnChange: true,
	destroyOnUnmount: false,
	onSubmitFail: showErrorNotification
})(EventTypeFilterForm)

export default form
