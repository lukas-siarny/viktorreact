import { Spin } from 'antd'
import React, { FC, Suspense } from 'react'
import { I18nextProvider } from 'react-i18next'
import i18n from './utils/i18n'
import Error503Page from './pages/Error503Page'

const App: FC = () => {
	return (
		<Suspense fallback={<Spin size={'large'} />}>
			<I18nextProvider i18n={i18n}>
				<Error503Page />
			</I18nextProvider>
		</Suspense>
	)
}

export default App
