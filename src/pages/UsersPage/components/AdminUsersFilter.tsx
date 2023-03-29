import React from 'react'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { Button, Col, Form, Row } from 'antd'
import { useTranslation } from 'react-i18next'
import { debounce } from 'lodash'
import { useSelector } from 'react-redux'
import { ReactComponent as PlusIcon } from '../../../assets/icons/plus-icon.svg'

// utils
import { CHANGE_DEBOUNCE_TIME, FIELD_MODE, FORM, ROW_GUTTER_X_DEFAULT } from '../../../utils/enums'
import { checkFiltersSizeWithoutSearch, validationString } from '../../../utils/helper'

// atoms
import InputField from '../../../atoms/InputField'
import SelectField from '../../../atoms/SelectField'

// components
import Filters from '../../../components/Filters'

// reducers
import { RootState } from '../../../reducers'

type ComponentProps = {
	createUser: Function
	createNewTemplate?: any
}

export interface IUsersFilter {
	search: string
}

type Props = InjectedFormProps<IUsersFilter, ComponentProps> & ComponentProps

const fixLength100 = validationString(100)

const AdminUsersFilter = (props: Props) => {
	const { handleSubmit, createUser } = props
	const [t] = useTranslation()

	const form = useSelector((state: RootState) => state.form?.[FORM.ADMIN_USERS_FILTER])
	const roles = useSelector((state: RootState) => state.roles.systemRoles)

	const searchInput = (
		<Field
			className={'h-10 p-0 m-0'}
			component={InputField}
			size={'large'}
			placeholder={t('loc:Hľadať podľa meno, e-mail, tel. číslo')}
			name='search'
			fieldMode={FIELD_MODE.FILTER}
			search
			validate={fixLength100}
		/>
	)

	const customContent = (
		<Button onClick={() => createUser()} type='primary' htmlType='button' className={'noti-btn w-full'} icon={<PlusIcon />}>
			{t('loc:Pridať používateľa')}
		</Button>
	)

	return (
		<Form layout='horizontal' onSubmitCapture={handleSubmit} className={'pt-0'}>
			<Filters customContent={customContent} search={searchInput} activeFilters={checkFiltersSizeWithoutSearch(form?.values)}>
				<Row gutter={ROW_GUTTER_X_DEFAULT}>
					<Col span={8}>
						<Field
							component={SelectField}
							name={'roleID'}
							placeholder={t('loc:Rola')}
							allowClear
							size={'middle'}
							filterOptions
							onDidMountSearch
							options={roles?.data}
							loading={roles?.isLoading}
						/>
					</Col>
				</Row>
			</Filters>
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
	}, CHANGE_DEBOUNCE_TIME),
	destroyOnUnmount: true
})(AdminUsersFilter)

export default form
