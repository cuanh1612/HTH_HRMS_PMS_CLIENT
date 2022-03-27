// style
import { ChakraProvider } from '@chakra-ui/react'
import theme from '../theme'
import 'public/css/global.css'

import AuthContextProvider from 'contexts/AuthContext'
import { AppPropsWithLayout } from 'type/element'
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
