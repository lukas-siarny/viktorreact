import React, { useCallback, useMemo } from 'react'
import { Field, getFormValues, InjectedFormProps, reduxForm } from 'redux-form'
import { Button, Col, Form, Row } from 'antd'
import { useTranslation } from 'react-i18next'
import { debounce } from 'lodash'
import { useDispatch, useSelector } from 'react-redux'

// utils
import { FIELD_MODE, FORM, ROW_GUTTER_X_DEFAULT } from '../../../utils/enums'
import { checkFiltersSizeWithoutSearch, validationString, checkFiltersSize } from '../../../utils/helper'
import { searchEmployeeWrapper, searchSalonWrapper } from '../../../utils/filters'

// atoms
import InputField from '../../../atoms/InputField'
import SelectField from '../../../atoms/SelectField'

// assets
import { ReactComponent as PlusIcon } from '../../../assets/icons/plus-icon.svg'

// components
import Filters from '../../../components/Filters'

// reducers
import { RootState } from '../../../reducers'

type ComponentProps = {
	createNewTemplate?: any
	total: number
	createService: () => void
}

interface IServicesFilter {
	search: string
	categoryID: number
	employeeID: number
	salonID: number
}

type Props = InjectedFormProps<IServicesFilter, ComponentProps> & ComponentProps

const fixLength100 = validationString(100)

// TODO remove after BE is finished
const CATEGORIES = [
	{ label: 'Kategória 1.2', value: 5, key: 5 },
	{ label: 'Kategória 1.1', value: 4, key: 4 }
]

// TODO remove after BE is finished
// const EMPLOYEES_OPTIONS = [
// 	{ label: 'Zamestnanec 1 Salón 1', value: 1, key: 1 },
// 	{ label: 'Zamestnanec 1 Salón 2', value: 2, key: 2 }
// ]

const ServicesFilter = (props: Props) => {
	const { handleSubmit, total, createService } = props
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const formValues = useSelector((state: RootState) => getFormValues(FORM.SERVICES_FILTER)(state))

	const searchSalon = useCallback(
		async (search: string, page: number) => {
			return searchSalonWrapper(dispatch, { page, search })
		},
		[dispatch]
	)

	const searchEmployee = useCallback(
		async (search: string, page: number) => {
			return searchEmployeeWrapper(dispatch, { page, search })
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
			placeholder={t('loc:Hľadať podľa názvu')}
			name='search'
			fieldMode={FIELD_MODE.FILTER}
			search
			validate={fixLength100}
			disabled={isFilterDisabled}
		/>
	)

	const customContent = (
		<Button onClick={createService} type='primary' htmlType='button' className={'noti-btn w-full'} icon={<PlusIcon />}>
			{t('loc:Pridať službu')}
		</Button>
	)

	return (
		<Form layout='horizontal' onSubmitCapture={handleSubmit} className={'pt-0'}>
			<Filters search={searchInput} activeFilters={checkFiltersSizeWithoutSearch(formValues)} customContent={customContent}>
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
							showSearch
							onSearch={searchEmployee}
							onDidMountSearch
							disabled={isFilterDisabled}
							allowInfinityScroll
							filterOption={false}
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
							allowInfinityScroll
							filterOption={false}
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
