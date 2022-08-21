import React from 'react'
import { Field, getFormValues, InjectedFormProps, reduxForm } from 'redux-form'
import { Button, Form } from 'antd'
import { useTranslation } from 'react-i18next'
import { debounce } from 'lodash'
import { useSelector } from 'react-redux'

// utils
import { FORM } from '../../../utils/enums'
import { checkFiltersSizeWithoutSearch, optionRenderWithImage } from '../../../utils/helper'

// atoms
import SelectField from '../../../atoms/SelectField'

// components
import Filters from '../../../components/Filters'

// reducers
import { RootState } from '../../../reducers'
import { ReactComponent as PlusIcon } from '../../../assets/icons/plus-icon.svg'
import { ReactComponent as CategoryIcon } from '../../../assets/icons/categories-24-icon.svg'

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
	const { handleSubmit, createService } = props
	const [t] = useTranslation()
	const formValues = useSelector((state: RootState) => getFormValues(FORM.SERVICES_FILTER)(state))
	const categories = useSelector((state: RootState) => state.categories.categories)

	const addCustomerBtn = (
		<Button onClick={() => createService()} type='primary' htmlType='button' className={'noti-btn w-full'} icon={<PlusIcon />}>
			{t('loc:Požiadať o novú službu')}
		</Button>
	)

	return (
		<Form layout='horizontal' onSubmitCapture={handleSubmit} className={'pt-0'}>
			<Filters
				search={
					<Field
						className='m-0'
						component={SelectField}
						optionRender={(itemData: any) => optionRenderWithImage(itemData, <CategoryIcon />)}
						allowClear
						placeholder={t('loc:Odvetvie')}
						name='rootCategoryID'
						options={categories.enumerationsOptions}
						loading={categories.isLoading}
					/>
				}
				activeFilters={checkFiltersSizeWithoutSearch(formValues)}
				customContent={addCustomerBtn}
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
	}, 300),
	destroyOnUnmount: true
})(ServicesFilter)

export default form
