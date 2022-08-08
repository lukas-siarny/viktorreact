import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Field, change } from 'redux-form'
import { Space } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { findIndex } from 'lodash'

// atoms
import SelectField from '../../../atoms/SelectField'

// reducers
import { RootState } from '../../../reducers'

// utils
import { FORM } from '../../../utils/enums'
import { getSelectOptionsFromData } from '../../../utils/helper'

const CategoryFields = () => {
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const form = useSelector((state: RootState) => state.form?.[FORM.SERVICE_FORM])
	const categories = useSelector((state: RootState) => state.categories.categories)
	const salonCategories = useSelector((state: RootState) => state.selectedSalon.selectedSalon?.data?.categories)

	const categoryRoot = form?.values?.categoryRoot
	const categoryFirstLevel = form?.values?.categoryFirstLevel

	const categoryRootOptions = useMemo(
		() =>
			getSelectOptionsFromData(
				categories.data,
				salonCategories?.map((category) => category.id)
			),
		[categories.data, salonCategories]
	)

	const categoryFirstLevelOptions = useMemo(() => {
		const currentValueIndex = findIndex(categoryRootOptions, { value: categoryRoot })
		const data = categoryRootOptions[currentValueIndex]?.children
		return getSelectOptionsFromData(data)
	}, [categoryRootOptions, categoryRoot])

	const categorySecondLevelOptions = useMemo(() => {
		const currentValueIndex = findIndex(categoryFirstLevelOptions, { value: categoryFirstLevel })
		const data = categoryFirstLevelOptions[currentValueIndex]?.children
		return getSelectOptionsFromData(data)
	}, [categoryFirstLevelOptions, categoryFirstLevel])

	return (
		<Space className='w-full mb-5' direction='vertical'>
			<Field
				className='m-1'
				label={t('loc:Odvetvie')}
				component={SelectField}
				allowClear
				placeholder={t('loc:Vyberte odvetvie')}
				name='categoryRoot'
				options={categoryRootOptions}
				onChange={() => {
					dispatch(change(FORM.SERVICE_FORM, 'categoryFirstLevel', null))
					dispatch(change(FORM.SERVICE_FORM, 'categorySecondLevel', null))
				}}
				size={'large'}
				required
			/>
			{categoryRoot && categoryFirstLevelOptions.length > 0 && (
				<Field
					className='m-1'
					component={SelectField}
					allowClear
					label={t('loc:Kategória služby')}
					placeholder={t('loc:Vyberte kategóriu služby')}
					name='categoryFirstLevel'
					options={categoryFirstLevelOptions}
					onChange={() => {
						dispatch(change(FORM.SERVICE_FORM, 'categorySecondLevel', null))
					}}
					size={'large'}
					required
				/>
			)}
			{categoryRoot && categoryFirstLevel && categorySecondLevelOptions.length > 0 && (
				<Field
					className='m-1'
					component={SelectField}
					allowClear
					label={t('loc:Služba')}
					placeholder={t('loc:Vyberte službu')}
					name='categorySecondLevel'
					options={categorySecondLevelOptions}
					size={'large'}
					required
				/>
			)}
		</Space>
	)
}

export default CategoryFields
