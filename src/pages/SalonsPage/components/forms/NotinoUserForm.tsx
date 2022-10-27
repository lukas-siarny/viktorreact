import React, { FC, useCallback } from 'react'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { Button, Col, Form, Row } from 'antd'
import { useTranslation } from 'react-i18next'

// validations
import { useDispatch, useSelector } from 'react-redux'

// utils
import { FILTER_ENTITY, FORM } from '../../../../utils/enums'

// types
import { INotinoUserForm } from '../../../../types/interfaces'
import SelectField from '../../../../atoms/SelectField'
import searchWrapper from '../../../../utils/filters'
import { RootState } from '../../../../reducers'

type ComponentProps = {}

type Props = InjectedFormProps<INotinoUserForm, ComponentProps> & ComponentProps

const NotinoUserForm: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { handleSubmit, submitting } = props
	const notinoUsers = useSelector((state: RootState) => state.user.notinoUsers)
	const dispatch = useDispatch()

	const searchNotinoUsers = useCallback(
		async (search: string, page: number) => {
			return searchWrapper(dispatch, { page, search }, FILTER_ENTITY.NOTINO_USER)
		},
		[dispatch]
	)

	return (
		<Form layout='vertical' onSubmitCapture={handleSubmit}>
			<Row>
				<Col span={24}>
					<Field
						component={SelectField}
						label={t('loc:Priradiť Notino používateľa')}
						placeholder={t('loc:Vyberte používateľa')}
						name={'assignedUser'}
						size={'large'}
						labelInValue
						showSearch
						onSearch={searchNotinoUsers}
						loading={notinoUsers.isLoading}
						allowInfinityScroll
						allowClear
						disabled={submitting}
						filterOption={false}
						onDidMountSearch
					/>
				</Col>
			</Row>
			<Button className='noti-btn' block size='large' type='primary' htmlType='submit' disabled={submitting} loading={submitting}>
				{t('loc:Uložiť')}
			</Button>
		</Form>
	)
}

const form = reduxForm<INotinoUserForm, ComponentProps>({
	form: FORM.NOTINO_USER,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	destroyOnUnmount: true
})(NotinoUserForm)

export default form
