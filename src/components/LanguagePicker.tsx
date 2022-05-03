import React, { FC, useEffect } from 'react'
import { reduxForm, InjectedFormProps, Field, initialize } from 'redux-form'
import { Form } from 'antd'
import i18next from 'i18next'
import { useDispatch } from 'react-redux'

// // interfaces
import { ILanguagePickerForm } from '../types/interfaces'

// utils
import { FORM, LANGUAGE } from '../utils/enums'

// atoms
import SelectField from '../atoms/SelectField'

const options = Object.values(LANGUAGE).map((value) => ({ label: value, value }))

type ComponentProps = {
	className?: string
}

type Props = InjectedFormProps<ILanguagePickerForm, ComponentProps> & ComponentProps

const LanguagePicker: FC<Props> = (props) => {
	const { className } = props
	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(initialize(FORM.LANGUAGE_FORM, { language: i18next.language }))
	}, [dispatch])

	const handleLanguageChange = (value: any) => {
		i18next.changeLanguage(value)
	}

	return (
		<Form className={className} layout='vertical'>
			<Field className='m-0' component={SelectField} name='language' options={options} onChange={handleLanguageChange} />
		</Form>
	)
}

const form = reduxForm<any, ComponentProps>({
	form: FORM.LANGUAGE_FORM,
	forceUnregisterOnUnmount: false,
	touchOnChange: true,
	destroyOnUnmount: false
})(LanguagePicker)

export default form
