/* eslint-disable import/no-extraneous-dependencies */
import React from 'react'
import { withDesign } from 'storybook-addon-designs'
import { initialize } from 'redux-form'
import { useDispatch } from 'react-redux'
import { Form, Divider } from 'antd'
import PhoneWithPrefixField from '../../components/PhoneWithPrefixField'
import withReduxForm, { STORYBOOK_FORM } from '../utils/withReduxForm'

export default {
	title: 'Fields/PhoneWithPrefix',
	decorators: [withDesign, withReduxForm]
}

export const PhoneWithPrefix = () => {
	const dispatch = useDispatch()

	React.useEffect(() => {
		dispatch(
			initialize(STORYBOOK_FORM, {
				phonePrefixCountryCode: 'SK'
			})
		)
	}, [dispatch])

	return (
		<Form layout='vertical'>
			<p>
				prefix options should be loaded from /api/b2b/admin/enums/countries
				<br /> <code> dispatch(getCountries())</code>
				<br />
				<br /> form initial prefix country must be one of
				<br /> <code>{`const phonePrefixes = useSelector((state: RootState) => state.enumerationsStore?.[ENUMERATIONS_KEYS.COUNTRIES_PHONE_PREFIX])`}</code>
			</p>
			<Divider />
			<PhoneWithPrefixField label={'Telefón'} placeholder={'Zadajte telefón'} size={'large'} prefixName={'phonePrefixCountryCode'} phoneName={'phone'} />
		</Form>
	)
}
