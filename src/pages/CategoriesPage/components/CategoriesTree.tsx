import React, { ReactElement, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DataNode } from 'antd/lib/tree'
import { Button, Col, Row, Popover, Tree, Divider } from 'antd'
import { useTranslation } from 'react-i18next'
import { get, map } from 'lodash'
import { initialize } from 'redux-form'
import cx from 'classnames'

// assets
import { ReactComponent as PlusIcon } from '../../../assets/icons/plus-icon.svg'
import { ReactComponent as EditIcon } from '../../../assets/icons/edit-icon.svg'
import { ReactComponent as ResetIcon } from '../../../assets/icons/reset-icon.svg'

// redux
import { getCategories } from '../../../reducers/categories/categoriesActions'
import { RootState } from '../../../reducers'

// utils
import { deleteReq, patchReq, postReq } from '../../../utils/request'
import { FORM, NOTIFICATION_TYPE, PERMISSION } from '../../../utils/enums'
import Permissions from '../../../utils/Permissions'

// components
import DeleteButton from '../../../components/DeleteButton'
import CategoryForm, { ICategoryForm } from './CategoryForm'

type TreeCategories = {
	title?: ReactElement
	icon?: ReactElement
	key: number
	name: string
	disabled?: boolean
	parentId?: number | null
	children?: TreeCategories[] | null
}

const editPermissions = [PERMISSION.SUPER_ADMIN, PERMISSION.ADMIN, PERMISSION.ENUM_EDIT]

