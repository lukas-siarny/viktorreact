import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Field, Fields, InjectedFormProps, reduxForm, submit } from 'redux-form'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Form, Spin } from 'antd'

// utils
import { showErrorNotification } from '../../../../utils/helper'
import Permissions from '../../../../utils/Permissions'
import { FORM, CREATE_EVENT_PERMISSIONS, UPDATE_EVENT_PERMISSIONS } from '../../../../utils/enums'

// assets
import { ReactComponent as TimerIcon } from '../../../../assets/icons/clock-icon.svg'
import { ReactComponent as DateSuffixIcon } from '../../../../assets/icons/date-suffix-icon.svg'

// components
import DateField from '../../../../atoms/DateField'
import TextareaField from '../../../../atoms/TextareaField'
import TimeRangeField from '../../../../atoms/TimeRangeField'

// redux
import { RootState } from '../../../../reducers'

// schema
import { ICalendarImportedReservationForm, validationImportedReservationFn } from '../../../../schemas/reservation'

type ComponentProps = {
	eventId?: string | null
	loadingData?: boolean
}
const formName = FORM.CALENDAR_RESERVATION_FROM_IMPORT_FORM

type Props = InjectedFormProps<ICalendarImportedReservationForm, ComponentProps> & ComponentProps

const ImportedReservationForm: FC<Props> = (props) => {
	const { handleSubmit, eventId, pristine, submitting, loadingData } = props
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const eventDetail = useSelector((state: RootState) => state.calendar.eventDetail)

	const disabledSubmitButton = pristine || submitting || loadingData

	return (
		<>
			<div className={'nc-sider-event-management-content'} key={eventId}>
				<Spin spinning={eventDetail.isLoading} size='large'>
					<Form layout='vertical' className='w-full h-full flex flex-col gap-4' onSubmitCapture={handleSubmit}>
						<span className={'nc-tag tag-imported self-start'}>{t('loc:Importovaná rezervácia')}</span>
						<Field
							name={'date'}
							label={t('loc:Dátum')}
							className={'pb-0'}
							pickerClassName={'w-full'}
							component={DateField}
							showInReservationDrawer
							placement={'bottomRight'}
							dropdownAlign={{ points: ['tr', 'br'] }}
							size={'large'}
							suffixIcon={<DateSuffixIcon className={'text-notino-grayDark'} />}
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
							suffixIcon={<TimerIcon className={'text-notino-grayDark'} />}
							size={'large'}
						/>
						<Field name={'note'} label={t('loc:Poznámka')} className={'pb-0'} component={TextareaField} rows={10} />
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
							{eventId ? t('loc:Upraviť') : null}
						</Button>
					)}
				/>
			</div>
		</>
	)
}

const form = reduxForm<ICalendarImportedReservationForm, ComponentProps>({
	form: formName,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	destroyOnUnmount: true,
	onSubmitFail: showErrorNotification,
	validate: validationImportedReservationFn
})(ImportedReservationForm)

export default form
