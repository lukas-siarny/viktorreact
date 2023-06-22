import React, { useMemo } from 'react'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { Col, Form, Row } from 'antd'
import { useTranslation } from 'react-i18next'
import { debounce, filter, flatten, isArray, isEmpty, isNil, map, size } from 'lodash'

// components
import { useSelector } from 'react-redux'
import Filters from '../../../../components/Filters'

// reducers
import { RootState } from '../../../../reducers'

// assets
import { ReactComponent as GlobeIcon } from '../../../../assets/icons/globe-icon.svg'
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

	const categoryThirdLevelIDsOptions = useMemo(
		() =>
			flatten(
				map(categories.data, (industry) =>
					map(industry.children, (category) => {
						return {
							label: category.name,
							key: category.id,
							children: map(category.children, (item) => {
								return {
									value: item.id,
									label: item.name,
									key: item.id,
									extra: {
										image: industry.image?.resizedImages.thumbnail || industry.image?.original
									}
								}
							})
						}
					})
				)
			),
		[categories.data]
	)

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
					<Col span={4}>
						<Field
							component={SelectField}
							optionRender={(itemData: any) => optionRenderWithImage(itemData, <GlobeIcon />)}
							name={'countryCode'}
							placeholder={t('loc:Krajina')}
							allowClear
							size={'large'}
							options={countries?.enumerationsOptions}
							loading={countries?.isLoading}
							disabled={countries?.isLoading}
						/>
					</Col>
					<Col span={10}>
						<Field
							component={SelectField}
							placeholder={t('loc:Odvetvie')}
							name={'categoryFirstLevelIDs'}
							size={'large'}
							mode={'multiple'}
							showSearch
							loading={categories?.isLoading}
							disabled={categories?.isLoading}
							optionRender={(itemData: any) => optionRenderWithImage(itemData, <CategoryIcon />)}
							allowClear
							filterOption
							options={categories?.enumerationsOptions}
						/>
					</Col>
					<Col span={10}>
						<Field
							component={SelectField}
							placeholder={t('loc:Služby')}
							name={'categoryThirdLevelIDs'}
							mode={'multiple'}
							size={'large'}
							showSearch
							loading={categories?.isLoading}
							disabled={categories?.isLoading}
							allowClear
							filterOption
							options={categoryThirdLevelIDsOptions}
							optionRender={(itemData: any) => optionRenderWithImage(itemData, <CategoryIcon />)}
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
