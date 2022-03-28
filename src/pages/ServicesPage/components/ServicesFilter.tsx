import React from 'react'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { Button, Col, Form, Row } from 'antd'
import { useTranslation } from 'react-i18next'
import { debounce } from 'lodash'
import { ReactComponent as PlusIcon } from '../../../assets/icons/plus-icon.svg'

// utils
import { FIELD_MODE, FORM, ROW_GUTTER_X_DEFAULT } from '../../../utils/enums'
import { validationString } from '../../../utils/helper'

// atoms
import InputField from '../../../atoms/InputField'
import SelectField from '../../../atoms/SelectField'

type ComponentProps = {
	createNewTemplate?: any
}

interface IServicesFilter {
	search: string
	categoryID: number
	employeeID: number
	salonID: number
}

type Props = InjectedFormProps<IServicesFilter, ComponentProps> & ComponentProps

const fixLength100 = validationString(100)

const TEST = [
	{ label: 'test', value: 'a' },
	{ label: 'test2', value: 'ac' }
]

const CATEGORIES = [
	{ label: 'Kategória 1.2', value: 5 },
	{ label: 'Kategória 1.1', value: 4 }
]

const EMPLOYEES_OPTIONS = [
	{ label: 'Zamestnanec 1 Salón 1', value: 1 },
	{ label: 'Zamestnanec 1 Salón 2', value: 2 }
]

const ServicesFilter = (props: Props) => {
	const { handleSubmit } = props
	const [t] = useTranslation()

	return (
		<Form layout='horizontal' onSubmitCapture={handleSubmit} className={'pt-0'}>
			<Row className={'flex justify-between'} gutter={ROW_GUTTER_X_DEFAULT}>
				<Col span={6}>
					<Field
						className={'h-10 p-0 m-0'}
						component={InputField}
						size={'large'}
						placeholder={t('loc:Vyhľadajte podľa názvu')}
						name='search'
						fieldMode={FIELD_MODE.FILTER}
						search
						validate={fixLength100}
					/>
				</Col>
				<Col span={6}>
					<Field
						className='m-0'
						component={SelectField}
						allowClear
						placeholder={t('loc:Filtrujte podľa kategórie')}
						name='categoryID'
						options={CATEGORIES}
						size={'large'}
					/>
				</Col>
				<Col span={6}>
					<Field
						className='m-0'
						component={SelectField}
						allowClear
						placeholder={t('loc:Filtrujte podľa zamestnancov')}
						name='employeeID'
						options={EMPLOYEES_OPTIONS}
						size={'large'}
					/>
				</Col>
				<Col span={6}>
					<Field className='m-0' component={SelectField} allowClear placeholder={t('loc:Filtrujte podľa salónu')} name='salonID' options={TEST} size={'large'} />
				</Col>
			</Row>
		</Form>
	)
}

const form = reduxForm({
	form: FORM.SERVICES_FILTER,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	onChange: debounce((_values, _dispatch, { submit, anyTouched }) => {
		if (anyTouched) {
			submit()
		}
	}, 300),
	destroyOnUnmount: true
})(ServicesFilter)

export default form
