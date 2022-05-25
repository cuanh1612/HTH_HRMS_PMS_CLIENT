import { Box, HStack } from '@chakra-ui/react'
import Navigation from 'components/navigation/Index'
import { Header } from 'components/partials'
export const ClientLayout = ({ children }: { children: JSX.Element }) => {
	return (
		<HStack
			minHeight={'100vh'}
			overflow={'auto'}
			height={'100px'}
			alignItems={'start'}
			pos={'relative'}
			spacing={'0px'}
		>
			<Navigation/>
			<Box w={'full'}>
				<Header />
				<Box paddingInline={10}>{children}</Box>
			</Box>
		</HStack>
	)
}
