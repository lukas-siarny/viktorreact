import React, { useMemo } from 'react'
import { Field, InjectedFormProps, reduxForm, getFormValues } from 'redux-form'
import { Button, Form, Tooltip } from 'antd'
import { useTranslation } from 'react-i18next'
import { debounce } from 'lodash'
import { useSelector } from 'react-redux'

// assets
import { ReactComponent as PlusIcon } from '../../../assets/icons/plus-icon.svg'
import { ReactComponent as UploadIcon } from '../../../assets/icons/upload-icon.svg'

// utils
import { CHANGE_DEBOUNCE_TIME, CREATE_CUSTOMER_BUTTON_ID, FIELD_MODE, FORM, IMPORT_BUTTON_ID, VALIDATION_MAX_LENGTH } from '../../../utils/enums'
import { checkFiltersSizeWithoutSearch, validationString, checkFiltersSize, formFieldID } from '../../../utils/helper'

// atoms
import InputField from '../../../atoms/InputField'

// components
import Filters from '../../../components/Filters'

// reducers
import { RootState } from '../../../reducers'

type ComponentProps = {
	createCustomer: Function
	total: number
	openClientImportsModal: () => void
}
// Search: nazov SalonSubRoutes, email salonu, meno priezvisko usera
// Order: lastName, salonName, userEmail,
interface ICustomersFilter {
	search: string
	salonID: string
}

type Props = InjectedFormProps<ICustomersFilter, ComponentProps> & ComponentProps

const fixLength255 = validationString(VALIDATION_MAX_LENGTH.LENGTH_255)

const CustomersFilter = (props: Props) => {
	const { handleSubmit, createCustomer, total, openClientImportsModal } = props
	const [t] = useTranslation()
	const formValues = useSelector((state: RootState) => getFormValues(FORM.CUSTOMERS_FILTER)(state))

	// disable filter fields if the number of services is less than 2
	const isFilterDisabled = useMemo(() => {
		if (checkFiltersSize(formValues) > 0) return false
		if (total > 1) return false
		return true
	}, [formValues, total])

	const searchInput = (
		<Field
			className={'h-10 p-0 m-0'}
			component={InputField}
			size={'large'}
			placeholder={t('loc:Hľadať podľa meno, e-mail, tel. číslo')}
			name='search'
			fieldMode={FIELD_MODE.FILTER}
			search
			validate={fixLength255}
			disabled={isFilterDisabled}
		/>
	)

	const customContent = (
		<div className={'flex items-center gap-2'}>
			<Tooltip title={t('loc:Importujte si svojich klientov z externých rezervačných systémov')}>
				<Button
					onClick={openClientImportsModal}
					type='primary'
					htmlType='button'
					className={'noti-btn w-full'}
					icon={<UploadIcon />}
					id={formFieldID(FORM.CUSTOMERS_FILTER, IMPORT_BUTTON_ID())}
				>
					{t('loc:Importovať zákazníkov')}
				</Button>
			</Tooltip>
			<Button id={CREATE_CUSTOMER_BUTTON_ID} onClick={() => createCustomer()} type='primary' htmlType='button' className={'noti-btn w-full'} icon={<PlusIcon />}>
				{t('loc:Pridať zákazníka')}
			</Button>
		</div>
	)

	return (
		<Form layout='horizontal' onSubmitCapture={handleSubmit} className={'pt-0'}>
			<Filters search={searchInput} activeFilters={checkFiltersSizeWithoutSearch(formValues)} customContent={customContent} />
		</Form>
	)
}

const form = reduxForm({
	form: FORM.CUSTOMERS_FILTER,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	onChange: debounce((_values, _dispatch, { submit, anyTouched }) => {
		if (anyTouched) {
			submit()
		}
	}, CHANGE_DEBOUNCE_TIME),
	destroyOnUnmount: true
})(CustomersFilter)

export default form
