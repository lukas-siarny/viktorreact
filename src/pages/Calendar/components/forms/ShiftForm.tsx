import React, { FC } from 'react'
import { change, Field, Fields, getFormValues, InjectedFormProps, reduxForm, submit } from 'redux-form'
import { Button, Divider, Form } from 'antd'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import cx from 'classnames'
import dayjs from 'dayjs'

// validate
import validateShiftForm from './validateShiftForm'

// utils
import { optionRenderWithAvatar, showErrorNotification } from '../../../../utils/helper'
import {
	CALENDAR_EVENT_TYPE,
	CALENDAR_EVENTS_VIEW_TYPE,
	ENDS_EVENT,
	ENDS_EVENT_OPTIONS,
	EVENT_TYPE_OPTIONS,
	EVERY_REPEAT_OPTIONS,
	FORM,
	getDayNameFromNumber,
	SHORTCUT_DAYS_OPTIONS,
	STRINGS
} from '../../../../utils/enums'

// types
import { ICalendarEventForm } from '../../../../types/interfaces'

// assets
import { ReactComponent as CloseIcon } from '../../../../assets/icons/close-icon.svg'
import { ReactComponent as ProfileIcon } from '../../../../assets/icons/profile-icon.svg'

// components / atoms
import SelectField from '../../../../atoms/SelectField'
import DateField from '../../../../atoms/DateField'
import TimeRangeField from '../../../../atoms/TimeRangeField'
import SwitchField from '../../../../atoms/SwitchField'
import CheckboxGroupField from '../../../../atoms/CheckboxGroupField'

// redux
import { RootState } from '../../../../reducers'
import DeleteButton from '../../../../components/DeleteButton'

type ComponentProps = {
	setCollapsed: (view: CALENDAR_EVENT_TYPE | undefined) => void
	onChangeEventType: (type: any) => any
	handleDeleteEvent: () => any
	eventId?: string | null
	searchEmployes: (search: string, page: number) => Promise<any>
	eventsViewType: CALENDAR_EVENTS_VIEW_TYPE
}
const formName = FORM.CALENDAR_EMPLOYEE_SHIFT_FORM
type Props = InjectedFormProps<ICalendarEventForm, ComponentProps> & ComponentProps

const CalendarShiftForm: FC<Props> = (props) => {
	const { handleSubmit, setCollapsed, onChangeEventType, handleDeleteEvent, eventId, searchEmployes, eventsViewType } = props
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const formValues: Partial<ICalendarEventForm> = useSelector((state: RootState) => getFormValues(formName)(state))

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
				component={SelectField}
				label={t('loc:Koniec')}
				placeholder={t('loc:Vyberte koniec')}
				name={'end'}
				size={'large'}
				allowInfinityScroll
				options={ENDS_EVENT_OPTIONS()}
				className={'pb-0'}
			/>
		</>
	)

	const onChangeRecurring = (checked: any) => {
		if (checked) {
			dispatch(change(formName, 'end', ENDS_EVENT.WEEK))
			const repeatDay = getDayNameFromNumber(dayjs(formValues?.date).day()) // NOTE: .day() vrati cislo od 0 do 6 co predstavuje nedela az sobota
			dispatch(change(formName, 'repeatOn', repeatDay))
		}
	}

	return (
		<>
			<div className={'nc-sider-event-management-header justify-between'}>
				<div className={'font-semibold'}>{eventId ? STRINGS(t).edit(t('loc:zmenu')) : STRINGS(t).createRecord(t('loc:zmenu'))}</div>
				<div className={'flex-center'}>
					{eventId && (
						<DeleteButton
							placement={'bottom'}
							entityName={t('loc:zmenu')}
							className={'bg-transparent mr-4'}
							onConfirm={handleDeleteEvent}
							onlyIcon
							smallIcon
							size={'small'}
						/>
					)}
					<Button
						className='button-transparent'
						onClick={() => {
							setCollapsed(undefined)
						}}
					>
						<CloseIcon />
					</Button>
				</div>
			</div>
			<div className={'nc-sider-event-management-content main-panel'}>
				<Form layout='vertical' className='w-full h-full flex flex-col gap-4' onSubmitCapture={handleSubmit}>
					{!eventId && (
						<>
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
						</>
					)}
					<Field
						component={SelectField}
						optionRender={(itemData: any) => optionRenderWithAvatar(itemData)}
						label={t('loc:Zamestnanec')}
						suffixIcon={<ProfileIcon />}
						placeholder={t('loc:Vyberte zamestnanca')}
						name={'employee'}
						size={'large'}
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
			</div>
			<div className={'nc-sider-event-management-footer'}>
				<Button onClick={() => dispatch(submit(formName))} htmlType={'submit'} type={'primary'} block className={'noti-btn self-end'}>
					{eventId ? STRINGS(t).edit(t('loc:zmenu')) : STRINGS(t).createRecord(t('loc:zmenu'))}
				</Button>
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
