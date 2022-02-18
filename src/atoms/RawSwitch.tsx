import React, { FC, useCallback } from 'react'
import { Switch, SwitchProps } from 'antd'

type Props = SwitchProps & {
	onChangeFn: (value: boolean, onChangeParam1?: any) => any
	onChangeParam1?: any
}

const RawSwitch: FC<Props> = (props) => {
	const { className, size, checked, disabled, onChangeFn, onChangeParam1 } = props

	const onChange = useCallback((value) => onChangeFn(value, onChangeParam1), [onChangeFn, onChangeParam1])

	return <Switch className={className} size={size} checked={checked} disabled={disabled} onChange={onChange} />
}

export default React.memo(RawSwitch)
