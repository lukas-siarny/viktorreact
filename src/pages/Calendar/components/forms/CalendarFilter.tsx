import React, { useMemo } from 'react'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { Button, Collapse, Form, Spin } from 'antd'
import { useTranslation } from 'react-i18next'
import { debounce } from 'lodash'
import { useSelector } from 'react-redux'
import cx from 'classnames'

// reducers
import { RootState } from '../../../../reducers'

// assets
import { ReactComponent as ChevronDownIcon } from '../../../../assets/icons/chevron-down.svg'
import { ReactComponent as ServicesIcon } from '../../../../assets/icons/services-24-icon.svg'

// utils
import { CALENDAR_EVENT_TYPE_FILTER, FORM } from '../../../../utils/enums'
import { history } from '../../../../utils/history'

// atoms
import RadioGroupField from '../../../../atoms/RadioGroupField'
import CheckboxGroupField from '../../../../atoms/CheckboxGroupField'

// types
import { ICalendarFilter } from '../../../../types/interfaces'

type ComponentProps = {
	parentPath: string
	eventType: CALENDAR_EVENT_TYPE_FILTER
	firstLoadDone: boolean
}

type Props = InjectedFormProps<ICalendarFilter, ComponentProps> & ComponentProps

const { Panel } = Collapse

enum PANEL_KEY {
	EVENT_TYPE = 'EVENT_TYPE',
	EMPLOYEES = 'EMPLOYEES',
	CATEGORIES = 'CATEGORIES'
}

const checkboxOptionRender = (option: any, checked?: boolean) => {
	const { color, value } = option || {}

	return (
		<div className={cx('nc-checkbox-group-checkbox', { checked })}>
			<input type='checkbox' className='checkbox-input' value={value} />
			<div className={'checker'} style={{ borderColor: color, backgroundColor: checked ? color : undefined }}>
				<span className={'checkbox-focus'} style={{ boxShadow: `0px 0px 4px 2px ${color || '#000'}`, border: `1px solid ${color}` }} />
			</div>
			{option?.label}
		</div>
	)
}

const CalendarFilter = (props: Props) => {
	const { handleSubmit, parentPath, eventType, firstLoadDone } = props
	const [t] = useTranslation()

	const services = useSelector((state: RootState) => state.service.services)
	const employees = useSelector((state: RootState) => state.employees.employees)

	const eventTypeOptions = useMemo(
		() => [
			{
				key: CALENDAR_EVENT_TYPE_FILTER.RESERVATION,
				value: CALENDAR_EVENT_TYPE_FILTER.RESERVATION,
				label: t('loc:Rezervácia')
			},
			{
				key: CALENDAR_EVENT_TYPE_FILTER.EMPLOYEE_SHIFT_TIME_OFF,
				value: CALENDAR_EVENT_TYPE_FILTER.EMPLOYEE_SHIFT_TIME_OFF,
				label: t('loc:Zmena / absencia')
			}
		],
		[t]
	)

	const defaultActiveKeys = useMemo(
		() =>
			eventType === CALENDAR_EVENT_TYPE_FILTER.EMPLOYEE_SHIFT_TIME_OFF
				? [PANEL_KEY.EVENT_TYPE, PANEL_KEY.EMPLOYEES]
				: [PANEL_KEY.EVENT_TYPE, PANEL_KEY.EMPLOYEES, PANEL_KEY.CATEGORIES],
		[eventType]
	)

	return (
		<Form layout='horizontal' onSubmitCapture={handleSubmit} className={'p-4'}>
			<Collapse
				className={'nc-collapse'}
				bordered={false}
				defaultActiveKey={defaultActiveKeys}
				expandIconPosition={'end'}
				expandIcon={({ isActive }) => <ChevronDownIcon className={cx({ 'is-active': isActive })} />}
			>
				<Panel key={PANEL_KEY.EVENT_TYPE} header={t('loc:Typ udalosti')} className={'nc-collapse-panel'}>
					<Field
						className={'p-0 m-0 nc-radio-event-type'}
						component={RadioGroupField}
						name={'eventType'}
						options={eventTypeOptions}
						direction={'vertical'}
						size={'small'}
					/>
				</Panel>
				<Panel key={PANEL_KEY.EMPLOYEES} header={t('loc:Zamestnanci')} className={'nc-collapse-panel'}>
					<Spin spinning={employees?.isLoading && !firstLoadDone}>
						<Field
							className={'p-0 m-0'}
							component={CheckboxGroupField}
							name={'employeeIDs'}
							options={employees?.options}
							size={'small'}
							hideChecker
							optionRender={checkboxOptionRender}
						/>
					</Spin>
				</Panel>
				{eventType !== CALENDAR_EVENT_TYPE_FILTER.EMPLOYEE_SHIFT_TIME_OFF && (
					<Panel key={PANEL_KEY.CATEGORIES} header={t('loc:Služby')} className={'nc-collapse-panel'}>
						<Spin spinning={services?.isLoading && !firstLoadDone}>
							{services?.options?.length ? (
								<Field className={'p-0 m-0'} component={CheckboxGroupField} name={'categoryIDs'} options={services?.options} size={'small'} rounded />
							) : (
								<div className={'w-full flex flex-col justify-center items-center gap-2 text-center mt-4'}>
									<ServicesIcon />
									{t('loc:V salóne zatiaľ nemáte priradené žiadne služby')}
									<Button
										type={'primary'}
										htmlType={'button'}
										className={'noti-btn'}
										onClick={() => history.push(`${parentPath}${t('paths:industries-and-services')}`)}
									>
										{t('loc:Priradiť služby')}
									</Button>
								</div>
							)}
						</Spin>
					</Panel>
				)}
			</Collapse>
		</Form>
	)
}

const form = reduxForm({
	form: FORM.CALENDAR_FILTER,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	onChange: debounce((_values, _dispatch, { submit, anyTouched }) => {
		if (anyTouched) {
			submit()
		}
	}, 600),
	destroyOnUnmount: true
})(CalendarFilter)

export default form
