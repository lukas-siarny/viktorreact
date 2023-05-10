import React from 'react'
import { Field, getFormValues, InjectedFormProps, reduxForm } from 'redux-form'
import { Form } from 'antd'
import { useTranslation } from 'react-i18next'
import { debounce } from 'lodash'
import { useSelector } from 'react-redux'

// utils
import { CHANGE_DEBOUNCE_TIME, FORM } from '../../../utils/enums'
import { checkFiltersSizeWithoutSearch, optionRenderWithImage } from '../../../utils/helper'

// atoms
import SelectField from '../../../atoms/SelectField'

// components
import Filters from '../../../components/Filters'

// reducers
import { RootState } from '../../../reducers'
import { ReactComponent as CategoryIcon } from '../../../assets/icons/categories-24-icon.svg'

// types
import { IServicesFilter } from '../../../types/interfaces'

type ComponentProps = {
	createNewTemplate?: any
	total: number
}

type Props = InjectedFormProps<IServicesFilter, ComponentProps> & ComponentProps

const ServicesFilter = (props: Props) => {
	const { handleSubmit } = props
	const [t] = useTranslation()
	const formValues = useSelector((state: RootState) => getFormValues(FORM.SERVICES_FILTER)(state))
	const categories = useSelector((state: RootState) => state.categories.categories)

	return (
		<Form layout='horizontal' onSubmitCapture={handleSubmit} className={'pt-0'}>
			<Filters
				search={
					<Field
						className='m-0'
						component={SelectField}
						optionRender={(itemData: any) => optionRenderWithImage(itemData, <CategoryIcon />)}
						allowClear
						size={'large'}
						placeholder={t('loc:Odvetvie')}
						name='rootCategoryID'
						options={categories.enumerationsOptions}
						loading={categories.isLoading}
					/>
				}
				activeFilters={checkFiltersSizeWithoutSearch(formValues)}
			/>
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
	}, CHANGE_DEBOUNCE_TIME),
	destroyOnUnmount: true
})(ServicesFilter)

export default form
