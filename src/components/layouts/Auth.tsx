import { Box, Center, Flex, HStack, Image, useColorModeValue, VStack } from '@chakra-ui/react'
import { companyInfoQuery } from 'queries/companyInfo'

export const AuthLayout = ({ children }: { children: JSX.Element }) => {
	// set color when use darkMode
	const bgRight = useColorModeValue('hu-Green.lightA', 'hu-Green.darker')
	const { data: infoSystem } = companyInfoQuery()

	return (
		<Flex h={'100vh'} overflow={'hidden'} background="hu-Pink" flexDir={'row'}>
			<VStack
				display={['none', null, null, 'flex']}
				alignItems="center"
				padding={'60px 25px 25px'}
				width={600}
				spacing={5}
				bg={bgRight}
			>
				<HStack spacing={5}>
					<Image
						borderRadius={5}
						width={50}
						height={50}
						src={infoSystem?.companyInfo?.logo_url || '/assets/logo1.svg'}
					/>

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
				<Image
					width={'full'}
					fit={'contain'}
					style={{
						transform: 'translateX(-20px)'
					}}
					src="/assets/bg.svg"
					alt="image"
					h={'83%'}
				/>
			</VStack>
			<Center minW={['max-content', null, null, '600px']} flex={1}>
				{children}
			</Center>
		</Flex>
	)
}
