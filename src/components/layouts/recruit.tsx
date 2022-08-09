import { Button, Container, HStack, Image, Text, useColorMode } from '@chakra-ui/react'
import { ButtonIcon } from 'components/common'
import { companyInfoQuery } from 'queries/companyInfo'
import { BsMoon, BsSun } from 'react-icons/bs'
export const RecruitLayout = ({ children }: { children: JSX.Element }) => {
	const { toggleColorMode, colorMode } = useColorMode()

	const {data} = companyInfoQuery()
	return (
		<Container paddingInline={'25px'} paddingBlock={8} maxW={'container.xl'}>
			<HStack mb={10} w={'full'} justifyContent={'space-between'}>
				<HStack spacing={4} w={'full'}>
					<Image src={data?.companyInfo.logo_url || '/assets/logo1.svg'} width={'50px'} height={'50px'} />
					<Text fontSize={'20px'} fontWeight={'semibold'}>
						{data?.companyInfo.name || 'Huprom'}
					</Text>
				</HStack>
				<HStack spacing={5}>
					<ButtonIcon
						icon={
							colorMode != 'light' ? (
								<BsSun fontSize={'20px'} fontWeight={'semibold'} />
							) : (
								<BsMoon fontSize={'17px'} />
							)
						}
						ariaLabel="darkMode"
						handle={() => toggleColorMode()}
					/>
					<Button>Go to Dashboard</Button>
				</HStack>
			</HStack>
			{children}
		</Container>
	)
}
