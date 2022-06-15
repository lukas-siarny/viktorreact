import React, { useCallback, useMemo } from 'react'
import { Field, InjectedFormProps, reduxForm, getFormValues } from 'redux-form'
import { Button, Col, Form, Row } from 'antd'
import { useTranslation } from 'react-i18next'
import { debounce } from 'lodash'
import { useDispatch, useSelector } from 'react-redux'

// assets
import { ReactComponent as PlusIcon } from '../../../assets/icons/plus-icon.svg'

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
	createCustomer: Function
	total: number
}

interface ICustomersFilter {
	search: string
	salonID: number
}

type Props = InjectedFormProps<ICustomersFilter, ComponentProps> & ComponentProps

const fixLength100 = validationString(100)

const CustomersFilter = (props: Props) => {
	const { handleSubmit, createCustomer, total } = props
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const formValues = useSelector((state: RootState) => getFormValues(FORM.CUSTOMERS_FILTER)(state))

	const searchSalon = useCallback(
		async (search: string, page: number) => {
			const { data, salonsOptions } = await dispatch(getSalons(page, undefined, undefined, search, undefined, undefined))
			return { pagination: data?.pagination, page: data?.pagination?.page, data: salonsOptions }
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
			placeholder={t('loc:Hľadať podľa meno, e-mail, tel. číslo')}
			name='search'
			fieldMode={FIELD_MODE.FILTER}
			search
			validate={fixLength100}
			disabled={isFilterDisabled}
		/>
	)

	const addCustomerBtn = (
		<Button onClick={() => createCustomer()} type='primary' htmlType='button' className={'noti-btn w-full'} icon={<PlusIcon />}>
			{t('loc:Pridať zákazníka')}
		</Button>
	)

	return (
		<Form layout='horizontal' onSubmitCapture={handleSubmit} className={'pt-0'}>
			<Filters search={searchInput} activeFilters={checkFiltersSizeWithoutSearch(formValues)} customContent={addCustomerBtn}>
				<Row gutter={ROW_GUTTER_X_DEFAULT}>
					<Col span={6}>
						<Field
							className='m-0'
							component={SelectField}
							allowClear
							placeholder={t('loc:Salón')}
							name='salonID'
							showSearch
							onSearch={searchSalon}
							filterOption={false}
							allowInfinityScroll
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
	form: FORM.CUSTOMERS_FILTER,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	onChange: debounce((_values, _dispatch, { submit, anyTouched }) => {
		if (anyTouched) {
			submit()
		}
	}, 300),
	destroyOnUnmount: true
})(CustomersFilter)

export default form
