import React, { FC, useCallback } from 'react'
import { change, Field, Fields, getFormValues, InjectedFormProps, reduxForm, submit } from 'redux-form'
import { Button, Divider, Form } from 'antd'
import { map } from 'lodash'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import cx from 'classnames'

// validate
import validateShiftForm from './validateShiftForm'

// utils
import { formatLongQueryString, optionRenderWithAvatar, showErrorNotification } from '../../../../utils/helper'
import { CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW, ENDS_EVENT, ENDS_EVENT_OPTIONS, EVENT_TYPE_OPTIONS, FORM, SHORTCUT_DAYS_OPTIONS, STRINGS } from '../../../../utils/enums'
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
import CheckboxGroupField from '../../../../atoms/CheckboxGroupField'

// redux
import { RootState } from '../../../../reducers'

type ComponentProps = {
	salonID: string
	setCollapsed: (view: CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW) => void
	onChangeEventType: (type: any) => any
}

type Props = InjectedFormProps<ICalendarShiftForm, ComponentProps> & ComponentProps

const CalendarShiftForm: FC<Props> = (props) => {
	const { handleSubmit, setCollapsed, salonID, onChangeEventType } = props
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
				options={SHORTCUT_DAYS_OPTIONS()}
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
				options={ENDS_EVENT_OPTIONS()}
				className={'pb-0'}
			/>
		</>
	)

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
						label={t('loc:Typ eventu')}
						placeholder={t('loc:Vyberte typ')}
						name={'eventType'}
						options={EVENT_TYPE_OPTIONS()}
						size={'large'}
						className={'pb-0'}
						onChange={onChangeEventType}
						filterOption={false}
						allowInfinityScroll
					/>
					<Divider className={'mb-3 mt-3'} />
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
