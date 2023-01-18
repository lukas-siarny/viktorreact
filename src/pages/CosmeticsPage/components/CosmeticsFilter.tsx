import React, { useMemo } from 'react'
import { Field, InjectedFormProps, reduxForm, getFormValues } from 'redux-form'
import { Form } from 'antd'
import { useTranslation } from 'react-i18next'
import { debounce } from 'lodash'
import { useSelector } from 'react-redux'

// utils
import { CHANGE_DEBOUNCE_TIME, FIELD_MODE, FORM } from '../../../utils/enums'
import { checkFiltersSizeWithoutSearch, validationString, checkFiltersSize } from '../../../utils/helper'

// atoms
import InputField from '../../../atoms/InputField'

// components
import Filters from '../../../components/Filters'

// reducers
import { RootState } from '../../../reducers'

type ComponentProps = {
	total: number
	addButton: React.ReactNode
}

interface ICosmeticsFilter {
	search: string
}

type Props = InjectedFormProps<ICosmeticsFilter, ComponentProps> & ComponentProps

const fixLength100 = validationString(100)

const CosmeticsFilter = (props: Props) => {
	const { handleSubmit, total, addButton } = props
	const [t] = useTranslation()
	const formValues = useSelector((state: RootState) => getFormValues(FORM.COSMETICS_FILTER)(state))

	// disable filter fields if count of cosmetics is less than 2
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

	return (
		<Form layout='horizontal' onSubmitCapture={handleSubmit} className={'pt-0'}>
			<Filters search={searchInput} activeFilters={checkFiltersSizeWithoutSearch(formValues)} customContent={addButton} />
		</Form>
	)
}

const form = reduxForm({
	form: FORM.COSMETICS_FILTER,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	onChange: debounce((_values, _dispatch, { submit, anyTouched }) => {
		if (anyTouched) {
			submit()
		}
	}, CHANGE_DEBOUNCE_TIME),
	destroyOnUnmount: true
})(CosmeticsFilter)

export default form
