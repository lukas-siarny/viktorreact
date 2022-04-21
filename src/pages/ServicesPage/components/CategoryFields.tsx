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

	const categoryRoot = form?.values?.categoryRoot
	const categoryFirstLevel = form?.values?.categoryFirstLevel

	const categoryRootOptions = useMemo(() => getSelectOptionsFromData(categories.data), [categories.data])

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
				label={t('loc:Kategória')}
				component={SelectField}
				allowClear
				placeholder={t('loc:Kategória')}
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
					placeholder={t('loc:Kategória')}
					name='categoryFirstLevel'
					options={categoryFirstLevelOptions}
					onChange={() => {
						dispatch(dispatch(change(FORM.SERVICE_FORM, 'categorySecondLevel', null)))
					}}
					size={'large'}
				/>
			)}
			{categoryRoot && categoryFirstLevel && categorySecondLevelOptions.length > 0 && (
				<Field
					className='m-1'
					component={SelectField}
					allowClear
					placeholder={t('loc:Kategória')}
					name='categorySecondLevel'
					options={categorySecondLevelOptions}
					size={'large'}
				/>
			)}
		</Space>
	)
}

export default CategoryFields
