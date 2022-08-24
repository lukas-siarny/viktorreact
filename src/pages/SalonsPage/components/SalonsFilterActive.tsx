import React, { useMemo } from 'react'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { Button, Col, Divider, Form, Row, Tag } from 'antd'
import { useTranslation } from 'react-i18next'
import { debounce, filter, isEmpty, isNil, size } from 'lodash'
import { useSelector } from 'react-redux'
import cx from 'classnames'

// components
import Filters from '../../../components/Filters'

// reducers
import { RootState } from '../../../reducers'

// assets
import { ReactComponent as PlusIcon } from '../../../assets/icons/plus-icon.svg'
import { ReactComponent as UploadIcon } from '../../../assets/icons/upload-icon.svg'
import { ReactComponent as CheckIcon12 } from '../../../assets/icons/check-12.svg'
import { ReactComponent as ClockIcon12 } from '../../../assets/icons/clock-12.svg'
import { ReactComponent as TrashIcon12 } from '../../../assets/icons/trash-12.svg'
import { ReactComponent as TrashCrossedIcon12 } from '../../../assets/icons/trash-crossed-12.svg'
import { ReactComponent as CloseIcon12 } from '../../../assets/icons/close-12.svg'
import { ReactComponent as GlobeIcon } from '../../../assets/icons/globe-24.svg'

// utils
import { ENUMERATIONS_KEYS, FIELD_MODE, FORM, PERMISSION, ROW_GUTTER_X_DEFAULT, SALON_FILTER_CREATE_TYPES, SALON_FILTER_STATES } from '../../../utils/enums'
import { getLinkWithEncodedBackUrl, optionRenderWithImage, validationString } from '../../../utils/helper'
import Permissions from '../../../utils/Permissions'
import { history } from '../../../utils/history'

// atoms
import InputField from '../../../atoms/InputField'
import SelectField from '../../../atoms/SelectField'
import SwitchField from '../../../atoms/SwitchField'
import DateRangePickerField from '../../../atoms/DateRangePickerField'
import { getSalonFilterRanges, intervals } from './salonUtils'

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
}

type Props = InjectedFormProps<ISalonsFilterActive, ComponentProps> & ComponentProps

const fixLength100 = validationString(100)

const statusOptionRender = (itemData: any) => {
	const { value, label, className, icon } = itemData
	return (
		<Tag key={value} icon={icon} className={cx('noti-tag', className)}>
			{label}
		</Tag>
	)
}

export const checkSalonFiltersSize = (formValues: any) =>
	size(
		filter(formValues, (value, key) => {
			if (typeof value === 'boolean') {
				return value
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

	const form = useSelector((state: RootState) => state.form?.[FORM.SALONS_FILTER_ACITVE])
	const categories = useSelector((state: RootState) => state.categories.categories)
	const countries = useSelector((state: RootState) => state.enumerationsStore[ENUMERATIONS_KEYS.COUNTRIES])

	const publishedOptions = useMemo(
		() => [
			{ label: t('loc:Publikovaný'), value: SALON_FILTER_STATES.PUBLISHED, key: SALON_FILTER_STATES.PUBLISHED, icon: <CheckIcon12 />, className: 'success' },
			{ label: t('loc:Nepublikovaný'), value: SALON_FILTER_STATES.NOT_PUBLISHED, key: SALON_FILTER_STATES.NOT_PUBLISHED, icon: <CloseIcon12 /> }
		],
		[t]
	)

	const changesOptions = useMemo(
		() => [
			{
				label: t('loc:Na schválenie'),
				value: SALON_FILTER_STATES.PENDING_PUBLICATION,
				key: SALON_FILTER_STATES.PENDING_PUBLICATION,
				icon: <ClockIcon12 />,
				className: 'warning'
			},
			{ label: t('loc:Zamietnuté'), value: SALON_FILTER_STATES.DECLINED, key: SALON_FILTER_STATES.DECLINED, icon: <CloseIcon12 />, className: 'danger' }
		],
		[t]
	)

	const createTypesOptions = useMemo(
		() => [
			{ label: t('loc:BASIC'), value: SALON_FILTER_CREATE_TYPES.BASIC, key: SALON_FILTER_CREATE_TYPES.BASIC, icon: <TrashIcon12 />, className: 'basic-salon' },
			{ label: t('loc:PREMIUM'), value: SALON_FILTER_CREATE_TYPES.PREMIUM, key: SALON_FILTER_CREATE_TYPES.PREMIUM, icon: <TrashCrossedIcon12 />, className: 'premium-salon' }
		],
		[t]
	)

	const customContent = useMemo(
		() => (
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
									history.push(getLinkWithEncodedBackUrl(t('paths:salons/create')))
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
				placeholder={t('loc:Hľadať podľa názvu alebo adresy')}
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
							<Col span={8}>
								<Field
									component={SelectField}
									name={'statuses_published'}
									placeholder={t('loc:Publikovaný')}
									className={'statuses-filter-select'}
									allowClear
									size={'large'}
									filterOptions
									onDidMountSearch
									options={publishedOptions}
									optionRender={statusOptionRender}
								/>
							</Col>
							<Col span={8}>
								<Field
									component={SelectField}
									name={'statuses_changes'}
									placeholder={t('loc:Zmeny')}
									className={'statuses-filter-select'}
									allowClear
									size={'large'}
									filterOptions
									onDidMountSearch
									options={changesOptions}
									optionRender={statusOptionRender}
								/>
							</Col>
							<Col span={8}>
								<Field
									component={SelectField}
									name={'createType'}
									placeholder={t('loc:Úroveň salónu')}
									className={'statuses-filter-select'}
									allowClear
									size={'large'}
									filterOptions
									onDidMountSearch
									options={createTypesOptions}
									optionRender={statusOptionRender}
								/>
							</Col>
						</Row>
					</Row>
					<Divider className={'mt-0 mb-4'} />

					<Row gutter={ROW_GUTTER_X_DEFAULT}>
						<Col span={8}>
							<Field
								component={SelectField}
								name={'categoryFirstLevelIDs'}
								mode={'multiple'}
								placeholder={t('loc:Odvetvie')}
								allowClear
								size={'middle'}
								filterOptions
								onDidMountSearch
								options={categories?.enumerationsOptions}
								loading={categories?.isLoading}
								disabled={categories?.isLoading}
							/>
						</Col>
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
						<Col span={8}>
							<Field
								className={'w-full'}
								rangePickerClassName={'w-full'}
								component={DateRangePickerField}
								showTime
								disableFuture
								placeholder={[t('loc:Úpravy od'), t('loc:Úpravy do')]}
								allowClear
								name={'dateFromTo'}
								ranges={getSalonFilterRanges(intervals)}
								dropdownAlign={{ points: ['tr', 'br'] }}
								allowEmpty={[false, false]}
							/>
						</Col>
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
	}, 300),
	destroyOnUnmount: true
})(SalonsFilterActive)

export default form
