import React, { useMemo, useCallback } from 'react'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { Button, Col, Divider, Form, Row } from 'antd'
import { useTranslation } from 'react-i18next'
import { debounce, filter, isArray, isEmpty, isNil, size } from 'lodash'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

// components
import Filters from '../../../../components/Filters'

// reducers
import { RootState } from '../../../../reducers'

// assets
import { ReactComponent as PlusIcon } from '../../../../assets/icons/plus-icon.svg'
import { ReactComponent as UploadIcon } from '../../../../assets/icons/upload-icon.svg'
import { ReactComponent as GlobeIcon } from '../../../../assets/icons/globe-24.svg'
import { ReactComponent as CategoryIcon } from '../../../../assets/icons/categories-24-icon.svg'

// utils
import {
	ENUMERATIONS_KEYS,
	FIELD_MODE,
	FORM,
	PERMISSION,
	ROW_GUTTER_X_DEFAULT,
	SALON_CREATE_TYPE,
	SALON_FILTER_OPENING_HOURS,
	SALON_FILTER_STATES,
	SALON_SOURCE_TYPE,
	FILTER_ENTITY,
	CHANGE_DEBOUNCE_TIME
} from '../../../../utils/enums'
import { getLinkWithEncodedBackUrl, optionRenderWithImage, validationString, getRangesForDatePicker, optionRenderWithTag } from '../../../../utils/helper'
import Permissions from '../../../../utils/Permissions'
import searchWrapper from '../../../../utils/filters'

// atoms
import InputField from '../../../../atoms/InputField'
import SelectField from '../../../../atoms/SelectField'
import DateRangePickerField from '../../../../atoms/DateRangePickerField'
import SwitchField from '../../../../atoms/SwitchField'

type ComponentProps = {
	openSalonImportsModal: () => void
}

export interface ISalonsFilterActive {
	search: string
	dateFromTo: {
		dateFrom: string
		dateTo: string
	}
	statuses_all: boolean
	statuses_published: string[]
	statuses_changes: string[]
	categoryFirstLevelIDs: string[]
	countryCode: string
	createType: string
	hasSetOpeningHours: string
}

type Props = InjectedFormProps<ISalonsFilterActive, ComponentProps> & ComponentProps

const fixLength100 = validationString(100)

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

