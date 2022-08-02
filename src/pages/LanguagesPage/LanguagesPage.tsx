import React, { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Col, Row, Spin, Button, Divider, Image } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import { useDispatch, useSelector } from 'react-redux'
import { compose } from 'redux'
import { initialize } from 'redux-form'
import cx from 'classnames'
import { filter } from 'lodash'

// components
import Breadcrumbs from '../../components/Breadcrumbs'
import CustomTable from '../../components/CustomTable'
import LanguagesForm from './components/LanguagesForm'
import CosmeticsFilter from './components/LanguagesFilter'

// utils
import { PERMISSION, ROW_GUTTER_X_DEFAULT, FORM, STRINGS } from '../../utils/enums'
import { withPermissions } from '../../utils/Permissions'
import { deleteReq, patchReq, postReq } from '../../utils/request'
import { getEmptyNameLocalizations, transformToLowerCaseWithoutAccent } from '../../utils/helper'

// reducers
import { RootState } from '../../reducers'
import { getLanguages } from '../../reducers/languages/languagesActions'

// assets
import { ReactComponent as PlusIcon } from '../../assets/icons/plus-icon.svg'

// types
import { IBreadcrumbs, ILanguage, ILanguageForm } from '../../types/interfaces'
import { Paths } from '../../types/api'

type Columns = ColumnsType<any>

type LanguagesPatch = Paths.PatchApiB2BAdminEnumsLanguagesLanguageId.RequestBody

const LanguagesPage = () => {
	const [t] = useTranslation()
	const dispatch = useDispatch()

	const [visibleForm, setVisibleForm] = useState<boolean>(false)
	const [filterQuery, setFilterQuery] = useState<string | undefined>(undefined)
	// 0 - represents new record
	const [languageID, setLanguageID] = useState<number>(0)

	const languages = useSelector((state: RootState) => state.languages.languages)

	const breadcrumbs: IBreadcrumbs = {
		items: [
			{
				name: t('loc:Zoznam jazykov')
			}
		]
	}

	useEffect(() => {
		dispatch(getLanguages())
	}, [dispatch])

	const emptyNameLocalizations = getEmptyNameLocalizations()

	const tableData = useMemo(() => {
		if (!languages || !languages.data) {
			return []
		}

		const source = filterQuery
			? languages.data.filter((lang) => {
					const name = transformToLowerCaseWithoutAccent(lang.name || lang.code)
					const query = transformToLowerCaseWithoutAccent(filterQuery)
					return name.includes(query)
			  })
			: languages.data

		// transform to table data
		return source.map((lang) => ({
			...lang,
			key: lang.id
		}))
	}, [filterQuery, languages])

	const changeFormVisibility = (show?: boolean, lang?: ILanguage) => {
		if (!show) {
			setVisibleForm(false)
			return
		}

		if (lang) {
			dispatch(
				initialize(FORM.LANGUAGES, {
					code: lang.code,
					countryCode: lang.code,
					isoFormat: lang.isoFormat,
					nameLocalizations: lang.nameLocalizations
				})
			)
		} else {
			dispatch(
				initialize(FORM.LANGUAGES, {
					code: null,
					countryCode: null,
					isoFormat: null,
					nameLocalizations: emptyNameLocalizations
				})
			)
		}

		setLanguageID(lang ? lang.id : 0)
		setVisibleForm(true)
	}

	const handleSubmit = async (formData: ILanguageForm) => {
		const body = {
			code: 'sk',
			countryCode: 'sk',
			isoFormat: 'ISO_639_1',
			nameLocalizations: filter(formData.nameLocalizations, (item) => !!item.value)
		}
		try {
			if (languageID > 0) {
				await patchReq('/api/b2b/admin/enums/languages/{languageID}', { languageID }, body as LanguagesPatch)
			} else {
				await postReq('/api/b2b/admin/enums/languages/', null, body as LanguagesPatch)
			}
			dispatch(getLanguages())
			changeFormVisibility()
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.error(error.message)
		}
	}

	const handleDelete = async () => {
		try {
			await deleteReq('/api/b2b/admin/enums/languages/{languageID}', { languageID })
			dispatch(getLanguages())
			changeFormVisibility()
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.error(error.message)
		}
	}

	const columns: Columns = [
		{
			title: t('loc:Názov'),
			dataIndex: 'name',
			key: 'name',
			render: (value, record) => (
				<div className='flex items-center base-regular'>
					{record.flag ? <img className='noti-flag w-6 mr-1 rounded' src={record.flag} alt={value} /> : <div className={'noti-flag-fallback mr-1'} />}
					{value}
				</div>
			)
		},
		{
			title: t('loc:Kód jazyka'),
			dataIndex: 'code',
			key: 'code',
			ellipsis: true,
			render: (value) => <span className='base-regular'>{value}</span>
		}
	]

	const formClass = cx({
		'w-2/3 xl:w-1/2': visibleForm
	})

	return (
		<>
			<Row>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:index')} />
			</Row>
			<Spin spinning={languages?.isLoading}>
				<Row gutter={ROW_GUTTER_X_DEFAULT}>
					<Col span={24}>
						<div className='content-body'>
							<CosmeticsFilter
								total={languages?.data?.length}
								onSubmit={(query: any) => setFilterQuery(query.search)}
								addButton={
									<Button
										onClick={() => {
											// dispatch(initialize(FORM.LANGUAGES, {}))
											changeFormVisibility(true)
										}}
										type='primary'
										htmlType='button'
										className={'noti-btn'}
										icon={<PlusIcon />}
									>
										{STRINGS(t).addRecord(t('loc:jazyk'))}
									</Button>
								}
							/>
							<div className={'w-full flex'}>
								<div className={formClass}>
									<CustomTable
										className='table-fixed'
										columns={columns}
										dataSource={tableData}
										rowClassName={'clickable-row'}
										twoToneRows
										pagination={false}
										onRow={(record) => ({
											onClick: () => changeFormVisibility(true, record)
										})}
									/>
								</div>
								{visibleForm ? (
									<div className={'w-6/12 flex justify-around items-start'}>
										<Divider className={'h-full'} type={'vertical'} />
										<LanguagesForm
											closeForm={changeFormVisibility}
											languageID={languageID}
											onSubmit={handleSubmit}
											onDelete={handleDelete}
											// usedBrands={languages.data?.map((item) => item.name)}
										/>
									</div>
								) : undefined}
							</div>
						</div>
					</Col>
				</Row>
			</Spin>
		</>
	)
}

export default compose(withPermissions([PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN, PERMISSION.ENUM_EDIT]))(LanguagesPage)
