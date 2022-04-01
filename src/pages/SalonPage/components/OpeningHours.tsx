import React from 'react'
import { useTranslation } from 'react-i18next'
import { Field, FieldArray, Fields } from 'redux-form'
import { Button } from 'antd'
import { isEmpty, get } from 'lodash'
import i18next from 'i18next'

// components
import cx from 'classnames'
import DeleteButton from '../../../components/DeleteButton'

// atoms
import SwitchField from '../../../atoms/SwitchField'
import TimeRangeField from '../../../atoms/TimeRangeField'

// helpers
import { translateDayName } from '../../../utils/helper'

// assets
import { ReactComponent as PlusIcon } from '../../../assets/icons/plus-icon-16.svg'

const validateTimeRangeField = (value: string) => {
	if (!value) {
		return i18next.t('loc:Toto pole je povinné')
	}
	return undefined
}

const TimeRangesComponent = (param: any) => {
	const [t] = useTranslation()

	const items = param.fields.map((field: any, index: any) => (
		<div key={field} className={'flex items-center bg-gray-50 rounded mr-2 px-1'}>
			<Fields
				names={[`${field}.timeFrom`, `${field}.timeTo`]}
				placeholders={[t('loc:čas od'), t('loc:čas do')]}
				component={TimeRangeField}
				hideHelp
				allowClear
				size={'small'}
				itemClassName={'m-0'}
				validate={validateTimeRangeField}
			/>
			<DeleteButton className={'ml-1 bg-red-100'} onClick={() => param.fields.remove(index)} onlyIcon noConfirm smallIcon size={'small'} />
		</div>
	))

	return (
		<div className={'flex items-center'}>
			{items}
			{items.length < 3 && (
				<Button
					onClick={() => param.fields.push({ timeFrom: null, timeTo: null })}
					icon={<PlusIcon className={'text-notino-black'} />}
					className={'noti-btn'}
					type={'default'}
					size={'small'}
				>
					{t('loc:Pridať interval')}
				</Button>
			)}
		</div>
	)
}

const OpeningHours = (param: any) => {
	const { fields } = param
	const [t] = useTranslation()

	return (
		<>
			{fields.map((field: any, index: any) => {
				const value = fields.get(index)
				return (
					<div key={field} className={'mt-2'}>
						<div className={'text-gray-900 font-semibold text-base'}>
							{translateDayName(value?.day)} {isEmpty(value?.timeRanges) ? ` - ${t('loc:Zatvorené')}` : undefined}
						</div>
						<FieldArray component={TimeRangesComponent} name={`${field}.timeRanges`} />
						{/* show switch filed for open work hours over weekend */}
						{index === 4 || fields.length === 1 || (fields.length === 3 && index === 0) ? (
							<Field className={'mt-3 mb-0'} component={SwitchField} label={t('loc:Otvorené cez víkend')} name={'openOverWeekend'} size={'middle'} />
						) : undefined}
					</div>
				)
			})}
		</>
	)
}

export default OpeningHours
