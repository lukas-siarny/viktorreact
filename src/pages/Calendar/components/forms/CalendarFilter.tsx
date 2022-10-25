import React, { useMemo } from 'react'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { Collapse, Form } from 'antd'
import { useTranslation } from 'react-i18next'
import { debounce } from 'lodash'
import { useSelector } from 'react-redux'
import cx from 'classnames'

// reducers
import { RootState } from '../../../../reducers'

// assets
import { ReactComponent as ChevronDownIcon } from '../../../../assets/icons/chevron-down.svg'

// utils
import { CALENDAR_EVENT_TYPE_FILTER, FORM } from '../../../../utils/enums'

// atoms
import RadioGroupField from '../../../../atoms/RadioGroupField'
import CheckboxGroupField from '../../../../atoms/CheckboxGroupField'
import { ICalendarFilter } from '../../../../types/interfaces'

type ComponentProps = {}

type Props = InjectedFormProps<ICalendarFilter, ComponentProps> & ComponentProps

const { Panel } = Collapse

const CalendarFilter = (props: Props) => {
	const { handleSubmit } = props
	const [t] = useTranslation()

	// const form = useSelector((state: RootState) => state.form?.[FORM.CALENDAR_FILTER])

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
				label: t('loc:Smena / absencia')
			}
		],
		[t]
	)

	return (
		<Form layout='horizontal' onSubmitCapture={handleSubmit} className={'p-4'}>
			<Collapse
				className={'nc-filter-collapse mt-0'}
				bordered={false}
				defaultActiveKey={[1, 2, 3]}
				expandIconPosition={'end'}
				expandIcon={({ isActive }) => <ChevronDownIcon className={cx({ 'is-active': isActive })} />}
			>
				<Panel key={1} header={t('loc:Pohľad')} className={'nc-filter-panel'}>
					<Field
						className={'p-0 m-0 nc-radio-event-type'}
						component={RadioGroupField}
						name={'eventType'}
						options={eventTypeOptions}
						direction={'vertical'}
						size={'small'}
					/>
				</Panel>
				<Panel key={2} header={t('loc:Zamestnanci')} className={'nc-filter-panel'}>
					{/* TODO: Osetrit empty state */}
					<Field className={'p-0 m-0'} component={CheckboxGroupField} name={'employeeIDs'} options={employees?.options} size={'small'} />
				</Panel>
				<Panel key={3} header={t('loc:Služby')} className={'nc-filter-panel'}>
					{/* TODO: Osetrit empty state */}
					<Field className={'p-0 m-0'} component={CheckboxGroupField} name={'serviceIDs'} options={services?.options} size={'small'} />
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
	}, 300),
	destroyOnUnmount: true
})(CalendarFilter)

export default form
