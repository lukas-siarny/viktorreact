/* eslint-disable no-underscore-dangle,import/no-cycle */
// eslint-disable-next-line max-classes-per-file
import React, { Component, FC, useState } from 'react'
import { connect, useSelector } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { get, indexOf, some } from 'lodash'
import { Button, Modal, notification, Result } from 'antd'
import { useTranslation } from 'react-i18next'

import * as UserActions from '../reducers/users/userActions'
import { history } from './history'
import { RootState } from '../reducers'
import { PERMISSION, ADMIN_PERMISSIONS } from './enums'

export const checkPermissions = (userPermissions: PERMISSION[] = [], allowed: PERMISSION[] = [], except: PERMISSION[] = []) => {
	if (except.length > 0 && some(except, (elem: any) => indexOf(userPermissions, elem) > -1)) {
		return false
	}
	if (allowed.length > 0) {
		if (some(allowed, (elem: any) => indexOf(userPermissions, elem) > -1)) {
			return true
		}
		return false
	}
	return true
}

export const withPermissions =
	(allowed: PERMISSION[] = [], except: PERMISSION[] = []) =>
	(WrappedComponent: any) => {
		class WithPermissionsClass extends Component<any> {
			_mounted = false

			constructor(props: any) {
				super(props)
				this.state = {
					visible: true
				}
			}

			componentDidMount() {
				this.init()
			}

			componentWillUnmount() {
				this._mounted = false
			}

			init = async () => {
				this._mounted = true
				const { userActions, authUserPermissions } = this.props
				let permissions
				try {
					const { data } = await userActions.getAuthUserProfile()
					permissions = get(data, 'uniqPermissions')
				} catch (e) {
					permissions = authUserPermissions
				}

				if (!checkPermissions(permissions, allowed, except)) {
					if (this._mounted) {
						this.setState(
							{
								visible: false
							},
							() => {
								history.push('/403')
							}
						)
					}
				}
			}

			render() {
				const { visible } = this.state as any
				if (!visible) {
					return null
				}
				return <WrappedComponent {...this.props} />
			}
		}
		const mapStateToProps = (state: RootState) => ({
			authUserPermissions: state.user.authUser?.data?.uniqPermissions
		})

		const mapDispatchToProps = (dispatch: any) => ({
			userActions: bindActionCreators(UserActions, dispatch)
		})

		return compose(connect(mapStateToProps, mapDispatchToProps))(WithPermissionsClass)
	}

type Props = {
	render?: (hasPermission: boolean, object: any) => React.ReactNode
	allowed?: PERMISSION[]
	except?: PERMISSION[]
}

export const ForbiddenModal: FC<{ visible: boolean; onCancel: () => void; item?: any }> = (props) => {
	const [t] = useTranslation()

	const { visible, onCancel, item } = props

	return (
		<>
			<Modal title={t('loc:Upozornenie')} visible={visible} getContainer={() => document.body} onCancel={onCancel} footer={null}>
				<Result
					status='warning'
					title={t('loc:Pre túto akciu nemáte dostatočné oprávnenia.')}
					extra={
						<Button className={'noti-btn'} onClick={onCancel} type='primary'>
							{t('loc:Zatvoriť')}
						</Button>
					}
				/>
			</Modal>
			{item}
		</>
	)
}

const Permissions: FC<Props> = (props) => {
	const { render, allowed, except, children } = props
	const authUserPermissions = useSelector((state: RootState) => state.user?.authUser?.data?.uniqPermissions || [])
	const selectedSalon = useSelector((state: RootState) => state.selectedSalon.selectedSalon.data)
	const salonPermission = selectedSalon?.uniqPermissions ?? []

	const hasPermissions = checkPermissions([...authUserPermissions, ...salonPermission], allowed, except) // permitted(authUserPermissions, selectedSalon?.uniqPermissions, allowed, except)

	const [visibleModal, setVisibleModal] = useState(false)
	const [t] = useTranslation()

	if (render) {
		const item: any = render(hasPermissions, {
			openForbiddenModal: () => {
				setVisibleModal(true)
			},
			openForbiddenNotification: () => {
				notification.warning({
					message: t('loc:Upozornenie'),
					description: t('loc:Pre túto akciu nemáte dostatočné oprávnenia.')
				})
			},
			checkPermissions: (allowedPermissions: PERMISSION[]) => checkPermissions(authUserPermissions, allowedPermissions)
		})
		const modal: any = <ForbiddenModal visible={visibleModal} onCancel={() => setVisibleModal(false)} item={item} />
		return modal
	}

	if (hasPermissions) {
		return children
	}

	return null
}

export default React.memo<FC<Props>>(Permissions)
