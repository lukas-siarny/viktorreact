import React, { FC } from 'react'
import { change, Field, Fields, getFormValues, InjectedFormProps, reduxForm, submit } from 'redux-form'
import { Button, Form, Spin } from 'antd'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import cx from 'classnames'
import dayjs from 'dayjs'

// utils
import { optionRenderWithAvatar, showErrorNotification } from '../../../../utils/helper'
import {
	CALENDAR_COMMON_SETTINGS,
	CALENDAR_EVENT_TYPE,
	CREATE_EVENT_PERMISSIONS,
	EVERY_REPEAT,
	EVERY_REPEAT_OPTIONS,
	FORM,
	getDayNameFromNumber,
	SHORTCUT_DAYS_OPTIONS,
	UPDATE_EVENT_PERMISSIONS
} from '../../../../utils/enums'
import Permissions from '../../../../utils/Permissions'

// types
import { ICalendarEmployeesPayload } from '../../../../types/interfaces'

// assets
import { ReactComponent as EmployeesIcon } from '../../../../assets/icons/employees-icon.svg'
import { ReactComponent as TimerIcon } from '../../../../assets/icons/clock-icon.svg'
import { ReactComponent as DateSuffixIcon } from '../../../../assets/icons/date-suffix-icon.svg'

// atoms / components
import TimeRangeField from '../../../../atoms/TimeRangeField'
import SwitchField from '../../../../atoms/SwitchField'
import DateField from '../../../../atoms/DateField'
import SelectField from '../../../../atoms/SelectField'
import TextareaField from '../../../../atoms/TextareaField'
import CheckboxGroupField from '../../../../atoms/CheckboxGroupField'

// redux
import { RootState } from '../../../../reducers'

// schema
import { ICalendarEventForm, validationEventFn } from '../../../../schemas/event'

type ComponentProps = {
	eventId?: string | null
	loadingData?: boolean
	sidebarView?: CALENDAR_EVENT_TYPE
	employeesOptions: ICalendarEmployeesPayload['options']
	employeesLoading?: boolean
	isSubmittingForm?: boolean
}

type Props = InjectedFormProps<ICalendarEventForm, ComponentProps> & ComponentProps
const formName = FORM.CALENDAR_EVENT_FORM

