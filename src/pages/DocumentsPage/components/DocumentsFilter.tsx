import React from 'react'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { Button, Col, Form, Row } from 'antd'
import { useTranslation } from 'react-i18next'
import { debounce } from 'lodash'
import { useSelector } from 'react-redux'

// utils
import { CHANGE_DEBOUNCE_TIME, FORM, ROW_GUTTER_X_M, STRINGS } from '../../../utils/enums'
import { optionRenderWithIcon } from '../../../utils/helper'

// atoms
import SelectField from '../../../atoms/SelectField'

// assets
import { ReactComponent as GlobeIcon } from '../../../assets/icons/globe-icon.svg'
import { ReactComponent as PlusIcon } from '../../../assets/icons/plus-icon.svg'

// reducers
import { RootState } from '../../../reducers'
import { languageOptions } from '../../../components/LanguagePicker'

type ComponentProps = {
	createDocument: Function
}

export interface IDocumentsFilter {
	search: string
}

type Props = InjectedFormProps<IDocumentsFilter, ComponentProps> & ComponentProps

const DocumentsFilter = (props: Props) => {
	const { handleSubmit, createDocument } = props
	const [t] = useTranslation()
	const assetTypes = useSelector((state: RootState) => state.documents.assetTypes)

	return (
		<Form layout='horizontal' onSubmitCapture={handleSubmit} className={'pt-0'}>
			<Row gutter={ROW_GUTTER_X_M}>
				<Col span={8}>
					<Field
						component={SelectField}
						optionRender={(itemData: any) => optionRenderWithIcon(itemData, <GlobeIcon />)}
						name={'languageCode'}
						placeholder={t('loc:Jazyk')}
						allowClear
						size={'large'}
						filterOptions
						onDidMountSearch
						options={languageOptions}
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
				<Col span={8} className={'text-right'}>
					<Button onClick={() => createDocument()} type='primary' htmlType='button' className={'noti-btn'} icon={<PlusIcon />}>
						{STRINGS(t).addRecord(t('loc:dokument'))}
					</Button>
				</Col>
			</Row>
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
