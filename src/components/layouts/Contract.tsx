import { Box, Tab, TabList, Tabs } from '@chakra-ui/react'
import { Header } from 'components/partials'

export const ContractLayout = ({ children }: { children: JSX.Element }) => {
	return (
		<Box paddingInline={'10'} maxW={'1700px'} marginInline={'auto'} as="div">
			<Header />
			<Tabs  variant="enclosed">
				<TabList mb="1em">
					<Tab>Summary</Tab>
					<Tab>Discussion</Tab>
					<Tab isSelected={true}>Contract Files</Tab>
				</TabList>
			</Tabs>
			{children}
		</Box>
	)
}
