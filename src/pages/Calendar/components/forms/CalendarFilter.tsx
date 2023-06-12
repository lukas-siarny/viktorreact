import React, { FC } from 'react'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { Button, Collapse, Form, Spin } from 'antd'
import { useTranslation } from 'react-i18next'
import { debounce } from 'lodash'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import { useNavigate } from 'react-router-dom'

// reducers
import { RootState } from '../../../../reducers'

// assets
import { ReactComponent as ChevronDownIcon } from '../../../../assets/icons/chevron-down.svg'
import { ReactComponent as ServicesIcon } from '../../../../assets/icons/services-24-icon.svg'
import { ReactComponent as EmployeesIcon } from '../../../../assets/icons/employees.svg'

// utils
import { CALENDAR_DEBOUNCE_DELAY, CALENDAR_EVENTS_VIEW_TYPE, FORM, STRINGS } from '../../../../utils/enums'

// atoms
import CheckboxGroupField from '../../../../atoms/CheckboxGroupField'

// types
import { ICalendarEmployeesPayload, ICalendarFilter } from '../../../../types/interfaces'

type ComponentProps = {
	parentPath: string
	eventsViewType: CALENDAR_EVENTS_VIEW_TYPE
	loadingData?: boolean
	employeesOptions: ICalendarEmployeesPayload['options']
	employeesLoading?: boolean
}

type Props = InjectedFormProps<ICalendarFilter, ComponentProps> & ComponentProps

const { Panel } = Collapse

enum PANEL_KEY {
	EMPLOYEES = 'EMPLOYEES',
	CATEGORIES = 'CATEGORIES'
}

interface IFilterEmptyState {
	buttonLabel: string
	buttonOnClick: () => void
	buttonDissabled?: boolean
	icon: React.ReactNode
	infoMessage: string
}

const FilterEmptyState: FC<IFilterEmptyState> = (props) => {
	const { buttonLabel, buttonOnClick, icon, infoMessage, buttonDissabled } = props

	return (
		<div className={'w-full flex flex-col justify-center items-center gap-2 text-center mt-4'}>
			{icon}
			{infoMessage}
			<Button type={'primary'} htmlType={'button'} className={'noti-btn'} onClick={buttonOnClick} disabled={buttonDissabled}>
				{buttonLabel}
			</Button>
		</div>
	)
}

const CalendarFilter = (props: Props) => {
	const { handleSubmit, parentPath, eventsViewType, loadingData, employeesOptions, employeesLoading } = props
	const [t] = useTranslation()
	const navigate = useNavigate()

	const services = useSelector((state: RootState) => state.service.services)

	return (
		<Form layout='horizontal' onSubmitCapture={handleSubmit} className={'p-4'}>
			<Collapse
				className={'nc-collapse'}
				bordered={false}
				defaultActiveKey={[PANEL_KEY.EMPLOYEES, PANEL_KEY.CATEGORIES]}
				expandIconPosition={'end'}
				expandIcon={({ isActive }) => <ChevronDownIcon className={cx({ 'is-active': isActive })} />}
			>
				<Panel key={PANEL_KEY.EMPLOYEES} header={t('loc:Zamestnanci')} className={'nc-collapse-panel'}>
					<Spin spinning={employeesLoading}>
						{employeesOptions?.length ? (
							<Field
								className={'p-0 m-0'}
								component={CheckboxGroupField}
								name={'employeeIDs'}
								options={employeesOptions}
								size={'small'}
								rounded
								useCustomColor
								nullAsEmptyValue
								disabled={loadingData}
							/>
						) : (
							<FilterEmptyState
								icon={<EmployeesIcon />}
								infoMessage={t('loc:V salóne zatiaľ nemáte pridaných žiadnych zamestnancov')}
								buttonLabel={t('loc:Pridať zamestnancov')}
								buttonDissabled={loadingData}
								buttonOnClick={() => navigate(`${parentPath}${t('paths:employees')}`)}
							/>
						)}
					</Spin>
				</Panel>
				<Panel key={PANEL_KEY.CATEGORIES} header={t('loc:Služby')} className={'nc-collapse-panel'}>
					<Spin spinning={services?.isLoading}>
						{services?.categoriesOptions?.length ? (
							<Field
								className={'p-0 m-0'}
								component={CheckboxGroupField}
								name={'categoryIDs'}
								options={services?.categoriesOptions}
								size={'small'}
								rounded
								disabled={eventsViewType === CALENDAR_EVENTS_VIEW_TYPE.EMPLOYEE_SHIFT_TIME_OFF || loadingData}
								nullAsEmptyValue
							/>
						) : (
							<FilterEmptyState
								icon={<ServicesIcon />}
								infoMessage={t('loc:V salóne zatiaľ nemáte priradené žiadne služby')}
								buttonLabel={STRINGS(t).assign(t('loc:služby'))}
								buttonDissabled={loadingData}
								buttonOnClick={() => navigate(`${parentPath}${t('paths:industries-and-services')}`)}
							/>
						)}
					</Spin>
				</Panel>
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
	}, CALENDAR_DEBOUNCE_DELAY),
	destroyOnUnmount: true
})(CalendarFilter)

export default form
