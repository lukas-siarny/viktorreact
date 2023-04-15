import React from 'react'
import { Field, InjectedFormProps, getFormValues, reduxForm } from 'redux-form'
import { Form } from 'antd'
import { useTranslation } from 'react-i18next'
import { debounce } from 'lodash'
import { useSelector } from 'react-redux'

// utils
import { CHANGE_DEBOUNCE_TIME, FIELD_MODE, FORM } from '../../../utils/enums'
import { checkFiltersSizeWithoutSearch, validationString } from '../../../utils/helper'

// components
import InputField from '../../../atoms/InputField'
import Filters from '../../../components/Filters'

// types
import { ISmsUnitPricesFilter } from '../../../types/interfaces'
import { RootState } from '../../../reducers'

type ComponentProps = {}

type Props = InjectedFormProps<ISmsUnitPricesFilter, ComponentProps> & ComponentProps

const fixLength100 = validationString(100)

const SmsUnitPricesFilter = (props: Props) => {
	const { handleSubmit } = props
	const [t] = useTranslation()
	const formValues = useSelector((state: RootState) => getFormValues(FORM.SMS_UNIT_PRICES_FILTER)(state))

	return (
		<Form layout='horizontal' onSubmitCapture={handleSubmit} className={'pt-0 mb-4'}>
			<Filters
				search={
					<Field
						className={'h-10 p-0 m-0'}
						component={InputField}
						size={'large'}
						placeholder={t('loc:Hľadať podľa krajiny')}
						name='search'
						fieldMode={FIELD_MODE.FILTER}
						search
						validate={fixLength100}
					/>
				}
				activeFilters={checkFiltersSizeWithoutSearch(formValues)}
			/>
		</Form>
	)
}

const form = reduxForm({
	form: FORM.SMS_UNIT_PRICES_FILTER,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	onChange: debounce((_values, _dispatch, { submit, anyTouched }) => {
		if (anyTouched) {
			submit()
		}
	}, CHANGE_DEBOUNCE_TIME),
	destroyOnUnmount: true
})(SmsUnitPricesFilter)

export default form
