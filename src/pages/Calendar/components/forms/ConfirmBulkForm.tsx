import React, { FC, useEffect } from 'react'
import { destroy, Field, InjectedFormProps, reduxForm } from 'redux-form'
import { Form } from 'antd'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

// utils
import { showErrorNotification } from '../../../../utils/helper'
import { CONFIRM_BULK, FORM, REQUEST_TYPE, STRINGS } from '../../../../utils/enums'

// components
import RadioGroupField from '../../../../atoms/RadioGroupField'

import { IBulkConfirmForm } from '../../../../types/interfaces'

type ComponentProps = {
	requestType: REQUEST_TYPE
}

type Props = InjectedFormProps<IBulkConfirmForm, ComponentProps> & ComponentProps

const formName = FORM.CONFIRM_BULK_FORM

const ConfirmBulkForm: FC<Props> = (props) => {
	const { handleSubmit, requestType } = props
	const [t] = useTranslation()
	const dispatch = useDispatch()

	useEffect(() => {
		// ak ma uzivatel otvoreny modal na bulk akcie a refreshne tab, tak sa neprecistia data z formularu
		// nasledny edit bulkoveho eventu sa bez precistenia dat nesprava korektne
		const destroyBulkForm = () => {
			dispatch(destroy(FORM.CONFIRM_BULK_FORM))
		}
		window.addEventListener('beforeunload', destroyBulkForm)
		return () => window.removeEventListener('beforeunload', destroyBulkForm)
	}, [dispatch])

	const options = [
		{
			key: CONFIRM_BULK.SINGLE_RECORD,
			value: CONFIRM_BULK.SINGLE_RECORD,
			label: requestType === REQUEST_TYPE.PATCH ? STRINGS(t).edit(t('loc:len tento záznam')) : STRINGS(t).delete(t('loc:len tento záznam'))
		},
		{
			key: CONFIRM_BULK.BULK,
			value: CONFIRM_BULK.BULK,
			label: requestType === REQUEST_TYPE.PATCH ? STRINGS(t).edit(t('loc:všetky záznamy')) : STRINGS(t).delete(t('loc:všetky záznamy'))
		}
	]
	return (
		<Form layout='vertical' className='w-full h-full flex flex-col gap-2' onSubmitCapture={handleSubmit}>
			<p>
				{requestType === REQUEST_TYPE.PATCH
					? t('loc:Úpravujete záznam, ktorý sa opakuje. Aktualizácia nadchádzajúcich zmien prepíše prebiehajúce plánovanie')
					: t('loc:Odstráňujete záznam, ktorý sa opakuje. Odstránenie nadchádzajúcich zmien prepíše prebiehajúce plánovanie')}
			</p>
			<Field className={'p-0 m-0 nc-radio-event-type'} component={RadioGroupField} name={'actionType'} options={options} direction={'vertical'} />
		</Form>
	)
}

const form = reduxForm<IBulkConfirmForm, ComponentProps>({
	form: formName,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	destroyOnUnmount: true,
	onSubmitFail: showErrorNotification
})(ConfirmBulkForm)

export default form
