import React, { MouseEventHandler, useCallback, useState, FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Field, Fields, InjectedFormProps, reduxForm, submit } from 'redux-form'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Form } from 'antd'
import cx from 'classnames'

// validate
import validateReservationForm from './validateShiftForm'

// reducers
import { RootState } from '../../../../reducers'

// utils
import { showErrorNotification } from '../../../../utils/helper'
import { CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW, FORM, STRINGS } from '../../../../utils/enums'

// types
import { ICalendarReservationForm } from '../../../../types/interfaces'

// assets
import { ReactComponent as CloseIcon } from '../../../../assets/icons/close-icon.svg'
import { ReactComponent as ProfileIcon } from '../../../../assets/icons/profile-icon.svg'
import { ReactComponent as ServicesIcon } from '../../../../assets/icons/services-24-icon.svg'
import { ReactComponent as EmployeesIcon } from '../../../../assets/icons/employees.svg'

// components
import CalendarSelectField from '../CalendarSelectField'
import DateField from '../../../../atoms/DateField'
import TextareaField from '../../../../atoms/TextareaField'
import TimeRangeField from '../../../../atoms/TimeRangeField'

type ComponentProps = {
	setCollapsed: (view: CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW) => void
}

type Props = InjectedFormProps<ICalendarReservationForm, ComponentProps> & ComponentProps

const ReservationForm: FC<Props> = (props) => {
	const { handleSubmit, setCollapsed } = props
	const [t] = useTranslation()
	const dispatch = useDispatch()

	const serviceOptions = [
		{
			key: 'Odvetvie 1',
			header: 'Odvetvie 1',
			children: [
				{
					key: 'Service 1',
					value: 'service-1-id',
					content: <div>{'Service 1 option'}</div>
				},
				{
					key: 'Service 2',
					value: 'service-2-id',
					content: <div>{'Service 2 option'}</div>
				}
			]
		},
		{
			key: 'Odvetvie 2',
			header: 'Odvetvie 2',
			children: [
				{
					key: 'Service 3',
					value: 'service-3-id',
					content: <div>{'Service 3 option'}</div>
				},
				{
					key: 'Service 4',
					value: 'service-4-id',
					content: <div>{'Service 4 option'}</div>
				}
			]
		}
	]

	return (
		<>
			<div className={'nc-sider-event-management-header justify-between'}>
				<h2>{t('loc:Nová rezervácia')}</h2>
				<Button className='button-transparent' onClick={() => setCollapsed(CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW.COLLAPSED)}>
					<CloseIcon />
				</Button>
			</div>
			<div className={'nc-sider-event-management-content main-panel'}>
				<Form layout='vertical' className='w-full h-full flex flex-col gap-4' onSubmitCapture={handleSubmit}>
					{/* <Field name={'customer'} label={t('loc:Zákazník')} component={CalendarSelectField} emptyIcon={<ProfileIcon />} entityName={t('loc:zákaznika')} required /> */}
					<Field
						name={'service'}
						label={t('loc:Služba')}
						component={CalendarSelectField}
						emptyIcon={<ServicesIcon />}
						entityName={t('loc:službu')}
						options={serviceOptions}
						required
					/>
					{/* <Field name={'service'} label={t('loc:Zamestnanec')} component={CalendarSelectField} emptyIcon={<EmployeesIcon />} entityName={t('loc:zamestnanca')} required /> */}
					<Field name={'date'} label={t('loc:Dátum')} className={'pb-0'} component={DateField} dropdownAlign={{ points: ['tr', 'br'] }} required />
					<Fields
						names={['timeFrom', 'timeTo']}
						placeholders={[t('loc:čas od'), t('loc:čas do')]}
						component={TimeRangeField}
						hideHelp
						allowClear
						itemClassName={'m-0 pb-0'}
						minuteStep={15}
					/>
					<Field name={'note'} label={t('loc:Poznámka')} className={'pb-0'} component={TextareaField} required />
				</Form>
			</div>
			<div className={'nc-sider-event-management-footer'}>
				<Button onClick={() => dispatch(submit(FORM.CALENDAR_RESERVATION_FORM))} htmlType={'submit'} type={'primary'} block className={'noti-btn self-end'}>
					{STRINGS(t).createRecord(t('loc:rezerváciu'))}
				</Button>
			</div>
		</>
	)
}

const form = reduxForm<ICalendarReservationForm, ComponentProps>({
	form: FORM.CALENDAR_RESERVATION_FORM,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	destroyOnUnmount: true,
	onSubmitFail: showErrorNotification,
	validate: validateReservationForm
})(ReservationForm)

export default form
