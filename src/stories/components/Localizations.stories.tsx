/* eslint-disable import/no-extraneous-dependencies */
import React from 'react'
import { withDesign } from 'storybook-addon-designs'
import { Field, FieldArray, initialize } from 'redux-form'
import { useDispatch } from 'react-redux'
import { Form, Divider } from 'antd'
import { ComponentStory } from '@storybook/react'
import InputField from '../../atoms/InputField'
import Localizations from '../../components/Localizations'
import withReduxForm, { STORYBOOK_FORM } from '../utils/withReduxForm'

export default {
	title: 'Fields/Localization',
	decorators: [withDesign, withReduxForm]
}

export const SeparateMainField: ComponentStory<typeof InputField> = () => {
	const dispatch = useDispatch()

	React.useEffect(() => {
		dispatch(
			initialize(STORYBOOK_FORM, {
				nameLocalizations: [{ language: 'en', value: 'example en' }, { language: 'cz' }],
				name: 'example sk'
			})
		)
	}, [dispatch])

	return (
		<Form layout='vertical'>
			<p>
				mainField (the first one) is <span className='text-red-700'>not</span> part of the nameLocalizations FieldArray. The language count will show only nameLocalizations
				array count (e.g. 1/2){' '}
			</p>
			<pre>
				{`{
	nameLocalizations: [{ language: 'en', value: 'example en' }, { language: 'cz' }],
	name: 'example sk'
}`}
			</pre>

			<Divider />
			<FieldArray
				className={'mb-6'}
				key='nameLocalizations'
				name='nameLocalizations'
				component={Localizations}
				placeholder={'Zadajte názov'}
				horizontal
				mainField={<Field className='mb-0' component={InputField} label={'Názov kategórie (sk)'} placeholder={'Zadajte názov'} key='name' name='name' />}
			/>
		</Form>
	)
}

export const IncludedMainField: ComponentStory<typeof InputField> = () => {
	const dispatch = useDispatch()

	React.useEffect(() => {
		dispatch(
			initialize(STORYBOOK_FORM, {
				nameLocalizations: [{ language: 'sk', value: 'example sk' }, { language: 'en' }, { language: 'cz', value: 'example cz' }]
			})
		)
	}, [dispatch])

	return (
		<Form layout='vertical'>
			<p>mainField is part of the FieldArray. The language count is counting all fields </p>
			<pre>
				{`{
	nameLocalizations: [{ language: 'sk', value: 'example sk' }, { language: 'en' }, { language: 'cz', value: 'example cz' }]
}`}
			</pre>

			<Divider />

			<FieldArray
				className={'mb-6'}
				key='nameLocalizations'
				name='nameLocalizations'
				component={Localizations}
				placeholder={'Zadajte názov'}
				horizontal
				ignoreFieldIndex={0} // do not render "0" field because it is rendered in the mainField prop
				mainField={
					<Field
						className='mb-0'
						component={InputField}
						label={'Názov kategórie (sk)'}
						placeholder={'Zadajte názov'}
						key='nameLocalizations[0].value'
						name='nameLocalizations[0].value'
					/>
				}
			/>
		</Form>
	)
}
