import React, { FC } from 'react'
import { t } from 'i18next'
import { InjectedFormProps, reduxForm } from 'redux-form'
import { Button, Form } from 'antd'

// validate
import validateBreakForm from './validateShiftForm'

// utils
import { showErrorNotification } from '../../../../utils/helper'
import { CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW, FORM } from '../../../../utils/enums'

// types
import { ICalendarBreakForm } from '../../../../types/interfaces'

// assets
import { ReactComponent as CloseIcon } from '../../../../assets/icons/close-icon.svg'

type ComponentProps = {
	setCollapsed: (view: CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW) => void
}

type Props = InjectedFormProps<ICalendarBreakForm, ComponentProps> & ComponentProps

const CalendarBreakForm: FC<Props> = (props) => {
	const { handleSubmit, setCollapsed } = props

	return (
		<Form layout='vertical' onSubmitCapture={handleSubmit}>
			<div className={'flex w-full justify-between items-start gap-1'}>
				<h2 className={'text-base m-0'}>{t('loc:Nová prestávka')}</h2>
				<Button className='p-0 border-none shadow-none' onClick={() => setCollapsed(CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW.COLLAPSED)}>
					<CloseIcon style={{ width: 16, height: 16 }} />
				</Button>
			</div>
		</Form>
	)
}

const form = reduxForm<ICalendarBreakForm, ComponentProps>({
	form: FORM.CALENDAR_BREAK_FORM,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	destroyOnUnmount: true,
	onSubmitFail: showErrorNotification,
	validate: validateBreakForm
})(CalendarBreakForm)

export default form
