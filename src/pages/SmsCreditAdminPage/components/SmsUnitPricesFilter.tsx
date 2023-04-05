import React from 'react'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { Col, Form } from 'antd'
import { useTranslation } from 'react-i18next'
import { debounce } from 'lodash'

// utils
import { CHANGE_DEBOUNCE_TIME, FIELD_MODE, FORM } from '../../../utils/enums'
import { validationString } from '../../../utils/helper'

// atoms
import InputField from '../../../atoms/InputField'

// types
import { ISmsUnitPricesFilter } from '../../../types/interfaces'
import Filters from '../../../components/Filters'

type ComponentProps = {}

type Props = InjectedFormProps<ISmsUnitPricesFilter, ComponentProps> & ComponentProps

const fixLength100 = validationString(100)

const SmsUnitPricesFilter = (props: Props) => {
	const { handleSubmit } = props
	const [t] = useTranslation()

	return (
		<Form layout='horizontal' onSubmitCapture={handleSubmit} className={'pt-0 mb-4'}>
			<Filters
				search={
					<Field
						className={'h-10 p-0 m-0 w-full'}
						component={InputField}
						size={'large'}
						placeholder={t('loc:Hľadať podľa krajiny')}
						name='search'
						fieldMode={FIELD_MODE.FILTER}
						search
						validate={fixLength100}
					/>
				}
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
