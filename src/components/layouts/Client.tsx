import { Box } from '@chakra-ui/react'
import { Header } from 'components/partials'

export const ClientLayout = ({ children }: { children: JSX.Element }) => {
	return (
		<Box paddingInline={'10'} maxW={'1700px'} marginInline={'auto'} as='div'>
			<Header/>
			{children}
		</Box>
	)
}
