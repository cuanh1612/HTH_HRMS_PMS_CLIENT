// style
import { ChakraProvider } from '@chakra-ui/react'
import theme from '../theme'
import 'public/css/global.css'
import 'react-advanced-cropper/dist/style.css';
import 'react-day-picker/dist/style.css';

import AuthContextProvider from 'contexts/AuthContext'
import { AppPropsWithLayout } from 'type/element/layout'
import { EmptyLayout } from 'components/layouts'

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
	const Layout = Component.getLayout || EmptyLayout
	return (
		<ChakraProvider resetCSS theme={theme}>
			<AuthContextProvider>
				<Layout>
					<Component {...pageProps} />
				</Layout>
			</AuthContextProvider>
		</ChakraProvider>
	)
}

export default MyApp
