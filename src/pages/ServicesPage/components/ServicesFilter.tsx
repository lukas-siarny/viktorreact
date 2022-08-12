import React from 'react'
import { Field, getFormValues, InjectedFormProps, reduxForm } from 'redux-form'
import { Col, Form, Row } from 'antd'
import { useTranslation } from 'react-i18next'
import { debounce } from 'lodash'
import { useSelector } from 'react-redux'

// utils
import { FORM, ROW_GUTTER_X_DEFAULT } from '../../../utils/enums'
import { checkFiltersSizeWithoutSearch } from '../../../utils/helper'

// atoms
import SelectField from '../../../atoms/SelectField'

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
	rootCategoryID: String
	salonID: String
}

type Props = InjectedFormProps<IServicesFilter, ComponentProps> & ComponentProps

const ServicesFilter = (props: Props) => {
	const { handleSubmit } = props
	const [t] = useTranslation()
	const formValues = useSelector((state: RootState) => getFormValues(FORM.SERVICES_FILTER)(state))
	const categories = useSelector((state: RootState) => state.categories.categories)

	return (
		<Form layout='horizontal' onSubmitCapture={handleSubmit} className={'pt-0'}>
			<Filters search={<></>} activeFilters={checkFiltersSizeWithoutSearch(formValues)}>
				<Row gutter={ROW_GUTTER_X_DEFAULT}>
					<Col span={8}>
						<Field
							className='m-0'
							component={SelectField}
							allowClear
							placeholder={t('loc:Kategória')}
							name='rootCategoryID'
							options={categories.enumerationsOptions}
							loading={categories.isLoading}
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
