import React, { FC } from 'react'
import { change, Field, Fields, getFormValues, InjectedFormProps, reduxForm, submit } from 'redux-form'
import { Button, Form, Spin } from 'antd'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import cx from 'classnames'
import dayjs from 'dayjs'

// validate
import validateBreakForm from './validateBreakForm'

// utils
import { optionRenderWithAvatar, showErrorNotification } from '../../../../utils/helper'
import { ENDS_EVENT, ENDS_EVENT_OPTIONS, EVERY_REPEAT, EVERY_REPEAT_OPTIONS, FORM, getDayNameFromNumber, SHORTCUT_DAYS_OPTIONS, STRINGS } from '../../../../utils/enums'

// types
import { ICalendarEventForm } from '../../../../types/interfaces'

// assets
import { ReactComponent as ProfileIcon } from '../../../../assets/icons/profile-icon.svg'

// components / atoms
import SelectField from '../../../../atoms/SelectField'
import DateField from '../../../../atoms/DateField'
import TimeRangeField from '../../../../atoms/TimeRangeField'
import SwitchField from '../../../../atoms/SwitchField'
import TextareaField from '../../../../atoms/TextareaField'
import CheckboxGroupField from '../../../../atoms/CheckboxGroupField'

// redux
import { RootState } from '../../../../reducers'

type ComponentProps = {
	eventId?: string | null
	searchEmployes: (search: string, page: number) => Promise<any>
}

type Props = InjectedFormProps<ICalendarEventForm, ComponentProps> & ComponentProps
const formName = FORM.CALENDAR_EMPLOYEE_BREAK_FORM

const CalendarBreakForm: FC<Props> = (props) => {
	const { handleSubmit, eventId, searchEmployes, pristine } = props
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
			const repeatDay = getDayNameFromNumber(dayjs(formValues?.date).day()) // NOTE: .day() vrati cislo od 0 do 6 co predstavuje nedela az sobota
			dispatch(change(formName, 'every', EVERY_REPEAT.ONE_WEEK))
			dispatch(change(formName, 'end', ENDS_EVENT.WEEK))
			dispatch(change(formName, 'repeatOn', repeatDay))
		}
	}

	return (
		<>
			<div className={'nc-sider-event-management-content main-panel'}>
				<Spin spinning={eventDetail.isLoading} size='large'>
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
							disabled={eventId} // NOTE: ak je detail tak sa neda menit zamestnanec
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
							className={'pb-0'}
							component={SwitchField}
							label={t('loc:Opakovať')}
						/>
						{recurringFields}
						<Field name={'note'} label={t('loc:Poznámka')} className={'pb-0'} component={TextareaField} />
					</Form>
				</Spin>
			</div>
			<div className={'nc-sider-event-management-footer'}>
				<Button onClick={() => dispatch(submit(formName))} htmlType={'submit'} type={'primary'} block className={'noti-btn self-end'}>
					{eventId ? STRINGS(t).edit(t('loc:prestávku')) : STRINGS(t).createRecord(t('loc:prestávku'))}
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
	validate: validateBreakForm
})(CalendarBreakForm)

export default form
