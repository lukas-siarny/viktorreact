import React from 'react'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { Button, Col, Form, Row } from 'antd'
import { useTranslation } from 'react-i18next'
import { debounce } from 'lodash'

// components
import { useSelector } from 'react-redux'
import Filters from '../../../components/Filters'

// reducers
import { RootState } from '../../../reducers'

// assets
import { ReactComponent as PlusIcon } from '../../../assets/icons/plus-icon.svg'

// utils
import { FIELD_MODE, FORM, ROW_GUTTER_X_DEFAULT, SALON_STATUSES } from '../../../utils/enums'
import { checkFiltersSizeWithoutSearch, validationString } from '../../../utils/helper'

// atoms
import InputField from '../../../atoms/InputField'
import SelectField from '../../../atoms/SelectField'

type ComponentProps = {
	createSalon: Function
}

export interface ISalonsFilter {
	search: string
}

type Props = InjectedFormProps<ISalonsFilter, ComponentProps> & ComponentProps

const fixLength100 = validationString(100)

const SalonsFilter = (props: Props) => {
	const { handleSubmit, createSalon } = props
	const [t] = useTranslation()

	const form = useSelector((state: RootState) => state.form?.[FORM.SALONS_FILTER])
	const categories = useSelector((state: RootState) => state.categories.categories)

	const statusOptions = [
		{ label: t('loc:Všetky'), value: SALON_STATUSES.ALL, key: SALON_STATUSES.ALL },
		{ label: t('loc:Vymazané'), value: SALON_STATUSES.DELETED, key: SALON_STATUSES.DELETED },
		{ label: t('loc:Publikované'), value: SALON_STATUSES.PUBLISHED, key: SALON_STATUSES.PUBLISHED },
		{ label: t('loc:Viditeľné'), value: SALON_STATUSES.VISIBLE, key: SALON_STATUSES.VISIBLE }
	]

	const searchInput = (
		<Field
			className={'h-10 p-0 m-0'}
			component={InputField}
			size={'large'}
			placeholder={t('loc:Vyhľadajte podľa názvu')}
			name={'search'}
			fieldMode={FIELD_MODE.FILTER}
			search
			validate={fixLength100}
		/>
	)

	const customContent = (
		<Button onClick={() => createSalon()} type='primary' htmlType='button' className={'noti-btn w-full'} icon={<PlusIcon />}>
			{t('loc:Pridať salón')}
		</Button>
	)

	return (
		<Form layout='horizontal' onSubmitCapture={handleSubmit} className={'pt-0'}>
			<Filters customContent={customContent} search={searchInput} activeFilters={checkFiltersSizeWithoutSearch(form?.values)}>
				<Row gutter={ROW_GUTTER_X_DEFAULT}>
					<Col span={8}>
						<Field
							component={SelectField}
							name={'statuses'}
							mode={'multiple'}
							placeholder={t('loc:Status')}
							allowClear
							size={'middle'}
							filterOptions
							onDidMountSearch
							options={statusOptions}
						/>
					</Col>
					<Col span={8}>
						<Field
							component={SelectField}
							name={'categoryFirstLevelIDs'}
							mode={'multiple'}
							placeholder={t('loc:Kategórie')}
							allowClear
							size={'middle'}
							filterOptions
							onDidMountSearch
							options={categories?.enumerationsOptions}
							loading={categories?.isLoading}
							disabled={categories?.isLoading}
						/>
					</Col>
				</Row>
			</Filters>
		</Form>
	)
}

const form = reduxForm({
	form: FORM.SALONS_FILTER,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	onChange: debounce((_values, _dispatch, { submit, anyTouched }) => {
		if (anyTouched) {
			submit()
		}
	}, 300),
	destroyOnUnmount: true
})(SalonsFilter)

export default form
