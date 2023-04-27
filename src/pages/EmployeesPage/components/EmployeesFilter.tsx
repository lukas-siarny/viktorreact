import React from 'react'
import { Field, getFormValues, InjectedFormProps, reduxForm } from 'redux-form'
import { Button, Col, Form, Row } from 'antd'
import { useTranslation } from 'react-i18next'
import { debounce } from 'lodash'
import { useSelector } from 'react-redux'
import { ReactComponent as PlusIcon } from '../../../assets/icons/plus-icon.svg'

// utils
import { ACCOUNT_STATE, CHANGE_DEBOUNCE_TIME, CREATE_EMPLOYEE_BUTTON_ID, FIELD_MODE, FORM, ROW_GUTTER_X_DEFAULT, VALIDATION_MAX_LENGTH } from '../../../utils/enums'
import { checkFiltersSizeWithoutSearch, validationString } from '../../../utils/helper'

// atoms
import InputField from '../../../atoms/InputField'

// components
import Filters from '../../../components/Filters'
import SelectField from '../../../atoms/SelectField'

// reducers
import { RootState } from '../../../reducers'

type ComponentProps = {
	createEmployee: Function
	hide?: boolean
}

export interface IEmployeesFilter {
	search: string
	accountState: ACCOUNT_STATE
	serviceID: string
}

type Props = InjectedFormProps<IEmployeesFilter, ComponentProps> & ComponentProps

const fixLength255 = validationString(VALIDATION_MAX_LENGTH.LENGTH_255)

const EmployeesFilter = (props: Props) => {
	const { handleSubmit, createEmployee, hide } = props
	const [t] = useTranslation()
	const servicesOptions = useSelector((state: RootState) => state.service.services.options)

	const formValues = useSelector((state: RootState) => getFormValues(FORM.EMPLOYEES_FILTER)(state))

	const accountStateOptions = [
		{ label: t('loc:Nespárované'), value: ACCOUNT_STATE.UNPAIRED, key: ACCOUNT_STATE.UNPAIRED },
		{ label: t('loc:Čakajúce'), value: ACCOUNT_STATE.PENDING, key: ACCOUNT_STATE.PENDING },
		{ label: t('loc:Spárované'), value: ACCOUNT_STATE.PAIRED, key: ACCOUNT_STATE.PAIRED }
	]

	const searchInput = (
		<Field
			className={'h-10 p-0 m-0'}
			component={InputField}
			size={'large'}
			placeholder={t('loc:Hľadať podľa meno, e-mail')}
			name='search'
			fieldMode={FIELD_MODE.FILTER}
			search
			validate={fixLength255}
		/>
	)

	const customContent = !hide && (
		<Button id={CREATE_EMPLOYEE_BUTTON_ID} onClick={() => createEmployee()} type='primary' htmlType='button' className={'noti-btn w-full'} icon={<PlusIcon />}>
			{t('loc:Pridať zamestnanca')}
		</Button>
	)

	return (
		<Form layout='horizontal' onSubmitCapture={handleSubmit} className={'pt-0'}>
			<Filters customContent={customContent} search={searchInput} activeFilters={checkFiltersSizeWithoutSearch(formValues)} form={FORM.EMPLOYEES_FILTER}>
				<Row gutter={ROW_GUTTER_X_DEFAULT}>
					{!hide && (
						<Col span={8}>
							<Field
								component={SelectField}
								name={'accountState'}
								placeholder={t('loc:Stav konta')}
								allowClear
								size={'large'}
								filterOptions
								onDidMountSearch
								options={accountStateOptions}
							/>
						</Col>
					)}
					<Col span={8}>
						<Field component={SelectField} name={'serviceID'} placeholder={t('loc:Služba')} allowClear size={'large'} onDidMountSearch options={servicesOptions} />
					</Col>
				</Row>
			</Filters>
		</Form>
	)
}

const form = reduxForm({
	form: FORM.EMPLOYEES_FILTER,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	onChange: debounce((_values, _dispatch, { submit, anyTouched }) => {
		if (anyTouched) {
			submit()
		}
	}, CHANGE_DEBOUNCE_TIME),
	destroyOnUnmount: true
})(EmployeesFilter)

export default form
