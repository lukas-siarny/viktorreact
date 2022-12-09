import React, { FC } from 'react'
import { change, Field, Fields, getFormValues, InjectedFormProps, reduxForm, submit } from 'redux-form'
import { Button, Form, Spin } from 'antd'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import cx from 'classnames'
import dayjs from 'dayjs'

// validate
import validateShiftForm from './validateShiftForm'

// utils
import { optionRenderWithAvatar, showErrorNotification } from '../../../../utils/helper'
import Permissions from '../../../../utils/Permissions'
import {
	CREATE_EVENT_PERMISSIONS,
	EVERY_REPEAT,
	EVERY_REPEAT_OPTIONS,
	FORM,
	getDayNameFromNumber,
	SHORTCUT_DAYS_OPTIONS,
	STRINGS,
	UPDATE_EVENT_PERMISSIONS
} from '../../../../utils/enums'

// types
import { ICalendarEventForm } from '../../../../types/interfaces'

// assets
import { ReactComponent as EmployeesIcon } from '../../../../assets/icons/employees-16-current-color.svg'
import { ReactComponent as TimerIcon } from '../../../../assets/icons/clock-icon.svg'
import { ReactComponent as DateSuffixIcon } from '../../../../assets/icons/date-suffix-icon.svg'

// components / atoms
import SelectField from '../../../../atoms/SelectField'
import DateField from '../../../../atoms/DateField'
import TimeRangeField from '../../../../atoms/TimeRangeField'
import SwitchField from '../../../../atoms/SwitchField'
import CheckboxGroupField from '../../../../atoms/CheckboxGroupField'

// redux
import { RootState } from '../../../../reducers'

type ComponentProps = {
	eventId?: string | null
	searchEmployes: (search: string, page: number) => Promise<any>
}
const formName = FORM.CALENDAR_EMPLOYEE_SHIFT_FORM
type Props = InjectedFormProps<ICalendarEventForm, ComponentProps> & ComponentProps

const CalendarShiftForm: FC<Props> = (props) => {
	const { handleSubmit, eventId, searchEmployes } = props
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const formValues: Partial<ICalendarEventForm> = useSelector((state: RootState) => getFormValues(formName)(state))
	const eventDetail = useSelector((state: RootState) => state.calendar.eventDetail)

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

	const onChangeRecurring = (checked: any) => {
		if (checked) {
			const repeatDay = getDayNameFromNumber(dayjs(formValues?.date).day()) // NOTE: .day() vrati cislo od 0 do 6 co predstavuje nedela az sobota
			dispatch(change(formName, 'every', EVERY_REPEAT.ONE_WEEK))
			dispatch(change(formName, 'repeatOn', [repeatDay]))
		}
	}

	return (
		<>
			<div className={'nc-sider-event-management-content'}>
				<Spin spinning={eventDetail.isLoading} size='large'>
					<Form layout='vertical' className='w-full h-full flex flex-col gap-4' onSubmitCapture={handleSubmit}>
						<Field
							component={SelectField}
							optionRender={(itemData: any) => optionRenderWithAvatar(itemData)}
							label={t('loc:Zamestnanec')}
							suffixIcon={<EmployeesIcon className={'text-notino-grayDark'} />}
							placeholder={t('loc:Vyberte zamestnanca')}
							name={'employee'}
							size={'large'}
							optionLabelProp={'label'}
							update={(itemKey: number, ref: any) => ref.blur()}
							filterOption={false}
							allowInfinityScroll
							showSearch
							disabled={eventId} // NOTE: ak je detail tak sa neda menit zamestnanec
							required
							className={'pb-0'}
							labelInValue
							onSearch={searchEmployes}
						/>
						<Field
							name={'date'}
							label={t('loc:Dátum')}
							className={'pb-0'}
							pickerClassName={'w-full'}
							component={DateField}
							disablePast
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
							allowClear
							itemClassName={'m-0 pb-0'}
							minuteStep={15}
							size={'large'}
							suffixIcon={<TimerIcon className={'text-notino-grayDark'} />}
						/>
						<Field
							name={'recurring'}
							disabled={!formValues?.calendarBulkEventID && eventId}
							onChange={onChangeRecurring}
							label={t('loc:Opakovať')}
							className={'pb-0'}
							component={SwitchField}
						/>
						{recurringFields}
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
							htmlType={'submit'}
							type={'primary'}
							block
							className={'noti-btn self-end'}
						>
							{eventId ? STRINGS(t).edit(t('loc:zmenu')) : STRINGS(t).createRecord(t('loc:zmenu'))}
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
	validate: validateShiftForm
})(CalendarShiftForm)

export default form
