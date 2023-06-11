import React, { useMemo } from 'react'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { Col, Form, Row } from 'antd'
import { useTranslation } from 'react-i18next'
import { debounce } from 'lodash'
import { useSelector } from 'react-redux'

// utils
import { CHANGE_DEBOUNCE_TIME, ENUMERATIONS_KEYS, FIELD_MODE, FORM, REVIEW_VERIFICATION_STATUS, ROW_GUTTER_X_DEFAULT } from '../../../utils/enums'
import { checkFiltersSizeWithoutSearch, optionRenderWithImage } from '../../../utils/helper'

// atoms
import InputField from '../../../atoms/InputField'
import SelectField from '../../../atoms/SelectField'
import InputNumberField from '../../../atoms/InputNumberField'

// components
import Filters from '../../../components/Filters'

// reducers
import { RootState } from '../../../reducers'

// assets
import { ReactComponent as GlobeIcon } from '../../../assets/icons/globe-icon.svg'

// schemas
import { IReviewFilterForm, validationReviewFilterFn } from '../../../schemas/review'

type ComponentProps = {}

type Props = InjectedFormProps<IReviewFilterForm, ComponentProps> & ComponentProps

const ReviewsFilter = (props: Props) => {
	const { handleSubmit } = props
	const [t] = useTranslation()

	const form = useSelector((state: RootState) => state.form?.[FORM.REVIEWS_FILTER])
	const countries = useSelector((state: RootState) => state.enumerationsStore[ENUMERATIONS_KEYS.COUNTRIES])

	const searchInput = (
		<Field
			className={'h-10 p-0 m-0'}
			component={InputField}
			size={'large'}
			placeholder={t('loc:Hľadať podľa názvu salónu alebo textu recenzie')}
			name='search'
			fieldMode={FIELD_MODE.FILTER}
			search
		/>
	)

	const verificationStatusOptions = useMemo(
		() => [
			{
				label: t('loc:So skrytým textom'),
				value: REVIEW_VERIFICATION_STATUS.HIDDEN_IN_B2C,
				key: REVIEW_VERIFICATION_STATUS.HIDDEN_IN_B2C
			},
			{
				label: t('loc:Na kontrolu'),
				value: REVIEW_VERIFICATION_STATUS.NOT_VERIFIED,
				key: REVIEW_VERIFICATION_STATUS.NOT_VERIFIED
			}
		],
		[t]
	)

	return (
		<Form layout='horizontal' onSubmitCapture={handleSubmit} className={'pt-0'}>
			<Filters search={searchInput} activeFilters={checkFiltersSizeWithoutSearch(form?.values)}>
				<Row gutter={ROW_GUTTER_X_DEFAULT}>
					<Col span={8}>
						<Field
							component={SelectField}
							name={'verificationStatus'}
							placeholder={t('loc:Stav recenzie')}
							allowClear
							size={'large'}
							filterOptions
							onDidMountSearch
							options={verificationStatusOptions}
						/>
					</Col>
					<Col span={8}>
						<Field
							component={SelectField}
							optionRender={(itemData: any) => optionRenderWithImage(itemData, <GlobeIcon />)}
							name={'salonCountryCode'}
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
						<Row gutter={ROW_GUTTER_X_DEFAULT}>
							<Col span={12}>
								<Field
									component={InputNumberField}
									name={'toxicityScoreFrom'}
									placeholder={t('loc:Toxicita od')}
									size={'large'}
									min={0}
									max={100}
									className={'input-auto-height'}
								/>
							</Col>
							<Col span={12}>
								<Field component={InputNumberField} name={'toxicityScoreTo'} placeholder={t('loc:Toxicita do')} size={'large'} min={0} max={100} />
							</Col>
						</Row>
					</Col>
				</Row>
			</Filters>
		</Form>
	)
}

const form = reduxForm<IReviewFilterForm, ComponentProps>({
	form: FORM.REVIEWS_FILTER,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	onChange: debounce((_values, _dispatch, { submit, anyTouched }) => {
		if (anyTouched) {
			submit()
		}
	}, CHANGE_DEBOUNCE_TIME),
	destroyOnUnmount: true,
	validate: validationReviewFilterFn
})(ReviewsFilter)

export default form
