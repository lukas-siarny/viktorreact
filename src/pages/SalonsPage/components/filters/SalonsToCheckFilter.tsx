import React, { useMemo, useCallback, useRef, useEffect } from 'react'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { Col, Divider, Form, Row } from 'antd'
import { useTranslation } from 'react-i18next'
import { debounce, filter, isArray, isEmpty, isNil, size } from 'lodash'
import { useSelector, useDispatch } from 'react-redux'

// components
import Filters from '../../../../components/Filters'

// reducers
import { RootState } from '../../../../reducers'

// assets
import { ReactComponent as GlobeIcon } from '../../../../assets/icons/globe-icon.svg'

// utils
import { ENUMERATIONS_KEYS, FIELD_MODE, FORM, ROW_GUTTER_X_M, FILTER_ENTITY, CHANGE_DEBOUNCE_TIME, VALIDATION_MAX_LENGTH } from '../../../../utils/enums'
import { optionRenderWithImage, validationString, optionRenderWithTag } from '../../../../utils/helper'
import searchWrapper from '../../../../utils/filters'
import { publisedSalonOptions, salonChangesOptions, salonCreateTypesOptions } from '../salonUtils'

// atoms
import InputField from '../../../../atoms/InputField'
import SelectField from '../../../../atoms/SelectField'
import SwitchField from '../../../../atoms/SwitchField'

// schema
import { IGetSalonsToCheckQueryParams } from '../../../../schemas/queryParams'

type ComponentProps = {
	query: IGetSalonsToCheckQueryParams
}

export type ISalonsToCheckFilter = Pick<IGetSalonsToCheckQueryParams, 'search' | 'statuses_all' | 'statuses_published' | 'statuses_changes' | 'countryCode' | 'createType'> & {
	dateFromTo: {
		dateFrom: string
		dateTo: string
	}
}

type Props = InjectedFormProps<ISalonsToCheckFilter, ComponentProps> & ComponentProps

const fixLength255 = validationString(VALIDATION_MAX_LENGTH.LENGTH_255)

export const checkSalonFiltersSize = (formValues: any) =>
	size(
		filter(formValues, (value, key) => {
			if (typeof value === 'boolean') {
				return value
			}
			if (isArray(value) && isEmpty(value)) {
				return false
			}
			if (key === 'dateFromTo' && !value?.dateFrom && !value?.dateTo) {
				return false
			}
			return (!isNil(value) || !isEmpty(value)) && key !== 'search' && key !== 'statuses_all'
		})
	)

const SalonsToCheckFilter = (props: Props) => {
	const { handleSubmit, query } = props
	const [t] = useTranslation()
	const dispatch = useDispatch()

	const firstRender = useRef(true)

	useEffect(() => {
		firstRender.current = false
	}, [])

	const form = useSelector((state: RootState) => state.form?.[FORM.SALONS_TO_CHECK_FILTER])
	const countries = useSelector((state: RootState) => state.enumerationsStore[ENUMERATIONS_KEYS.COUNTRIES])
	const notinoUsers = useSelector((state: RootState) => state.user.notinoUsers)

	const searchNotinoUsers = useCallback(
		async (search: string, page: number) => {
			return searchWrapper(dispatch, { page, search, limit: 100 }, FILTER_ENTITY.NOTINO_USER)
		},
		[dispatch]
	)

	const searchInput = useMemo(
		() => (
			<Field
				className={'h-10 p-0 m-0'}
				component={InputField}
				size={'large'}
				placeholder={t('loc:Hľadať podľa názvu, adresy alebo ID')}
				name={'search'}
				fieldMode={FIELD_MODE.FILTER}
				search
				validate={fixLength255}
			/>
		),
		[t]
	)

	return (
		<Form layout='horizontal' onSubmitCapture={handleSubmit} className={'pt-0'}>
			<Filters search={searchInput} activeFilters={checkSalonFiltersSize(form?.values)} form={FORM.SALONS_TO_CHECK_FILTER} forceRender>
				<>
					<Row>
						<Col span={24}>
							<span className={'font-bold text-xs mb-1'}>{t('loc:Stavy')}</span>
						</Col>
					</Row>

					<Row gutter={ROW_GUTTER_X_M} wrap={false}>
						<Col span={3} className={'statuses-filter-all-col'}>
							<Field component={SwitchField} name={'statuses_all'} size={'large'} label={t('loc:Všetky')} />
						</Col>
						<Row className={'flex-1'} gutter={ROW_GUTTER_X_M}>
							<Col span={8}>
								<Field
									component={SelectField}
									name={'statuses_published'}
									placeholder={t('loc:Publikovaný')}
									className={'select-with-tag-options'}
									allowClear
									size={'large'}
									filterOptions
									onDidMountSearch
									options={publisedSalonOptions}
									optionRender={optionRenderWithTag}
								/>
							</Col>
							<Col span={8}>
								<Field
									component={SelectField}
									name={'statuses_changes'}
									placeholder={t('loc:Zmeny')}
									className={'select-with-tag-options'}
									allowClear
									size={'large'}
									filterOptions
									onDidMountSearch
									options={salonChangesOptions}
									optionRender={optionRenderWithTag}
								/>
							</Col>
							<Col span={8}>
								<Field
									component={SelectField}
									name={'createType'}
									placeholder={t('loc:Typ salónu')}
									className={'select-with-tag-options'}
									allowClear
									size={'large'}
									filterOptions
									onDidMountSearch
									options={salonCreateTypesOptions}
									optionRender={optionRenderWithTag}
								/>
							</Col>
						</Row>
					</Row>

					<Divider className={'mt-0 mb-4'} />

					<Row className={'items-center'} gutter={ROW_GUTTER_X_M}>
						<Col span={8}>
							<Field
								component={SelectField}
								optionRender={(itemData: any) => optionRenderWithImage(itemData, <GlobeIcon />)}
								name={'countryCode'}
								placeholder={t('loc:Krajina')}
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
								placeholder={t('loc:Priradený Notino používateľ')}
								name={'assignedUserID'}
								size={'large'}
								showSearch
								onSearch={searchNotinoUsers}
								loading={notinoUsers.isLoading}
								allowInfinityScroll
								allowClear
								filterOption={false}
								onDidMountSearch={firstRender.current && !!query?.assignedUserID}
							/>
						</Col>
					</Row>
				</>
			</Filters>
		</Form>
	)
}

const form = reduxForm({
	form: FORM.SALONS_TO_CHECK_FILTER,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	onChange: debounce((_values, _dispatch, { submit, anyTouched }) => {
		if (anyTouched) {
			submit()
		}
	}, CHANGE_DEBOUNCE_TIME),
	destroyOnUnmount: true
})(SalonsToCheckFilter)

export default form
