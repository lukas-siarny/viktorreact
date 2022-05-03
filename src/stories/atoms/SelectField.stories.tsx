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
import { mock } from '../utils/helpers'

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

export const SelectWithFetch: ComponentStory<typeof InputField> = () => {
	const dispatch = useDispatch()

	React.useEffect(() => {
		dispatch(
			initialize(STORYBOOK_FORM, {
				salonID: 1
			})
		)
	}, [dispatch])

	const searchSalon = React.useCallback(async () => {
		const data = await mock(true, 300, CATEGORIES)
		return { data }
	}, [])

	return (
		<Form layout='vertical'>
			<Field component={SelectField} allowClear placeholder={'Salón'} name='salonID' onSearch={searchSalon} onDidMountSearch size={'large'} />
		</Form>
	)
}

const generatePaginationData = (page = 1) => {
	const pagination = { limit: 25, page, totalCount: 125, totalPages: 5 }
	const offset = (page - 1) * pagination.limit
	const data = Array.from({ length: pagination.limit }, (x, i) => ({ label: `Option ${offset + i}`, value: offset + i, key: offset + i }))
	return { data, pagination }
}

export const SelectWithFetchPagination: ComponentStory<typeof InputField> = () => {
	const dispatch = useDispatch()

	React.useEffect(() => {
		dispatch(
			initialize(STORYBOOK_FORM, {
				salonID: 1
			})
		)
	}, [dispatch])

	const searchSalon = React.useCallback(async (search: string, page: number) => {
		const { data, pagination }: any = await mock(true, 200, generatePaginationData(page))
		return { data, pagination }
	}, [])

	return (
		<Form layout='vertical'>
			<Field component={SelectField} allowClear placeholder={'Salón'} name='salonID' onSearch={searchSalon} onDidMountSearch size={'large'} allowInfinityScroll showSearch />
		</Form>
	)
}
