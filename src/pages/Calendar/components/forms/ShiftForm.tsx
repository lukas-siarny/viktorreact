import React, { ChangeEventHandler, FC, useCallback } from 'react'
import { change, Field, Fields, getFormValues, InjectedFormProps, reduxForm, submit } from 'redux-form'
import { Button, Form } from 'antd'
import { map } from 'lodash'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

// validate
import cx from 'classnames'
import dayjs from 'dayjs'
import validateShiftForm from './validateShiftForm'

// utils
import { formatLongQueryString, optionRenderWithAvatar, roundMinutes, showErrorNotification } from '../../../../utils/helper'
import { CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW, DAY, DEFAULT_TIME_FORMAT_HOURS, DEFAULT_TIME_FORMAT_MINUTES, ENDS_EVENT, FORM, REPEAT_ON, STRINGS } from '../../../../utils/enums'
import { getReq } from '../../../../utils/request'

// types
import { ICalendarShiftForm } from '../../../../types/interfaces'

// assets
import { ReactComponent as CloseIcon } from '../../../../assets/icons/close-icon.svg'
import { ReactComponent as ProfileIcon } from '../../../../assets/icons/profile-icon.svg'

// components / atoms
import SelectField from '../../../../atoms/SelectField'
import DateField from '../../../../atoms/DateField'
import TimeRangeField from '../../../../atoms/TimeRangeField'
import SwitchField from '../../../../atoms/SwitchField'

// redux
import { RootState } from '../../../../reducers'
import CheckboxGroupField from '../../../../atoms/CheckboxGroupField'

type ComponentProps = {
	salonID: string
	setCollapsed: (view: CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW) => void
}

type Props = InjectedFormProps<ICalendarShiftForm, ComponentProps> & ComponentProps

