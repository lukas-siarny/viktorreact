import React from 'react'
import { useTranslation } from 'react-i18next'
import { Field, FieldArray, Fields } from 'redux-form'
import { Button } from 'antd'
import { isEmpty } from 'lodash'

// components
import DeleteButton from '../DeleteButton'

// atoms
import SwitchField from '../../atoms/SwitchField'
import TimeRangeField from '../../atoms/TimeRangeField'

// helpers
import { translateDayName } from '../../utils/helper'

// assets
import { ReactComponent as PlusIcon } from '../../assets/icons/plus-icon-16.svg'

const TimeRangesComponent = (props: any) => {
	const { fields, disabled, onDemandSwitch } = props
	const [t] = useTranslation()

	const items = fields.map((field: any, index: any) => (
		<div key={field} className={'flex items-center bg-gray-50 rounded mr-2 px-1'}>
			<Fields
				names={[`${field}.timeFrom`, `${field}.timeTo`]}
				placeholders={[t('loc:čas od'), t('loc:čas do')]}
				component={TimeRangeField}
				hideHelp
				allowClear
				size={'small'}
				itemClassName={'m-0 pb-0'}
				disabled={disabled}
				minuteStep={15}
			/>
			<DeleteButton className={'ml-1 bg-red-100'} onClick={() => fields.remove(index)} onlyIcon noConfirm smallIcon size={'small'} disabled={disabled} />
		</div>
	))

	return (
		<div className={'noti-opening-hours-row'}>
			<div className={'flex items-center noti-opening-hours-ranges'}>{items}</div>
			<div className={'flex items-center gap-2'}>
				<Button
					onClick={() => fields.push({ timeFrom: null, timeTo: null })}
					icon={<PlusIcon className={'text-notino-black'} />}
					className={'noti-btn'}
					type={'default'}
					size={'small'}
					disabled={disabled || items.length >= 3}
				>
					{t('loc:Pridať interval')}
				</Button>
				{onDemandSwitch}
			</div>
		</div>
	)
}

const getDayLabel = (value: any, t: any, showOnDemand = false) => {
	const label = translateDayName(value?.day)

	if (showOnDemand && value.onDemand) {
		return `${label} - ${t('loc:Na objednávku')}`
	}

	if (isEmpty(value?.timeRanges)) {
		return `${label} - ${t('loc:Zatvorené')}`
	}

	return label
}

const OpeningHours = (props: any) => {
	const { fields, disabled, showOnDemand } = props
	const [t] = useTranslation()

	return (
		<div className={'noti-opening-hours'}>
			{fields.map((field: any, index: any) => {
				const value = fields.get(index)

				return (
					<div key={field} className={'mt-2'}>
						<div className={'text-gray-900 font-semibold text-base'}>{getDayLabel(value, t, showOnDemand)}</div>
						<FieldArray
							props={{
								disabled: disabled || value.onDemand,
								onDemandSwitch: showOnDemand && (
									<Field
										name={`${field}.onDemand`}
										component={SwitchField}
										label={t('loc:Na objednávku')}
										size={'small'}
										disabled={disabled}
										className={'m-0 pb-0 noti-opening-hours-on-demand-switch'}
									/>
								)
							}}
							component={TimeRangesComponent}
							name={`${field}.timeRanges`}
						/>

						{/* show switch filed for open work hours over weekend */}
						{index === 4 || fields.length === 1 || (fields.length === 3 && index === 0) ? (
							<Field
								className={'mt-3 mb-0 pb-0'}
								component={SwitchField}
								label={t('loc:Otvorené cez víkend')}
								name={'openOverWeekend'}
								size={'middle'}
								disabled={disabled}
							/>
						) : undefined}
					</div>
				)
			})}
		</div>
	)
}

export default OpeningHours
