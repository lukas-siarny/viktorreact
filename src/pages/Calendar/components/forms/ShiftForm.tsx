import React, { FC, useCallback } from 'react'
import { Field, Fields, getFormValues, InjectedFormProps, reduxForm, submit } from 'redux-form'
import { Button, Form } from 'antd'
import { map } from 'lodash'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

// validate
import cx from 'classnames'
import validateShiftForm from './validateShiftForm'

// utils
import { formatLongQueryString, optionRenderWithAvatar, showErrorNotification } from '../../../../utils/helper'
import { CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW, DAY, FORM, STRINGS } from '../../../../utils/enums'
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
		{ label: t('loc:Pondelok'), value: DAY.MONDAY },
		{ label: t('loc:Utorok'), value: DAY.TUESDAY },
		{ label: t('loc:Streda'), value: DAY.WEDNESDAY },
		{ label: t('loc:Štvrtok'), value: DAY.THURSDAY },
		{ label: t('loc:Piatok'), value: DAY.FRIDAY },
		{ label: t('loc:Sobota'), value: DAY.SATURDAY },
		{ label: t('loc:Nedeľa'), value: DAY.SUNDAY }
	]

	const checkboxOptionRender = (option: any, checked?: boolean) => {
		const { color, value } = option || {}

		return (
			<div className={cx('nc-checkbox-group-checkbox flex', { checked })}>
				<input type='checkbox' className='checkbox-input' value={value} checked={checked} />
				<div className={'checker'} style={{ borderColor: color, backgroundColor: checked ? color : undefined }}>
					<span className={'checkbox-focus'} style={{ boxShadow: `0px 0px 4px 2px ${color || '#000'}`, border: `1px solid ${color}` }} />
				</div>
				{option?.label}
			</div>
		)
	}
	const recurringFields = formValues?.recurring && (
		<>
			<Field
				className={'p-0 m-0'}
				component={CheckboxGroupField}
				name={'repeatOn'}
				label={t('loc:Opakovať ďalej')}
				options={options}
				size={'small'}
				hideChecker
				horizontal
				optionRender={checkboxOptionRender}
			/>

			<Field
				component={SelectField}
				label={t('loc:Každý')}
				placeholder={t('loc:Vyberte frekvenciu')}
				name={'every'}
				size={'large'}
				allowInfinityScroll
				showSearch
				required
				optins={[]} // TODO: syncnut s BE
				className={'pb-0'}
				labelInValue
			/>

			<Field
				component={SelectField}
				label={t('loc:Koniec')}
				placeholder={t('loc:Vyberte koniec')}
				name={'end'}
				size={'large'}
				allowInfinityScroll
				showSearch
				required
				optins={[]} // TODO: syncnut s BE
				className={'pb-0'}
				labelInValue
			/>
		</>
	)
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
						allowClear
						itemClassName={'m-0 pb-0'}
						minuteStep={15}
					/>
					<Field name={'recurring'} label={t('loc:Opakovať')} component={SwitchField} />
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