const CalendarShiftForm: FC<Props> = (props) => {
	const { handleSubmit, setCollapsed, salonID } = props
	const [t] = useTranslation()
	const dispatch = useDispatch()

	const formValues: any = useSelector((state: RootState) => getFormValues(FORM.CALENDAR_SHIFT_FORM)(state))

	const searchEmployes = useCallback(
		async (search: string, page: number) => {
			try {
				const { data } = await getReq('/api/b2b/admin/employees/', {
					search: formatLongQueryString(search),
					page,
					salonID
				})
				const selectOptions = map(data.employees, (employee) => ({
					value: employee.id,
					key: employee.id,
					label: employee.firstName && employee.lastName ? `${employee.firstName} ${employee.lastName}` : employee.email,
					thumbNail: employee.image.resizedImages.thumbnail
					// TODO: Available / Non Available hodnoty ak pribudne logika na BE tak doplnit ako extraContent
				}))
				return { pagination: data.pagination, data: selectOptions }
			} catch (e) {
				return { pagination: null, data: [] }
			}
		},
		[salonID]
	)

	const options = [
		{ label: t('loc:Po'), value: DAY.MONDAY },
		{ label: t('loc:Ut'), value: DAY.TUESDAY },
		{ label: t('loc:St'), value: DAY.WEDNESDAY },
		{ label: t('loc:Št'), value: DAY.THURSDAY },
		{ label: t('loc:Pi'), value: DAY.FRIDAY },
		{ label: t('loc:So'), value: DAY.SATURDAY },
		{ label: t('loc:Ne'), value: DAY.SUNDAY }
	]

	const checkboxOptionRender = (option: any, checked?: boolean) => {
		return <div className={cx('w-5 h-5 flex-center bg-notino-grayLighter rounded', { 'bg-notino-pink': checked, 'text-notino-white': checked })}>{option?.label}</div>
	}

	// TODO: syncnut s BE
	const everyOptions = [
		{
			key: REPEAT_ON.DAY,
			label: t('loc:Deň')
		},
		{
			key: REPEAT_ON.WEEK,
			label: t('loc:Týždeň')
		},
		{
			key: REPEAT_ON.MONTH,
			label: t('loc:Mesiac')
		}
	]

	const endsOptions = [
		{
			key: ENDS_EVENT.WEEK,
			label: t('loc:Týždeň')
		},
		{
			key: ENDS_EVENT.MONTH,
			label: t('loc:Mesiac')
		},
		{
			key: ENDS_EVENT.THREE_MONTHS,
			label: t('loc:Tri mesiace')
		},
		{
			key: ENDS_EVENT.SIX_MONTHS,
			label: t('loc:Šesť mesiacov')
		},
		{
			key: ENDS_EVENT.YEAR,
			label: t('loc:Rok')
		}
	]

	const recurringFields = formValues?.recurring && (
		<>
			<Field
				className={'p-0 m-0'}
				component={CheckboxGroupField}
				name={'repeatOn'}
				label={t('loc:Opakovať ďalej')}
				options={options}
				size={'small'}
				horizontal
				hideChecker
				optionRender={checkboxOptionRender}
			/>
			{/* // TODO: momentalne sa nebude pouzivat ak pribudne tak odkopmentovat */}
			{/* <Field */}
			{/*	component={SelectField} */}
			{/*	label={t('loc:Každý')} */}
			{/*	placeholder={t('loc:Vyberte frekvenciu')} */}
			{/*	name={'every'} */}
			{/*	size={'large'} */}
			{/*	allowInfinityScroll */}
			{/*	showSearch */}
			{/*	required */}
			{/*	options={everyOptions} */}
			{/*	className={'pb-0'} */}
			{/*	labelInValue */}
			{/* /> */}

			<Field
				component={SelectField}
				label={t('loc:Koniec')}
				placeholder={t('loc:Vyberte koniec')}
				name={'end'}
				size={'large'}
				allowInfinityScroll
				options={endsOptions}
				className={'pb-0'}
			/>
		</>
	)

	const onChangeAllDay = (checked: any) => {
		if (checked) {
			// NOTE: cely den
			dispatch(change(FORM.CALENDAR_SHIFT_FORM, 'timeFrom', '00:00'))
			dispatch(change(FORM.CALENDAR_SHIFT_FORM, 'timeTo', '23:59'))
		} else {
			// Ak nie je cely den tak zaokruhlit na najblizsiu 1/4 hodinu
			dispatch(
				change(FORM.CALENDAR_SHIFT_FORM, 'timeFrom', roundMinutes(Number(dayjs().format(DEFAULT_TIME_FORMAT_MINUTES)), Number(dayjs().format(DEFAULT_TIME_FORMAT_HOURS))))
			)
			dispatch(change(FORM.CALENDAR_SHIFT_FORM, 'timeTo', null))
		}
	}

	const onChangeRecurring = (checked: any) => {
		if (checked) {
			dispatch(change(FORM.CALENDAR_SHIFT_FORM, 'end', ENDS_EVENT.WEEK))
		}
	}

	return (
		<>
			<div className={'nc-sider-event-management-header justify-between'}>
				<div className={'font-semibold'}>{t('loc:Nová zmena')}</div>
				<Button className='button-transparent' onClick={() => setCollapsed(CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW.COLLAPSED)}>
					<CloseIcon />
				</Button>
			</div>
			<div className={'nc-sider-event-management-content main-panel'}>
				<Form layout='vertical' className='w-full h-full flex flex-col gap-4' onSubmitCapture={handleSubmit}>
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
						disabled={!!formValues?.allDay} // NOTE: ak je cely den tak sa disable stav pre pre nastavenie casu
						allowClear
						itemClassName={'m-0 pb-0'}
						minuteStep={15}
					/>
					<Field name={'allDay'} onChange={onChangeAllDay} className={'pb-0'} label={t('loc:Celý deň')} component={SwitchField} />
					<Field name={'recurring'} onChange={onChangeRecurring} label={t('loc:Opakovať')} className={'pb-0'} component={SwitchField} />
					{recurringFields}
				</Form>
			</div>
			<div className={'nc-sider-event-management-footer'}>
				<Button onClick={() => dispatch(submit(FORM.CALENDAR_SHIFT_FORM))} htmlType={'submit'} type={'primary'} block className={'noti-btn self-end'}>
					{STRINGS(t).createRecord(t('loc:zmenu'))}
				</Button>
			</div>
		</>
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