const SalonsFilterActive = (props: Props) => {
	const { handleSubmit, openSalonImportsModal } = props
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const form = useSelector((state: RootState) => state.form?.[FORM.SALONS_FILTER_ACITVE])
	const categories = useSelector((state: RootState) => state.categories.categories)
	const countries = useSelector((state: RootState) => state.enumerationsStore[ENUMERATIONS_KEYS.COUNTRIES])
	const notinoUsers = useSelector((state: RootState) => state.user.notinoUsers)

	const searchNotinoUsers = useCallback(
		async (search: string, page: number) => {
			return searchWrapper(dispatch, { page, search }, FILTER_ENTITY.NOTINO_USER)
		},
		[dispatch]
	)

	const publishedOptions = useMemo(
		() => [
			{ label: t('loc:Publikovaný'), value: SALON_FILTER_STATES.PUBLISHED, key: SALON_FILTER_STATES.PUBLISHED, tagClassName: 'bg-status-published' },
			{ label: t('loc:Nepublikovaný'), value: SALON_FILTER_STATES.NOT_PUBLISHED, key: SALON_FILTER_STATES.NOT_PUBLISHED, tagClassName: 'bg-status-notPublished' }
		],
		[t]
	)

	const changesOptions = useMemo(
		() => [
			{
				label: t('loc:Na schválenie'),
				value: SALON_FILTER_STATES.PENDING_PUBLICATION,
				key: SALON_FILTER_STATES.PENDING_PUBLICATION,
				tagClassName: 'bg-status-pending'
			},
			{ label: t('loc:Zamietnuté'), value: SALON_FILTER_STATES.DECLINED, key: SALON_FILTER_STATES.DECLINED, tagClassName: 'bg-status-declined' }
		],
		[t]
	)

	const premiumSourceOptions = useMemo(
		() => [
			{ label: t('loc:Notino'), value: SALON_SOURCE_TYPE.NOTINO, key: SALON_SOURCE_TYPE.NOTINO, tagClassName: 'bg-source-notino' },
			{ label: t('loc:Partner'), value: SALON_SOURCE_TYPE.PARTNER, key: SALON_SOURCE_TYPE.PARTNER, tagClassName: 'bg-source-partner' }
		],
		[t]
	)

	const sourceOptions = useMemo(
		() => [...premiumSourceOptions, { label: t('loc:Import'), value: SALON_SOURCE_TYPE.IMPORT, key: SALON_SOURCE_TYPE.IMPORT, tagClassName: 'bg-source-import' }],
		[t, premiumSourceOptions]
	)

	const createTypesOptions = useMemo(
		() => [
			{ label: t('loc:BASIC'), value: SALON_CREATE_TYPE.BASIC, key: SALON_CREATE_TYPE.BASIC, tagClassName: 'bg-status-basic' },
			{ label: t('loc:PREMIUM'), value: SALON_CREATE_TYPE.NON_BASIC, key: SALON_CREATE_TYPE.NON_BASIC, tagClassName: 'bg-status-premium' }
		],
		[t]
	)

	const openingHoursOptions = useMemo(
		() => [
			{ label: t('loc:Má vyplnené otváracie hodiny'), value: SALON_FILTER_OPENING_HOURS.SET, key: SALON_FILTER_OPENING_HOURS.SET },
			{ label: t('loc:Nemá vyplnené otváracie hodiny'), value: SALON_FILTER_OPENING_HOURS.NOT_SET, key: SALON_FILTER_OPENING_HOURS.NOT_SET }
		],
		[t]
	)

	const customContent = useMemo(
		() => (
			<div className={'flex items-center gap-2'}>
				<Permissions
					allowed={[PERMISSION.IMPORT_SALON]}
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
					allowed={[PERMISSION.NOTINO, PERMISSION.PARTNER]}
					render={(hasPermission, { openForbiddenModal }) => (
						<Button
							onClick={() => {
								if (hasPermission) {
									navigate(getLinkWithEncodedBackUrl(t('paths:salons/create')))
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
		),
		[t, openSalonImportsModal]
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
				validate={fixLength100}
			/>
		),
		[t]
	)

	return (
		<Form layout='horizontal' onSubmitCapture={handleSubmit} className={'pt-0'}>
			<Filters customContent={customContent} search={searchInput} activeFilters={checkSalonFiltersSize(form?.values)}>
				<>
					<Row>
						<Col span={24}>
							<span className={'font-bold text-xs mb-1'}>{t('loc:Stavy')}</span>
						</Col>
					</Row>

					<Row gutter={ROW_GUTTER_X_DEFAULT} wrap={false}>
						<Col span={3} className={'statuses-filter-all-col'}>
							<Field component={SwitchField} name={'statuses_all'} size={'middle'} label={t('loc:Všetky')} />
						</Col>
						<Row className={'flex-1'} gutter={ROW_GUTTER_X_DEFAULT}>
							<Col span={5}>
								<Field
									component={SelectField}
									name={'statuses_published'}
									placeholder={t('loc:Publikovaný')}
									className={'select-with-tag-options'}
									allowClear
									size={'large'}
									filterOptions
									onDidMountSearch
									options={publishedOptions}
									optionRender={optionRenderWithTag}
								/>
							</Col>
							<Col span={5}>
								<Field
									component={SelectField}
									name={'statuses_changes'}
									placeholder={t('loc:Zmeny')}
									className={'select-with-tag-options'}
									allowClear
									size={'large'}
									filterOptions
									onDidMountSearch
									options={changesOptions}
									optionRender={optionRenderWithTag}
								/>
							</Col>
							<Col span={4}>
								<Field
									component={SelectField}
									name={'createType'}
									placeholder={t('loc:Typ salónu')}
									className={'select-with-tag-options'}
									allowClear
									size={'large'}
									filterOptions
									onDidMountSearch
									options={createTypesOptions}
									optionRender={optionRenderWithTag}
								/>
							</Col>
							<Col span={5}>
								<Field
									component={SelectField}
									name={'sourceType'}
									placeholder={t('loc:Zdroj vytvorenia')}
									className={'select-with-tag-options'}
									allowClear
									size={'large'}
									filterOptions
									onDidMountSearch
									options={sourceOptions}
									optionRender={optionRenderWithTag}
								/>
							</Col>
							<Col span={5}>
								<Field
									component={SelectField}
									name={'premiumSourceUserType'}
									placeholder={t('loc:Zdroj PREMIUM')}
									className={'select-with-tag-options'}
									allowClear
									size={'large'}
									filterOptions
									onDidMountSearch
									options={premiumSourceOptions}
									optionRender={optionRenderWithTag}
								/>
							</Col>
						</Row>
					</Row>
					<Divider className={'mt-0 mb-4'} />

					<Row gutter={ROW_GUTTER_X_DEFAULT}>
						<Row className={'flex-1 items-center'} gutter={ROW_GUTTER_X_DEFAULT}>
							<Col span={5}>
								<Field
									component={SelectField}
									name={'categoryFirstLevelIDs'}
									mode={'multiple'}
									placeholder={t('loc:Odvetvie')}
									allowClear
									size={'middle'}
									filterOptions
									onDidMountSearch
									optionRender={(itemData: any) => optionRenderWithImage(itemData, <CategoryIcon />)}
									options={categories?.enumerationsOptions}
									loading={categories?.isLoading}
									disabled={categories?.isLoading}
								/>
							</Col>
							<Col span={4}>
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
							<Col span={5}>
								<Field
									className={'w-full'}
									rangePickerClassName={'w-full'}
									component={DateRangePickerField}
									disableFuture
									placeholder={[t('loc:Úpravy od'), t('loc:Úpravy do')]}
									allowClear
									name={'dateFromTo'}
									presets={getRangesForDatePicker()}
									dropdownAlign={{ points: ['tl', 'bl'] }}
									allowEmpty={[false, false]}
								/>
							</Col>
							<Col span={5}>
								<Field
									component={SelectField}
									name={'hasSetOpeningHours'}
									placeholder={t('loc:Otváracie hodiny')}
									allowClear
									size={'middle'}
									filterOptions
									onDidMountSearch
									options={openingHoursOptions}
								/>
							</Col>
							<Col span={5}>
								<Field
									component={SelectField}
									placeholder={t('loc:Priradený Notino používateľ')}
									name={'assignedUserID'}
									size={'middle'}
									showSearch
									onSearch={searchNotinoUsers}
									loading={notinoUsers.isLoading}
									allowInfinityScroll
									allowClear
									filterOption={false}
									onDidMountSearch
								/>
							</Col>
						</Row>
					</Row>
				</>
			</Filters>
		</Form>
	)
}

const form = reduxForm({
	form: FORM.SALONS_FILTER_ACITVE,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	onChange: debounce((_values, _dispatch, { submit, anyTouched }) => {
		if (anyTouched) {
			submit()
		}
	}, CHANGE_DEBOUNCE_TIME),
	destroyOnUnmount: true
})(SalonsFilterActive)

export default form
