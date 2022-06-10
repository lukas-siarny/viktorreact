import React, { useCallback } from 'react'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { Button, Col, Form, Row } from 'antd'
import { useTranslation } from 'react-i18next'
import { debounce } from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import { ReactComponent as PlusIcon } from '../../../assets/icons/plus-icon.svg'

// utils
import { FIELD_MODE, FORM, ROW_GUTTER_X_DEFAULT } from '../../../utils/enums'
import { checkFiltersSizeWithoutSearch, validationString } from '../../../utils/helper'
import { searchSalonWrapper } from '../../../utils/filters'

// atoms
import InputField from '../../../atoms/InputField'
import SelectField from '../../../atoms/SelectField'

// components
import Filters from '../../../components/Filters'

// reducers
import { RootState } from '../../../reducers'

type ComponentProps = {
	createEmployee: Function
}

export interface IEmployeesFilter {
	search: string
}

type Props = InjectedFormProps<IEmployeesFilter, ComponentProps> & ComponentProps

const fixLength100 = validationString(100)

const EmployeesFilter = (props: Props) => {
	const { handleSubmit, createEmployee } = props
	const [t] = useTranslation()
	const dispatch = useDispatch()

	const form = useSelector((state: RootState) => state.form?.[FORM.ADMIN_USERS_FILTER])

	const onSearchSalons = useCallback(
		async (search: string, page: number) => {
			return searchSalonWrapper(dispatch, { search, page })
		},
		[dispatch]
	)

	const searchInput = (
		<Field
			className={'h-10 p-0 m-0'}
			component={InputField}
			size={'large'}
			placeholder={t('loc:Hľadať podľa meno, e-mail')}
			name='search'
			fieldMode={FIELD_MODE.FILTER}
			search
			validate={fixLength100}
		/>
	)

	const customContent = (
		<Button onClick={() => createEmployee()} type='primary' htmlType='button' className={'noti-btn w-full'} icon={<PlusIcon />}>
			{t('loc:Pridať zamestnanca')}
		</Button>
	)

	return (
		<Form layout='horizontal' onSubmitCapture={handleSubmit} className={'pt-0'}>
			<Filters customContent={customContent} search={searchInput} activeFilters={checkFiltersSizeWithoutSearch(form?.values)}>
				<Row gutter={ROW_GUTTER_X_DEFAULT}>
					<Col span={8}>
						<Field
							component={SelectField}
							name={'salonID'}
							placeholder={t('loc:Salón')}
							allowClear
							size={'middle'}
							onSearch={onSearchSalons}
							optionLabelProp={'label'}
							filterOption={true}
							showSearch
							allowInfinityScroll
						/>
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
	}, 300),
	destroyOnUnmount: true
})(EmployeesFilter)

export default form
