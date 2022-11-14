import { Box, HStack } from '@chakra-ui/react'
import { AnimateChangePage } from 'components/common'
import Navigation from 'components/sidebar/Index'
import { Header } from 'components/partials'

export const ClientLayout = ({ children }: { children: JSX.Element }) => {
	return (
		<HStack
			minHeight={'100vh'}
			height={'100px'}
			alignItems={'start'}
			pos={'relative'}
			spacing={'0px'}
			w={'100%'}
			overflow={'auto'}
		>
			<Navigation />
			<Box pos={'relative'} overflowX={'hidden'} w={['full', null, null, 'calc( 100% - 300px )']}>
				<Header />
				<AnimateChangePage>
					<Box w={'full'} h={'auto'} pt={'102px'} paddingInline={[5, null, null, 10]}>
						{children}
					</Box>
				</AnimateChangePage>
			</Box>
		</HStack>
	)
}
