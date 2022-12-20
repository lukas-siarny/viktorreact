import React from 'react'
import { Field, getFormValues, InjectedFormProps, reduxForm } from 'redux-form'
import { Col, Form, Row } from 'antd'
import { useTranslation } from 'react-i18next'
import { debounce } from 'lodash'
import { useSelector } from 'react-redux'

// utils
import { FORM, ROW_GUTTER_X_DEFAULT } from '../../../utils/enums'
import { checkFiltersSizeWithoutSearch } from '../../../utils/helper'

// atoms

// components
import Filters from '../../../components/Filters'
import SelectField from '../../../atoms/SelectField'

// reducers
import { RootState } from '../../../reducers'

type ComponentProps = {}

export interface IReservationsFilter {
	// TODO:
}

type Props = InjectedFormProps<IReservationsFilter, ComponentProps> & ComponentProps

const ReservationsFilter = (props: Props) => {
	const { handleSubmit } = props
	const [t] = useTranslation()
	const servicesOptions = useSelector((state: RootState) => state.service.services.options)

	const formValues = useSelector((state: RootState) => getFormValues(FORM.RESERVAtIONS_FILTER)(state))

	return (
		<Form layout='horizontal' onSubmitCapture={handleSubmit} className={'pt-0'}>
			<Filters activeFilters={checkFiltersSizeWithoutSearch(formValues)}>
				<Row gutter={ROW_GUTTER_X_DEFAULT}>
					<Col span={8}>
						<Field
							component={SelectField}
							name={'accountState'}
							placeholder={t('loc:Stav konta')}
							allowClear
							size={'middle'}
							filterOptions
							onDidMountSearch
							options={[]}
						/>
					</Col>
					<Col span={8}>
						<Field component={SelectField} name={'serviceID'} placeholder={t('loc:Služba')} allowClear size={'middle'} onDidMountSearch options={servicesOptions} />
					</Col>
				</Row>
			</Filters>
		</Form>
	)
}

const form = reduxForm({
	form: FORM.RESERVAtIONS_FILTER,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	onChange: debounce((_values, _dispatch, { submit, anyTouched }) => {
		if (anyTouched) {
			submit()
		}
	}, 300),
	destroyOnUnmount: true
})(ReservationsFilter)

export default form
