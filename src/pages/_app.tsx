// style
import { ChakraProvider } from '@chakra-ui/react'
import theme from '../theme'
import 'public/css/global.css'
import 'react-advanced-cropper/dist/style.css';
import 'react-day-picker/dist/style.css';

import AuthContextProvider from 'contexts/AuthContext'
import { AppPropsWithLayout } from 'type/element/layout'
import { EmptyLayout } from 'components/layouts'

import { DailyProvider } from '@daily-co/daily-react-hooks';
import DailyIframe from '@daily-co/daily-js';
import { useEffect, useState} from 'react';

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
	const [co, setCo] = useState<any>()

	useEffect(()=> {
		setCo(DailyIframe.createCallObject())
	}, [])

	const Layout = Component.getLayout || EmptyLayout
	return (
		<DailyProvider callObject={co}>
			<ChakraProvider resetCSS theme={theme}>
				<AuthContextProvider>
					<Layout>
						<Component {...pageProps} />
					</Layout>
				</AuthContextProvider>
			</ChakraProvider>
		</DailyProvider>
	)
}

export default MyApp
