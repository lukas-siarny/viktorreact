import React, { FC } from 'react'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { useTranslation } from 'react-i18next'
import { Form } from 'antd'
import { useSelector } from 'react-redux'
import { debounce } from 'lodash'

// atoms
import SelectField from '../atoms/SelectField'

// reducers
import { RootState } from '../reducers'

// utils
import { ENUMERATIONS_KEYS, FORM } from '../utils/enums'
import { optionRenderWithImage, showErrorNotification } from '../utils/helper'

// assets
import { ReactComponent as GlobeIcon } from '../assets/icons/globe-24.svg'

export interface IHeaderCountryForm {
	countryCode?: string
}

type ComponentProps = {}

type Props = InjectedFormProps<IHeaderCountryForm, ComponentProps> & ComponentProps

const HeaderSelectCountryForm: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { handleSubmit } = props
	const countries = useSelector((state: RootState) => state.enumerationsStore[ENUMERATIONS_KEYS.COUNTRIES])

	return (
		<Form layout={'vertical'} className={'form'} onSubmitCapture={handleSubmit}>
			<div className={'flex items-center'}>
				<span className='hidden lg:inline-block pr-4 text-xs selected-salon-text'>{t('loc:zvolená krajina')}:</span>
				<Field
					component={SelectField}
					optionRender={(itemData: any) => optionRenderWithImage(itemData, <GlobeIcon />)}
					name={'countryCode'}
					placeholder={t('loc:Krajina')}
					className={'p-0 m-0 w-48'}
					allowClear
					size={'middle'}
					filterOptions
					onDidMountSearch
					options={countries?.enumerationsOptions}
					loading={countries?.isLoading}
					disabled={countries?.isLoading}
				/>
			</div>
		</Form>
	)
}

const form = reduxForm<IHeaderCountryForm, ComponentProps>({
	form: FORM.HEADER_COUNTRY_FORM,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	destroyOnUnmount: true,
	onSubmitFail: showErrorNotification,
	onChange: debounce((values, dispatch, props) => {
		if (props.anyTouched) {
			props.submit()
		}
	}, 300)
})(HeaderSelectCountryForm)

export default form
