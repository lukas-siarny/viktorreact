import React, { useCallback, useMemo } from 'react'
import { Field, getFormValues, InjectedFormProps, reduxForm } from 'redux-form'
import { Col, Form, Row } from 'antd'
import { useTranslation } from 'react-i18next'
import { debounce } from 'lodash'
import { useDispatch, useSelector } from 'react-redux'

// utils
import { FIELD_MODE, FORM, ROW_GUTTER_X_DEFAULT } from '../../../utils/enums'
import { checkFiltersSizeWithoutSearch, validationString, checkFiltersSize } from '../../../utils/helper'

// atoms
import InputField from '../../../atoms/InputField'
import SelectField from '../../../atoms/SelectField'

// components
import Filters from '../../../components/Filters'

// reducers
import { getSalons } from '../../../reducers/salons/salonsActions'
import { RootState } from '../../../reducers'

type ComponentProps = {
	createNewTemplate?: any
	total: number
}

interface IServicesFilter {
	search: string
	categoryID: number
	employeeID: number
	salonID: number
}

type Props = InjectedFormProps<IServicesFilter, ComponentProps> & ComponentProps

const fixLength100 = validationString(100)

const CATEGORIES = [
	{ label: 'Kategória 1.2', value: 5, key: 5 },
	{ label: 'Kategória 1.1', value: 4, key: 4 }
]

const EMPLOYEES_OPTIONS = [
	{ label: 'Zamestnanec 1 Salón 1', value: 1, key: 1 },
	{ label: 'Zamestnanec 1 Salón 2', value: 2, key: 2 }
]

const ServicesFilter = (props: Props) => {
	const { handleSubmit, total } = props
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const formValues = useSelector((state: RootState) => getFormValues(FORM.SERVICES_FILTER)(state))

	const searchSalon = useCallback(
		async (search: string, page: number) => {
			const { data, salonsOptions } = await dispatch(getSalons(page, undefined, undefined, search, undefined, undefined))
			return { pagination: data?.pagination?.page, data: salonsOptions }
		},
		[dispatch]
	)

	// disable filter fields if the number of services is less than 2
	const isFilterDisabled = useMemo(() => {
		if (checkFiltersSize(formValues) > 0) return false
		if (total > 1) return false
		return true
	}, [formValues, total])

	const searchInput = (
		<Field
			className={'h-10 p-0 m-0'}
			component={InputField}
			size={'large'}
			placeholder={t('loc:Vyhľadajte podľa názvu')}
			name='search'
			fieldMode={FIELD_MODE.FILTER}
			search
			validate={fixLength100}
			disabled={isFilterDisabled}
		/>
	)
	return (
		<Form layout='horizontal' onSubmitCapture={handleSubmit} className={'pt-0'}>
			<Filters search={searchInput} activeFilters={checkFiltersSizeWithoutSearch(formValues)}>
				<Row gutter={ROW_GUTTER_X_DEFAULT}>
					<Col span={6}>
						<Field
							className='m-0'
							component={SelectField}
							allowClear
							placeholder={t('loc:Kategória')}
							name='categoryID'
							options={CATEGORIES}
							disabled={isFilterDisabled}
						/>
					</Col>
					<Col span={6}>
						<Field
							className='m-0'
							component={SelectField}
							allowClear
							placeholder={t('loc:Zamestnanec')}
							name='employeeID'
							options={EMPLOYEES_OPTIONS}
							disabled={isFilterDisabled}
						/>
					</Col>
					<Col span={6}>
						<Field
							className='m-0'
							component={SelectField}
							allowClear
							placeholder={t('loc:Salón')}
							name='salonID'
							showSearch
							onSearch={searchSalon}
							onDidMountSearch
							disabled={isFilterDisabled}
						/>
					</Col>
				</Row>
			</Filters>
		</Form>
	)
}

const form = reduxForm({
	form: FORM.SERVICES_FILTER,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	onChange: debounce((_values, _dispatch, { submit, anyTouched }) => {
		if (anyTouched) {
			submit()
		}
	}, 300),
	destroyOnUnmount: true
})(ServicesFilter)

export default form
