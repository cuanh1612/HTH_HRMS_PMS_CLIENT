import { Box, Center, Flex, HStack, useColorModeValue, VStack } from '@chakra-ui/react'

export const AuthLayout = ({ children }: { children: JSX.Element }) => {
	// set color when use darkMode
	const bgRight = useColorModeValue('hu-Green.lightA', 'hu-Green.darker')

	return (
		<Flex minHeight={'100vh'} background="hu-Pink" flexDir={'row'}>
			<VStack
				alignItems="center"
				padding={'60px 25px 25px'}
				width={600}
				spacing={5}
				bg={bgRight}
			>
				<HStack spacing={5}>
					<Box borderRadius={5} width={50} height={50} bg="hu-Green.normal"></Box>
					<Box
						fontFamily={'"Montserrat", sans-serif'}
						fontWeight={'semibold'}
						fontSize="3xl"
					>
						Huprom
					</Box>
				</HStack>
				<Box color={'hu-Green.normal'} as={'span'} maxW="80" textAlign={'center'}>
					Human resource management combined with project management
				</Box>
				{/* <Image
					width={'full'}
					fit={'cover'}
					height={'full'}
					src="https://bit.ly/dan-abramov"
					alt="image"
				/> */}
			</VStack>
			<Center minW={'600px'} flex={1}>
				{children}
			</Center>
		</Flex>
	)
}
