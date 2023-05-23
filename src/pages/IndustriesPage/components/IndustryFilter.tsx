import React from 'react'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { Form } from 'antd'
import { useTranslation } from 'react-i18next'
import { debounce } from 'lodash'

// utils
import { CHANGE_DEBOUNCE_TIME, FIELD_MODE, FORM, VALIDATION_MAX_LENGTH } from '../../../utils/enums'
import { validationString } from '../../../utils/helper'

// atoms
import InputField from '../../../atoms/InputField'

// types
import { IIndustryPageURLQueryParams } from '../../../schemas/queryParams'

type ComponentProps = {}

type Props = InjectedFormProps<IIndustryPageURLQueryParams, ComponentProps> & ComponentProps

const fixLength255 = validationString(VALIDATION_MAX_LENGTH.LENGTH_255)

const IndustryFilter = (props: Props) => {
	const { handleSubmit } = props
	const [t] = useTranslation()

	return (
		<Form layout='horizontal' onSubmitCapture={handleSubmit} className={'pt-0'}>
			<Field
				className={'h-10 p-0 m-0 w-full'}
				component={InputField}
				size={'large'}
				placeholder={t('loc:Hľadať podľa názvu služby')}
				name='search'
				fieldMode={FIELD_MODE.FILTER}
				search
				validate={fixLength255}
			/>
		</Form>
	)
}

const form = reduxForm({
	form: FORM.INDUSTRY_FILTER,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	onChange: debounce((_values, _dispatch, { submit, anyTouched }) => {
		if (anyTouched) {
			submit()
		}
	}, CHANGE_DEBOUNCE_TIME),
	destroyOnUnmount: true
})(IndustryFilter)

export default form
