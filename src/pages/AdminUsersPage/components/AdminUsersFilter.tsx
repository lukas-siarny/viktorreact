import React from 'react'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { Col, Form, Row } from 'antd'
import { useTranslation } from 'react-i18next'
import { debounce } from 'lodash'

// utils
import { FIELD_MODE, FORM, ROW_GUTTER_X_DEFAULT } from '../../../utils/enums'
import { validationString } from '../../../utils/helper'

// atoms
import InputField from '../../../atoms/InputField'

type ComponentProps = {
	createNewTemplate?: any
}

interface IUserPermissionFilter {
	search: string
}

type Props = InjectedFormProps<IUserPermissionFilter, ComponentProps> & ComponentProps

const fixLength100 = validationString(100)

const AdminUsersFilter = (props: Props) => {
	const { handleSubmit } = props
	const [t] = useTranslation()

	return (
		<Form layout='horizontal' onSubmitCapture={handleSubmit} className={'pt-0'}>
			<Row gutter={ROW_GUTTER_X_DEFAULT}>
				<Col span={4}>
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
			</Row>
		</Form>
	)
}

const form = reduxForm({
	form: FORM.ADMIN_USERS_FILTER,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	onChange: debounce((_values, _dispatch, { submit, anyTouched }) => {
		if (anyTouched) {
			submit()
		}
	}, 300),
	destroyOnUnmount: true
})(AdminUsersFilter)

export default form
