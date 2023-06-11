import React, { useMemo } from 'react'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { Col, Form, Row } from 'antd'
import { useTranslation } from 'react-i18next'
import { debounce, filter, isArray, isEmpty, isNil, size } from 'lodash'

// components
import { useSelector } from 'react-redux'
import Filters from '../../../../components/Filters'

// reducers
import { RootState } from '../../../../reducers'

// assets
import { ReactComponent as GlobeIcon } from '../../../../assets/icons/globe-24.svg'
import { ReactComponent as CategoryIcon } from '../../../../assets/icons/categories-icon.svg'

// utils
import { CHANGE_DEBOUNCE_TIME, ENUMERATIONS_KEYS, FIELD_MODE, FORM, ROW_GUTTER_X_M, VALIDATION_MAX_LENGTH } from '../../../../utils/enums'
import { optionRenderWithImage, validationString } from '../../../../utils/helper'

// atoms
import InputField from '../../../../atoms/InputField'
import SelectField from '../../../../atoms/SelectField'

// schema
import { ISalonsPageURLQueryParams } from '../../../../schemas/queryParams'

type ComponentProps = {
	onImportSalons: () => void
	activeSalons?: boolean
}

export type ISalonsFilterDeleted = Pick<ISalonsPageURLQueryParams, 'search' | 'categoryFirstLevelIDs' | 'countryCode'>

type Props = InjectedFormProps<ISalonsFilterDeleted, ComponentProps> & ComponentProps

const fixLength255 = validationString(VALIDATION_MAX_LENGTH.LENGTH_255)

export const checkSalonFiltersSize = (formValues: any) =>
	size(
		filter(formValues, (value, key) => {
			if (typeof value === 'boolean') {
				return value
			}
			if (isArray(value) && isEmpty(value)) {
				return false
			}
			if (key === 'dateFromTo' && !value?.dateFrom && !value?.dateTo) {
				return false
			}
			return (!isNil(value) || !isEmpty(value)) && key !== 'search'
		})
	)

const SalonsFilterDeleted = (props: Props) => {
	const { handleSubmit } = props
	const [t] = useTranslation()

	const form = useSelector((state: RootState) => state.form?.[FORM.SALONS_FILTER_DELETED])
	const categories = useSelector((state: RootState) => state.categories.categories)
	const countries = useSelector((state: RootState) => state.enumerationsStore[ENUMERATIONS_KEYS.COUNTRIES])

	const searchInput = useMemo(
		() => (
			<Field
				className={'h-10 p-0 m-0'}
				component={InputField}
				size={'large'}
				placeholder={t('loc:Hľadať podľa názvu, adresy alebo ID')}
				name={'search'}
				fieldMode={FIELD_MODE.FILTER}
				search
				validate={fixLength255}
			/>
		),
		[t]
	)

	return (
		<Form layout='horizontal' onSubmitCapture={handleSubmit} className={'pt-0'}>
			<Filters search={searchInput} activeFilters={checkSalonFiltersSize(form?.values)} form={FORM.SALONS_FILTER_DELETED}>
				<Row gutter={ROW_GUTTER_X_M}>
					<Col span={8}>
						<Field
							component={SelectField}
							optionRender={(itemData: any) => optionRenderWithImage(itemData, <GlobeIcon />)}
							name={'countryCode'}
							placeholder={t('loc:Krajina')}
							allowClear
							size={'large'}
							filterOptions
							onDidMountSearch
							options={countries?.enumerationsOptions}
							loading={countries?.isLoading}
							disabled={countries?.isLoading}
						/>
					</Col>
					<Col span={8}>
						<Field
							component={SelectField}
							name={'categoryFirstLevelIDs'}
							mode={'multiple'}
							placeholder={t('loc:Odvetvie')}
							allowClear
							size={'large'}
							filterOptions
							onDidMountSearch
							optionRender={(itemData: any) => optionRenderWithImage(itemData, <CategoryIcon />)}
							options={categories?.enumerationsOptions}
							loading={categories?.isLoading}
							disabled={categories?.isLoading}
						/>
					</Col>
				</Row>
			</Filters>
		</Form>
	)
}

const form = reduxForm({
	form: FORM.SALONS_FILTER_DELETED,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	onChange: debounce((_values, _dispatch, { submit, anyTouched }) => {
		if (anyTouched) {
			submit()
		}
	}, CHANGE_DEBOUNCE_TIME),
	destroyOnUnmount: true
})(SalonsFilterDeleted)

export default form