const CategoriesTree = () => {
	const dispatch = useDispatch()
	const [t] = useTranslation()
	const [isRemoving, setIsRemoving] = useState<boolean>(false)
	const [showForm, setShowForm] = useState<boolean>(false)
	const [treeNodeData, setTreeNodeData] = useState<any[]>([])

	const categories = useSelector((state: RootState) => state.categories.categories)

	const createCategoryHandler = useCallback(
		(parentId: number, parentTitle: string, childrenLength: number) => {
			setShowForm(true)
			dispatch(initialize(FORM.CATEGORY, { parentId, parentTitle, childrenLength }))
		},
		[dispatch]
	)

	const updateCategoryHandler = useCallback(
		(id: number, title: string, parentId: number, index: number) => {
			setShowForm(true)
			dispatch(initialize(FORM.CATEGORY, { id, name: title, parentId, orderIndex: index }))
		},
		[dispatch]
	)

	const deleteCategoryHandler = useCallback(
		async (id: number, restore: boolean) => {
			if (isRemoving) {
				return
			}
			try {
				setIsRemoving(true)
				await deleteReq('/api/b2b/admin/enums/categories/{categoryID}', { categoryID: id, restore }, undefined, NOTIFICATION_TYPE.NOTIFICATION, true)
				dispatch(getCategories())
				setShowForm(false)
				setIsRemoving(false)
			} catch (error: any) {
				// eslint-disable-next-line no-console
				console.error(error.message)
				setIsRemoving(false)
			}
		},
		[dispatch, isRemoving]
	)

	const titleBuilder = (title: string, id: number, parentId: number, index: number, disabled: boolean, children: any) => (
		<>
			<Popover
				placement='right'
				trigger='click'
				content={
					<div className={'flex'}>
						<Permissions
							allowed={editPermissions}
							render={(hasPermission, { openForbiddenModal }) => (
								<>
									{!disabled ? (
										<>
											<Button
												type='link'
												className={'noti-btn icon-center'}
												onClick={hasPermission ? () => createCategoryHandler(id, title, children?.length) : openForbiddenModal}
												icon={<PlusIcon />}
											/>
											<Button
												type='link'
												className={'noti-btn icon-center'}
												onClick={
													hasPermission
														? () => {
																updateCategoryHandler(id, title, parentId, index)
														  }
														: openForbiddenModal
												}
												icon={<EditIcon />}
											/>
											<DeleteButton
												className={'icon-center'}
												onConfirm={hasPermission ? () => deleteCategoryHandler(id, disabled) : openForbiddenModal}
												onlyIcon
												entityName={t('loc:kategóriu')}
											/>
										</>
									) : (
										<Button
											type='link'
											className={'noti-btn icon-center'}
											onClick={hasPermission ? () => deleteCategoryHandler(id, disabled) : openForbiddenModal}
											icon={<ResetIcon />}
										/>
									)}
								</>
							)}
						/>
					</div>
				}
			>
				<span>{title}</span>
			</Popover>
		</>
	)

	const childrenRecursive = (parentId: number, children: any[]) => {
		const childs: TreeCategories[] & any = children
		const items: any = map(childs, (child, index) => ({
			title: titleBuilder(get(child, 'name'), get(child, 'id'), parentId, parseInt(index, 10), !!get(child, 'deletedAt'), get(child, 'children')),
			key: get(child, 'id'),
			name: get(child, 'name'),
			disabled: !!get(child, 'deletedAt'),
			parentId,
			children: get(child, 'children') ? childrenRecursive(child.id, get(child, 'children')) : null
		}))
		return items as any[] & TreeCategories[]
	}

	const treeData = () => {
		const handledData: TreeCategories[] = []
		map(categories?.data, (category: any, index) => {
			handledData.push({
				title: titleBuilder(get(category, 'name'), get(category, 'id'), -1, parseInt(index, 10), !!get(category, 'deletedAt'), get(category, 'children')),
				key: get(category, 'id'),
				name: get(category, 'name'),
				parentId: null,
				disabled: !!get(category, 'deletedAt'),
				children: get(category, 'children') ? childrenRecursive(get(category, 'id'), get(category, 'children') as any[]) : null
			})
		})
		setTreeNodeData(handledData as TreeCategories[] & DataNode[])
	}

	useEffect(() => {
		treeData()
	}, [categories])

	const onDrop = async (droppedData: any) => {
		try {
			// key of dropped node
			const dropKey: number = droppedData.node.key
			// key of dragged node
			const dragKey: number = droppedData.dragNode.key
			// drag node actual index/position in array children nodes
			const dragPos: string = droppedData.dragNode.pos.split('-')
			const dropPos: string = droppedData.node.pos.split('-')
			// drop index position in drop node children array
			const dropPosition: number = droppedData.dropPosition - Number(dropPos[dropPos.length - 1])
			let body: any = {
				name: droppedData.dragNode.name,
				orderIndex: (dropPosition >= 0 ? dropPosition : 0) + 1
			}

			// check condition if user dropped node to gap between nodes
			if (!droppedData.dropToGap) {
				// dropped node outside of gap between nodes
				if (dropKey >= 0) {
					body = {
						...body,
						parentID: dropKey
					}
				}
			} else {
				//  dropped node inside of gap between nodes or dropped node to start or end of children nodes array
				let orderIndex: number
				// if drop position is not detected
				if (dropPosition === -1) {
					orderIndex = 1
				} else if (
					Number(dragPos[dragPos.length - 1]) < droppedData.dropPosition &&
					(droppedData.node.props.data.parentId === droppedData.dragNode.props.data.parentId || droppedData.dragNode.props.data.parentId === null)
				) {
					// check if drag position is less than drop position and if is inside same node parent
					orderIndex = droppedData.dropPosition
				} else {
					// if previous condition is not met, count one to the index of drop node
					// dropped node fitted in gap between two node
					orderIndex = droppedData.dropPosition + 1
				}
				// prepare body for request
				body = {
					...body,
					parentID: droppedData.node.props.data.parentId,
					orderIndex
				}
			}
			// check and update categories on be
			await patchReq('/api/b2b/admin/enums/categories/{categoryID}', { categoryID: dragKey }, body)
			dispatch(getCategories())
			setShowForm(false)
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.error(error.message)
		}
	}

	const handleSubmit = async (formData: ICategoryForm) => {
		const cat: any | null = categories?.data
		try {
			let body: any = {
				name: formData.name,
				orderIndex: (formData.orderIndex || formData.childrenLength || cat?.length || 0) + 1
			}
			if (formData.parentId >= 0) {
				body = {
					...body,
					parentID: formData.parentId
				}
			}
			if (formData.id && formData.id >= 0) {
				await patchReq('/api/b2b/admin/enums/categories/{categoryID}', { categoryID: formData.id }, body)
			} else {
				await postReq('/api/b2b/admin/enums/categories/', null, body)
			}
			dispatch(getCategories())
			setShowForm(false)
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.error(error.message)
		}
	}

	const formClass = cx({
		'w-6/12': showForm
	})

	return (
		<>
			<Row className={'flex justify-between'}>
				<Col span={6}>
					<h3>{t('loc:Kategórie')}</h3>
				</Col>
				<Col span={6}>
					<Button
						onClick={() => {
							dispatch(initialize(FORM.CATEGORY, null))
							setShowForm(true)
						}}
						type='primary'
						htmlType='button'
						className={'noti-btn w-full'}
						icon={<PlusIcon />}
					>
						{t('loc:Pridať kategóriu')}
					</Button>
				</Col>
			</Row>
			<div className={'w-full flex'}>
				<div className={formClass}>
					<Tree className={'noti-tree'} treeData={treeNodeData} onDrop={onDrop} showIcon showLine draggable />
				</div>
				{showForm ? (
					<div className={'w-6/12 flex justify-around items-start'}>
						<Divider className={'h-full'} type={'vertical'} />
						<CategoryForm deleteCategory={(id: number) => deleteCategoryHandler(id, false)} onSubmit={handleSubmit} />
					</div>
				) : undefined}
			</div>
		</>
	)
}

export default CategoriesTree
