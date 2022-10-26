import React, { FC } from 'react'
import { t } from 'i18next'
import { InjectedFormProps, reduxForm } from 'redux-form'
import { Button, Form } from 'antd'

// validate
import validateShiftForm from './validateShiftForm'

// utils
import { showErrorNotification } from '../../../../utils/helper'
import { CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW, FORM } from '../../../../utils/enums'

// types
import { ICalendarShiftForm } from '../../../../types/interfaces'

// assets
import { ReactComponent as CloseIcon } from '../../../../assets/icons/close-icon.svg'

type ComponentProps = {
	setCollapsed: (view: CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW) => void
}

type Props = InjectedFormProps<ICalendarShiftForm, ComponentProps> & ComponentProps

const CalendarShiftForm: FC<Props> = (props) => {
	const { handleSubmit, setCollapsed } = props

	return (
		<Form layout='vertical' onSubmitCapture={handleSubmit}>
			<div className={'flex w-full justify-between items-start gap-1'}>
				<h2 className={'text-base m-0'}>{t('loc:Nová smena')}</h2>
				<Button className='p-0 border-none shadow-none' onClick={() => setCollapsed(CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW.COLLAPSED)}>
					<CloseIcon style={{ width: 16, height: 16 }} />
				</Button>
			</div>
		</Form>
	)
}

const form = reduxForm<ICalendarShiftForm, ComponentProps>({
	form: FORM.CALENDAR_SHIFT_FORM,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	destroyOnUnmount: true,
	onSubmitFail: showErrorNotification,
	validate: validateShiftForm
})(CalendarShiftForm)

export default form
