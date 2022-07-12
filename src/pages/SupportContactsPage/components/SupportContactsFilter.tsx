import React from 'react'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { Button, Col, Form, Row, Tooltip } from 'antd'
import { useTranslation } from 'react-i18next'
import { debounce } from 'lodash'
import cx from 'classnames'

// components
import { useSelector } from 'react-redux'
import Filters from '../../../components/Filters'

// reducers
import { RootState } from '../../../reducers'

// assets
import { ReactComponent as PlusIcon } from '../../../assets/icons/plus-icon.svg'

// utils
import { FORM, ROW_GUTTER_X_DEFAULT } from '../../../utils/enums'

// atoms
import SelectField from '../../../atoms/SelectField'

type ComponentProps = {
	createSupportContact: Function
}

export interface ISupportContactsFilter {
	countryCode?: string
}

type Props = InjectedFormProps<ISupportContactsFilter, ComponentProps> & ComponentProps

const SupportContactsFilter = (props: Props) => {
	const { handleSubmit, createSupportContact } = props
	const [t] = useTranslation()

	const countries = useSelector((state: RootState) => state.enumerationsStore.countries_filter_options)
	// TODO: remove any when BE is done
	const supportContacts = useSelector((state: RootState) => state.supportContacts.supportContacts) as any

	const hasEveryCountrSupportContact = supportContacts?.data?.supportContacts?.length === countries?.data?.length

	const countryCodeOptionRender = (itemData: any) => {
		const { value, label, flag } = itemData
		return (
			<div className='flex items-center'>
				<img className='noti-flag w-6 mr-1 rounded' src={flag} alt={value} />
				{label}
			</div>
		)
	}

	const buttonAdd = (
		<Button
			onClick={() => createSupportContact()}
			type='primary'
			htmlType='button'
			className={cx('noti-btn w-full', { 'pointer-events-none': hasEveryCountrSupportContact, 'opacity-50': hasEveryCountrSupportContact })}
			icon={<PlusIcon />}
		>
			{t('loc:Pridať podporu')}
		</Button>
	)

	return (
		<Form layout='horizontal' onSubmitCapture={handleSubmit} className={'pt-0'}>
			<Filters>
				<Row gutter={ROW_GUTTER_X_DEFAULT} justify={'space-between'}>
					<Col span={8}>
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
					<Col>
						{hasEveryCountrSupportContact ? (
							<Tooltip title={t('loc:Ďalšiu podporu nie je možné vytvoriť. Pre každú krajinu môžete vytvoriť maximálne jednu a pre všetky už existujú.')}>
								<div>{buttonAdd}</div>
							</Tooltip>
						) : (
							buttonAdd
						)}
					</Col>
				</Row>
			</Filters>
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
	}, 300),
	destroyOnUnmount: true
})(SupportContactsFilter)

export default form
