import { Box, HStack } from '@chakra-ui/react'
import Navigation from 'components/navigation/Index'
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
			<Box w={'full'} >
				<Header />
				<Box  w={'full'} h={'auto'} paddingInline={10}>
					{children}
				</Box>
			</Box>
		</HStack>
	)
}
