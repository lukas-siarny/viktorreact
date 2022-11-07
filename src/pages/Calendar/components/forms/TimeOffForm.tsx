import React, { FC, useCallback } from 'react'
import { Field, Fields, getFormValues, InjectedFormProps, reduxForm, submit } from 'redux-form'
import { Button, Form } from 'antd'

// validate
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { map } from 'lodash'
import validateTimeOffForm from './validateTimeOffForm'

// utils
import { formatLongQueryString, optionRenderWithAvatar, showErrorNotification } from '../../../../utils/helper'
import { CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW, FORM, STRINGS } from '../../../../utils/enums'
import { getReq } from '../../../../utils/request'

// types
import { ICalendarTimeOffForm } from '../../../../types/interfaces'

// assets
import { ReactComponent as CloseIcon } from '../../../../assets/icons/close-icon.svg'
import SelectField from '../../../../atoms/SelectField'
import { ReactComponent as ProfileIcon } from '../../../../assets/icons/profile-icon.svg'
import DateField from '../../../../atoms/DateField'

// atoms / components
import TimeRangeField from '../../../../atoms/TimeRangeField'
import SwitchField from '../../../../atoms/SwitchField'

// redux
import { RootState } from '../../../../reducers'

type ComponentProps = {
	setCollapsed: (view: CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW) => void
	salonID: string
}

type Props = InjectedFormProps<ICalendarTimeOffForm, ComponentProps> & ComponentProps

const CalendarTimeOffForm: FC<Props> = (props) => {
	const { handleSubmit, setCollapsed, salonID } = props
	const [t] = useTranslation()
	const dispatch = useDispatch()

	const formValues: any = useSelector((state: RootState) => getFormValues(FORM.CALENDAR_TIME_OFF_FORM)(state))

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

	return (
		<>
			<div className={'nc-sider-event-management-header justify-between'}>
				<div className={'font-semibold'}>{t('loc:Nová absencia')}</div>
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
					<Field name={'recurring'} component={SwitchField} label={t('loc:Opakovať')} />
					{/* // TODO: opakovat v ... checkboxy? */}
					{formValues?.recurring && (
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
					)}
					{formValues?.recurring && (
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
					)}
				</Form>
			</div>
			<div className={'nc-sider-event-management-footer'}>
				<Button onClick={() => dispatch(submit(FORM.CALENDAR_TIME_OFF_FORM))} htmlType={'submit'} type={'primary'} block className={'noti-btn self-end'}>
					{STRINGS(t).createRecord(t('loc:dovolenku'))}
				</Button>
			</div>
		</>
	)
}

const form = reduxForm<ICalendarTimeOffForm, ComponentProps>({
	form: FORM.CALENDAR_TIME_OFF_FORM,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	destroyOnUnmount: true,
	onSubmitFail: showErrorNotification,
	validate: validateTimeOffForm
})(CalendarTimeOffForm)

export default form
