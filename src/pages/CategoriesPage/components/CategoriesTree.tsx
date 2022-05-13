import React, { ReactElement, useCallback, useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DataNode } from 'antd/lib/tree'
import { Button, Col, Row, Tree, Divider } from 'antd'
import { useTranslation } from 'react-i18next'
import { filter, forEach, get, includes, map } from 'lodash'
import { initialize } from 'redux-form'
import cx from 'classnames'

// assets
import { ReactComponent as PlusIcon } from '../../../assets/icons/plus-icon.svg'

// redux
import { getCategories } from '../../../reducers/categories/categoriesActions'
import { RootState } from '../../../reducers'

// utils
import { deleteReq, patchReq, postReq } from '../../../utils/request'
import { FORM, NOTIFICATION_TYPE, PERMISSION, LANGUAGE } from '../../../utils/enums'
import { checkPermissions } from '../../../utils/Permissions'
import { convertCountriesToLocalizations, normalizeNameLocalizations } from '../../../utils/helper'

// components
import CategoryForm, { ICategoryForm } from './CategoryForm'

const DEFAULT_NAME_LANGUAGE = LANGUAGE.EN

type TreeCategories = {
	title?: ReactElement
	icon?: ReactElement
	key: number
	name: string
	disabled?: boolean
	parentId?: number | null
	children?: TreeCategories[] | null
	nameLocalizations?: any
	level: number
	index: number
	image: any
	deletedAt?: string
	id: number
	isParentDeleted: boolean
}

const editPermissions = [PERMISSION.SUPER_ADMIN, PERMISSION.ADMIN, PERMISSION.ENUM_EDIT]

const CategoriesTree = () => {
	const dispatch = useDispatch()
	const [t] = useTranslation()
	const [isRemoving, setIsRemoving] = useState<boolean>(false)
	const [showForm, setShowForm] = useState<boolean>(false)
	const [treeNodeData, setTreeNodeData] = useState<any[]>([])
	const [selectedKeys, setSelectedKeys] = useState<any[]>([])
	const [expandedKeys, setExpandedKeys] = useState<any[]>([])

	const categories = useSelector((state: RootState) => state.categories.categories)
	const countries = useSelector((state: RootState) => state.enumerationsStore.countries)
	const authUserPermissions = useSelector((state: RootState) => state.user?.authUser?.data?.uniqPermissions || [])

	const emptyNameLocalizations = useMemo(() => convertCountriesToLocalizations(countries, DEFAULT_NAME_LANGUAGE), [countries])

	const createCategoryHandler = useCallback(
		(parentId: number, parentTitle: string, childrenLength: number, level = 0) => {
			setShowForm(true)
			dispatch(
				initialize(FORM.CATEGORY, {
					parentId,
					parentTitle,
					childrenLength,
					nameLocalizations: emptyNameLocalizations,
					level
				})
			)
		},
		[dispatch, emptyNameLocalizations]
	)

	const updateCategoryHandler = useCallback(
		(node) => {
			const { id, name, parentId, index, nameLocalizations, level = 0, image, deletedAt, isParentDeleted } = node
			setShowForm(true)
			dispatch(
				initialize(FORM.CATEGORY, {
					id,
					name,
					parentId,
					orderIndex: index,
					nameLocalizations: normalizeNameLocalizations(nameLocalizations, DEFAULT_NAME_LANGUAGE),
					level,
					image: image?.original ? [{ url: image?.original, uid: image?.id }] : undefined,
					deletedAt,
					isParentDeleted
				})
			)
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

	const onCategoryClickHandler = (keys: any, e: any) => {
		if (!checkPermissions(authUserPermissions, editPermissions)) return

		const key = get(e, 'node.key')
		const haveChildren = get(e, 'node.children.length') > 0
		if (haveChildren && !includes(expandedKeys, key)) setExpandedKeys([...expandedKeys, key])

		if (keys.length > 0) setSelectedKeys(keys)
		updateCategoryHandler(get(e, 'node'))
	}

	const closeCategoryHandler = () => {
		setSelectedKeys([])
		setShowForm(false)
	}

	const titleBuilder = (category: any) => {
		const { name, deletedAt } = category
		if (!deletedAt) return <span>{name}</span>

		return (
			<button className='p-0 border-none bg-transparent cursor-pointer' type='button' onClick={() => onCategoryClickHandler([], { node: category })}>
				{name}
			</button>
		)
	}

	const childrenRecursive = (parentId: number, children: any[], level = 1, isParentDeleted = false) => {
		const childs: TreeCategories[] & any = children
		const items: any = map(childs, (child, index) => {
			const data = {
				id: get(child, 'id'),
				key: get(child, 'id'),
				name: get(child, 'name'),
				disabled: !!get(child, 'deletedAt'),
				parentId,
				children: get(child, 'children') ? childrenRecursive(child.id, get(child, 'children'), level + 1, !!get(child, 'deletedAt')) : null,
				nameLocalizations: get(child, 'nameLocalizations'),
				level,
				index,
				image: get(child, 'image'),
				deletedAt: get(child, 'deletedAt'),
				isParentDeleted
			}
			return { title: titleBuilder(data), ...data }
		})
		return items as any[] & TreeCategories[]
	}

	const treeData = () => {
		const handledData: TreeCategories[] = []
		const level = 0
		forEach(categories?.data, (category: any, index: number) => {
			const data = {
				id: get(category, 'id'),
				key: get(category, 'id'),
				name: get(category, 'name'),
				parentId: null,
				disabled: !!get(category, 'deletedAt'),
				children: get(category, 'children') ? childrenRecursive(get(category, 'id'), get(category, 'children') as any[], 1, !!get(category, 'deletedAt')) : null,
				nameLocalizations: get(category, 'nameLocalizations'),
				level,
				index,
				image: get(category, 'image'),
				deletedAt: get(category, 'deletedAt'),
				isParentDeleted: false
			}

			handledData.push({
				title: titleBuilder(data),
				...data
			})
		})
		setTreeNodeData(handledData as TreeCategories[] & DataNode[])
	}

	useEffect(() => {
		treeData()
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
				orderIndex: (dropPosition >= 0 ? dropPosition : 0) + 1,
				nameLocalizations: filter(droppedData.dragNode.nameLocalizations, (item) => !!item.value)
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
					orderIndex,
					imageID: get(droppedData, 'dragNode.image.id')
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
				orderIndex: (formData.orderIndex || formData.childrenLength || cat?.length || 0) + 1,
				nameLocalizations: filter(formData.nameLocalizations, (item) => !!item.value),
				imageID: get(formData, 'image[0].id') || get(formData, 'image[0].uid')
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
							dispatch(initialize(FORM.CATEGORY, { nameLocalizations: emptyNameLocalizations, level: 0 }))
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
					<Tree
						className={'noti-tree'}
						treeData={treeNodeData}
						onDrop={onDrop}
						showIcon
						showLine
						draggable
						onSelect={onCategoryClickHandler}
						selectedKeys={selectedKeys}
						onExpand={(keys) => setExpandedKeys(keys)}
						expandedKeys={expandedKeys}
					/>
				</div>
				{showForm ? (
					<div className={'w-6/12 flex justify-around items-start'}>
						<Divider className={'h-full'} type={'vertical'} />
						<CategoryForm
							deleteCategory={deleteCategoryHandler}
							onSubmit={handleSubmit}
							createCategory={createCategoryHandler}
							closeCategoryForm={closeCategoryHandler}
						/>
					</div>
				) : undefined}
			</div>
		</>
	)
}

export default CategoriesTree
