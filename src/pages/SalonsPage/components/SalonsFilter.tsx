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
import { ReactComponent as UploadIcon } from '../../../assets/icons/upload-icon.svg'

// utils
import { FIELD_MODE, FORM, PERMISSION, ROW_GUTTER_X_DEFAULT, SALON_STATUSES } from '../../../utils/enums'
import { checkFiltersSizeWithoutSearch, validationString } from '../../../utils/helper'
import Permissions from '../../../utils/Permissions'
import { history } from '../../../utils/history'

// atoms
import InputField from '../../../atoms/InputField'
import SelectField from '../../../atoms/SelectField'

type ComponentProps = {
	openSalonImportsModal: () => void
}

export interface ISalonsFilter {
	search: string
}

type Props = InjectedFormProps<ISalonsFilter, ComponentProps> & ComponentProps

const fixLength100 = validationString(100)

const SalonsFilter = (props: Props) => {
	const { handleSubmit, openSalonImportsModal } = props
	const [t] = useTranslation()

	const form = useSelector((state: RootState) => state.form?.[FORM.SALONS_FILTER])
	const categories = useSelector((state: RootState) => state.categories.categories)
	const countries = useSelector((state: RootState) => state.enumerationsStore.countries_filter_options)

	const statusOptions = [
		{ label: t('loc:Vymazané'), value: SALON_STATUSES.DELETED, key: SALON_STATUSES.DELETED },
		{ label: t('loc:Publikované'), value: SALON_STATUSES.PUBLISHED, key: SALON_STATUSES.PUBLISHED },
		{ label: t('loc:Viditeľné'), value: SALON_STATUSES.VISIBLE, key: SALON_STATUSES.VISIBLE },
		{ label: t('loc:Nevymazané'), value: SALON_STATUSES.NOT_DELETED, key: SALON_STATUSES.NOT_DELETED },
		{ label: t('loc:Nepublikované'), value: SALON_STATUSES.NOT_PUBLISHED, key: SALON_STATUSES.NOT_PUBLISHED },
		{ label: t('loc:Nie sú viditeľné'), value: SALON_STATUSES.NOT_VISIBLE, key: SALON_STATUSES.NOT_VISIBLE }
	]

	const searchInput = (
		<Field
			className={'h-10 p-0 m-0'}
			component={InputField}
			size={'large'}
			placeholder={t('loc:Hľadať podľa názvu alebo adresy')}
			name={'search'}
			fieldMode={FIELD_MODE.FILTER}
			search
			validate={fixLength100}
		/>
	)

	const customContent = (
		<div className={'flex items-center gap-2'}>
			<Permissions
				allowed={[PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN]}
				render={(hasPermission, { openForbiddenModal }) => (
					<Button
						onClick={() => {
							if (hasPermission) {
								openSalonImportsModal()
							} else {
								openForbiddenModal()
							}
						}}
						type='primary'
						htmlType='button'
						className={'noti-btn w-full'}
						icon={<UploadIcon />}
					>
						{t('loc:Import dát')}
					</Button>
				)}
			/>
			<Permissions
				allowed={[PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN, PERMISSION.PARTNER]}
				render={(hasPermission, { openForbiddenModal }) => (
					<Button
						onClick={() => {
							if (hasPermission) {
								history.push(t('paths:salons/create'))
							} else {
								openForbiddenModal()
							}
						}}
						type='primary'
						htmlType='button'
						className={'noti-btn w-full'}
						icon={<PlusIcon />}
					>
						{t('loc:Pridať salón')}
					</Button>
				)}
			/>
		</div>
	)

	const countryCodeOptionRender = (itemData: any) => {
		const { value, label, flag } = itemData
		return (
			<div className='flex items-center'>
				<img className='noti-flag w-6 mr-1 rounded' src={flag} alt={value} />
				{label}
			</div>
		)
	}

	return (
		<Form layout='horizontal' onSubmitCapture={handleSubmit} className={'pt-0'}>
			<Filters customContent={customContent} search={searchInput} activeFilters={checkFiltersSizeWithoutSearch(form?.values)}>
				<Row gutter={ROW_GUTTER_X_DEFAULT}>
					<Col span={6}>
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
					<Col span={6}>
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
					<Col span={6}>
						<Field
							component={SelectField}
							optionRender={countryCodeOptionRender}
							name={'countryCode'}
							placeholder={t('loc:Krajina')}
							allowClear
							size={'middle'}
							filterOptions
							onDidMountSearch
							options={countries?.enumerationsOptions}
							loading={countries?.isLoading}
							disabled={countries?.isLoading}
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
