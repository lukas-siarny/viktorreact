/* eslint-disable import/no-extraneous-dependencies */
import React from 'react'
import { withDesign } from 'storybook-addon-designs'
import { initialize, Field } from 'redux-form'
import { useDispatch } from 'react-redux'
import { Form } from 'antd'
import { ComponentStory } from '@storybook/react'
import InputField from '../../atoms/InputField'
import SelectField from '../../atoms/SelectField'
import withReduxForm, { STORYBOOK_FORM } from '../utils/withReduxForm'

const CATEGORIES = [
	{ label: 'Kategória 1', value: 1, key: 1 },
	{ label: 'Kategória 2', value: 2, key: 2 },
	{ label: 'Kategória 3', value: 3, key: 3 }
]

export default {
	title: 'Fields/Select',
	decorators: [withDesign, withReduxForm]
}

export const SimpleSelect: ComponentStory<typeof InputField> = () => {
	const dispatch = useDispatch()

	React.useEffect(() => {
		dispatch(
			initialize(STORYBOOK_FORM, {
				categoryID: CATEGORIES[1].value
			})
		)
	}, [dispatch])

	return (
		<Form layout='vertical'>
			<Field component={SelectField} allowClear placeholder={'Kategória'} name='categoryID' options={CATEGORIES} size={'large'} />
		</Form>
	)
}

// export const SelectWithFetch: ComponentStory<typeof InputField> = () => {
// 	const dispatch = useDispatch()

// 	React.useEffect(() => {
// 		dispatch(
// 			initialize(STORYBOOK_FORM, {
// 				categoryID: CATEGORIES[1].value
// 			})
// 		)
// 	}, [dispatch])

// 	const searchSalon = React.useCallback(
// 		async (search: string, page: number) => {
// 			return { data: CATEGORIES }
// 			// const { data, salonsOptions } = await dispatch(getSalons(page, undefined, undefined, search, undefined, undefined))
// 			// return { pagination: data?.pagination?.page, data: salonsOptions }
// 		},
// 		[dispatch]
// 	)

// 	return (
// 		<Form layout='vertical'>
// 			<Field className='m-0' component={SelectField} allowClear placeholder={'Salón'} name='salonID' showSearch onSearch={searchSalon} onDidMountSearch size={'large'} />
// 		</Form>
// 	)
// }
