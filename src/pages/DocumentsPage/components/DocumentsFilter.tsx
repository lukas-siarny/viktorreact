import React from 'react'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { Button, Col, Form, Row } from 'antd'
import { useTranslation } from 'react-i18next'
import { debounce } from 'lodash'
import { useSelector } from 'react-redux'
import { ReactComponent as PlusIcon } from '../../../assets/icons/plus-icon.svg'

// utils
import { CHANGE_DEBOUNCE_TIME, ENUMERATIONS_KEYS, FIELD_MODE, FORM, ROW_GUTTER_X_DEFAULT, VALIDATION_MAX_LENGTH } from '../../../utils/enums'
import { checkFiltersSizeWithoutSearch, optionRenderWithImage, validationString } from '../../../utils/helper'

// atoms
import InputField from '../../../atoms/InputField'
import SelectField from '../../../atoms/SelectField'

// components
import Filters from '../../../components/Filters'
import { ReactComponent as GlobeIcon } from '../../../assets/icons/globe-24.svg'

// reducers
import { RootState } from '../../../reducers'

type ComponentProps = {
	createDocument: Function
}

export interface IDocumentsFilter {
	search: string
}

type Props = InjectedFormProps<IDocumentsFilter, ComponentProps> & ComponentProps

const fixLength255 = validationString(VALIDATION_MAX_LENGTH.LENGTH_255)

const DocumentsFilter = (props: Props) => {
	const { handleSubmit, createDocument } = props
	const [t] = useTranslation()
	const assetTypes = useSelector((state: RootState) => state.documents.assetTypes)

	const form = useSelector((state: RootState) => state.form?.[FORM.DOCUMENTS_FILTER])

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
		/>
	)

	const customContent = (
		<Button onClick={() => createDocument()} type='primary' htmlType='button' className={'noti-btn w-full'} icon={<PlusIcon />}>
			{t('loc:Pridať dokument')}
		</Button>
	)
	const countries = useSelector((state: RootState) => state.enumerationsStore[ENUMERATIONS_KEYS.COUNTRIES])

	return (
		<Form layout='horizontal' onSubmitCapture={handleSubmit} className={'pt-0'}>
			<Filters customContent={customContent} search={searchInput} activeFilters={checkFiltersSizeWithoutSearch(form?.values)}>
				<Row gutter={ROW_GUTTER_X_DEFAULT}>
					<Col span={8}>
						<Field
							component={SelectField}
							optionRender={(itemData: any) => optionRenderWithImage(itemData, <GlobeIcon />)}
							name={'languageCode'}
							placeholder={t('loc:Jazyk')}
							allowClear
							size={'large'}
							filterOptions
							onDidMountSearch
							options={countries?.enumerationsOptions}
							loading={countries?.isLoading}
							disabled={countries?.isLoading}
						/>
					</Col>
					<Col span={8}>
						<Field
							component={SelectField}
							name={'assetType'}
							placeholder={t('loc:Typ dokumentu')}
							allowClear
							size={'large'}
							filterOptions
							onDidMountSearch
							options={assetTypes?.options}
							loading={assetTypes?.isLoading}
							disabled={assetTypes?.isLoading}
						/>
					</Col>
				</Row>
			</Filters>
		</Form>
	)
}

const form = reduxForm({
	form: FORM.DOCUMENTS_FILTER,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	onChange: debounce((_values, _dispatch, { submit, anyTouched }) => {
		if (anyTouched) {
			submit()
		}
	}, CHANGE_DEBOUNCE_TIME),
	destroyOnUnmount: true
})(DocumentsFilter)

export default form