const EventForm: FC<Props> = (props) => {
	const { handleSubmit, eventId, pristine, loadingData, sidebarView, employeesOptions, employeesLoading } = props
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const formValues: Partial<ICalendarEventForm> = useSelector((state: RootState) => getFormValues(formName)(state))
	const eventDetail = useSelector((state: RootState) => state.calendar.eventDetail)
	// NOTE: pristine pouzivat len pri UPDATE eventu a pri CREATE povlit akciu vzdy
	const disabledSubmitButton = !!(eventId && pristine) || loadingData

	const checkboxOptionRender = (option: any, checked?: boolean) => {
		return <div className={cx('w-5 h-5 flex-center bg-notino-grayLighter rounded', { 'bg-notino-pink': checked, 'text-notino-white': checked })}>{option?.label}</div>
	}

	const recurringFields = formValues?.recurring && (
		<>
			<Field
				className={'p-0 m-0'}
				component={CheckboxGroupField}
				name={'repeatOn'}
				label={t('loc:Opakovať ďalej')}
				options={SHORTCUT_DAYS_OPTIONS(2)}
				size={'small'}
				horizontal
				hideChecker
				optionRender={checkboxOptionRender}
			/>
			<Field
				component={SelectField}
				label={t('loc:Každý')}
				placeholder={t('loc:Vyberte frekvenciu')}
				name={'every'}
				size={'large'}
				options={EVERY_REPEAT_OPTIONS()}
				className={'pb-0'}
			/>
			<Field
				name={'end'}
				label={t('loc:Koniec opakovania')}
				className={'pb-0'}
				pickerClassName={'w-full'}
				component={DateField}
				showInReservationDrawer
				placement={'bottomRight'}
				dropdownAlign={{ points: ['tr', 'br'] }}
				required
				size={'large'}
				suffixIcon={<DateSuffixIcon className={'text-notino-grayDark'} />}
				compareFrom1={dayjs()}
				compareTo1={dayjs().add(1, 'year')}
			/>
		</>
	)

	const onChangeAllDay = (checked: any) => {
		if (checked) {
			// NOTE: cely den
			dispatch(change(formName, 'timeFrom', CALENDAR_COMMON_SETTINGS.EVENT_CONSTRAINT.startTime))
			dispatch(change(formName, 'timeTo', CALENDAR_COMMON_SETTINGS.EVENT_CONSTRAINT.endTime))
		} else {
			// Ak nie je cely den tak vynulovat
			dispatch(change(formName, 'timeFrom', null))
			dispatch(change(formName, 'timeTo', null))
		}
	}

	const onChangeRecurring = (checked: any) => {
		if (checked) {
			const repeatDay = getDayNameFromNumber(dayjs(formValues?.date).day()) // NOTE: .day() vrati cislo od 0 do 6 co predstavuje nedela az sobota
			dispatch(change(formName, 'every', EVERY_REPEAT.ONE_WEEK))
			dispatch(change(formName, 'repeatOn', [repeatDay]))
		}
	}

	return (
		<>
			<div className={'nc-sider-event-management-content'} key={`${eventId}${sidebarView}`}>
				<Spin spinning={eventDetail.isLoading || employeesLoading} size='large'>
					<Form layout='vertical' className='w-full h-full flex flex-col gap-4' onSubmitCapture={handleSubmit}>
						<Field
							component={SelectField}
							optionRender={(itemData: any) => optionRenderWithAvatar(itemData)}
							options={employeesOptions}
							label={t('loc:Zamestnanec')}
							suffixIcon={<EmployeesIcon className={'text-notino-grayDark small-icon'} />}
							placeholder={t('loc:Vyber zamestnanca')}
							name={'employee'}
							optionLabelProp={'label'}
							size={'large'}
							update={(_itemKey: number, ref: any) => ref.blur()}
							required
							className={'pb-0'}
							labelInValue
							disabled={eventId} // NOTE: ak je detail tak sa neda menit zamestnanec
						/>
						<Field
							name={'date'}
							label={t('loc:Dátum')}
							className={'pb-0'}
							pickerClassName={'w-full'}
							component={DateField}
							showInReservationDrawer
							placement={'bottomRight'}
							dropdownAlign={{ points: ['tr', 'br'] }}
							required
							size={'large'}
							suffixIcon={<DateSuffixIcon className={'text-notino-grayDark'} />}
						/>
						<Fields
							names={['timeFrom', 'timeTo']}
							labels={[t('loc:Začiatok'), t('loc:Koniec')]}
							placeholders={[t('loc:čas od'), t('loc:čas do')]}
							component={TimeRangeField}
							required
							disabled={!!formValues?.allDay} // NOTE: ak je cely den tak sa disable stav pre pre nastavenie casu
							allowClear
							itemClassName={'m-0 pb-0'}
							minuteStep={15}
							size={'large'}
							suffixIcon={<TimerIcon className={'text-notino-grayDark'} />}
						/>
						{formValues?.eventType === CALENDAR_EVENT_TYPE.EMPLOYEE_TIME_OFF && (
							<Field name={'allDay'} onChange={onChangeAllDay} className={'pb-0'} label={t('loc:Celý deň')} component={SwitchField} />
						)}

						<Field
							name={'recurring'}
							// NOTE: ak je  otvoreny EDIT tak sa nemoze dat menit reccuring (ani single eventu ani bulk eventu) ale daju sa menit ostatne hodnoty
							// NOTE: Tento field bude dosptupny len pri CREATE evente
							disabled={eventId}
							onChange={onChangeRecurring}
							className={'pb-0'}
							component={SwitchField}
							label={t('loc:Opakovať')}
						/>
						{recurringFields}
						{(formValues?.eventType === CALENDAR_EVENT_TYPE.EMPLOYEE_BREAK || formValues?.eventType === CALENDAR_EVENT_TYPE.EMPLOYEE_TIME_OFF) && (
							<Field name={'note'} label={t('loc:Poznámka')} className={'pb-0'} component={TextareaField} />
						)}
					</Form>
				</Spin>
			</div>
			<div className={'nc-sider-event-management-footer'}>
				<Permissions
					allowed={eventId ? UPDATE_EVENT_PERMISSIONS : CREATE_EVENT_PERMISSIONS}
					render={(hasPermission, { openForbiddenModal }) => (
						<Button
							onClick={(e) => {
								if (hasPermission) {
									dispatch(submit(formName))
								} else {
									e.preventDefault()
									openForbiddenModal()
								}
							}}
							disabled={disabledSubmitButton}
							htmlType={'submit'}
							type={'primary'}
							block
							className={'noti-btn self-end'}
						>
							{eventId ? t('loc:Upraviť') : t('loc:Vytvoriť')}
						</Button>
					)}
				/>
			</div>
		</>
	)
}

const form = reduxForm<ICalendarEventForm, ComponentProps>({
	form: formName,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	destroyOnUnmount: true,
	onSubmitFail: showErrorNotification,
	validate: validationEventFn
})(EventForm)

export default form
