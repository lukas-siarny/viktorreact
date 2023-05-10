import React, { useMemo, useState } from 'react'
import { Field, getFormValues, InjectedFormProps, reduxForm } from 'redux-form'
import { useSelector } from 'react-redux'
import { Button, Form, Modal, Result } from 'antd'
import { useTranslation } from 'react-i18next'
import { debounce } from 'lodash'

// components
import Filters from '../../../components/Filters'

// reducers
import { RootState } from '../../../reducers'

// assets
import { ReactComponent as PlusIcon } from '../../../assets/icons/plus-icon.svg'
import { ReactComponent as CloseIcon } from '../../../assets/icons/close-icon-modal.svg'

// utils
import { CHANGE_DEBOUNCE_TIME, CREATE_BUTTON_ID, ENUMERATIONS_KEYS, FIELD_MODE, FORM, VALIDATION_MAX_LENGTH } from '../../../utils/enums'
import { checkFiltersSize, checkFiltersSizeWithoutSearch, formFieldID, validationString } from '../../../utils/helper'

// atoms
import InputField from '../../../atoms/InputField'

type ComponentProps = {
	createSupportContact: Function
	total: number
}

export interface ISupportContactsFilter {
	countryCode?: string
}

type Props = InjectedFormProps<ISupportContactsFilter, ComponentProps> & ComponentProps

const fixLength255 = validationString(VALIDATION_MAX_LENGTH.LENGTH_255)

// NOTE: it is possible to filter contacts by countryCode but since we can have only one concat per country it dosen't make sense
const SupportContactsFilter = (props: Props) => {
	const { handleSubmit, createSupportContact, total } = props
	const [t] = useTranslation()

	const countries = useSelector((state: RootState) => state.enumerationsStore[ENUMERATIONS_KEYS.COUNTRIES])
	const supportContacts = useSelector((state: RootState) => state.supportContacts.supportContacts)
	const [visibleModal, setVisibleModal] = useState(false)
	const formValues = useSelector((state: RootState) => getFormValues(FORM.SUPPORT_CONTACTS_FILTER)(state))

	const hasEveryCountrySupportContact = !countries?.data?.some((country) => !supportContacts?.data?.supportContacts?.find((contact) => contact.country.code === country.code))

	// disable filter fields if count of cosmetics is less than 2
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
			placeholder={t('loc:Hľadať podľa krajiny')}
			name='search'
			fieldMode={FIELD_MODE.FILTER}
			search
			validate={fixLength255}
			disabled={isFilterDisabled}
		/>
	)

	return (
		<Form layout='horizontal' onSubmitCapture={handleSubmit} className={'pt-0'}>
			<Filters
				search={searchInput}
				activeFilters={checkFiltersSizeWithoutSearch(formValues)}
				customContent={
					<Button
						onClick={() => (hasEveryCountrySupportContact ? setVisibleModal(true) : createSupportContact())}
						type='primary'
						htmlType='button'
						className={'noti-btn w-full mb-2'}
						icon={<PlusIcon />}
						id={formFieldID(FORM.SUPPORT_CONTACT, CREATE_BUTTON_ID)}
					>
						{t('loc:Pridať podporu')}
					</Button>
				}
			/>
			{/* <Row gutter={ROW_GUTTER_X_DEFAULT} justify={'end'}>
					 <Col span={8}>
						<Field
							component={SelectField}
							optionRender={(itemData: any) => optionRenderWithImage(itemData, <GlobeIcon />)}
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
			</Filters> */}
			<Modal
				title={t('loc:Upozornenie')}
				open={visibleModal}
				getContainer={() => document.body}
				onCancel={() => setVisibleModal(false)}
				footer={null}
				closeIcon={<CloseIcon />}
			>
				<Result
					status='warning'
					title={t('loc:Ďalšiu podporu nie je možné vytvoriť. Pre každú krajinu môžete vytvoriť maximálne jednu.')}
					extra={
						<Button className={'noti-btn'} onClick={() => setVisibleModal(false)} type='primary'>
							{t('loc:Zatvoriť')}
						</Button>
					}
				/>
			</Modal>
		</Form>
	)
}

const form = reduxForm({
	form: FORM.SUPPORT_CONTACTS_FILTER,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	onChange: debounce((_values, _dispatch, { submit, anyTouched }) => {
		if (anyTouched) {
			submit()
		}
	}, CHANGE_DEBOUNCE_TIME),
	destroyOnUnmount: true
})(SupportContactsFilter)

export default form
