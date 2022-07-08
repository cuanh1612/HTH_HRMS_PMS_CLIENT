import { Button, Container, HStack, Text, useColorMode } from '@chakra-ui/react'
import { ButtonIcon } from 'components/common'
import Image from 'next/image'
import { BsMoon, BsSun } from 'react-icons/bs'
export const RecruitLayout = ({ children }: { children: JSX.Element }) => {
	const { toggleColorMode, colorMode } = useColorMode()
	return (
		<Container paddingInline={'25px'} paddingBlock={8} maxW={'container.xl'}>
			<HStack mb={10} w={'full'} justifyContent={'space-between'}>
				<HStack spacing={4} w={'full'}>
					<Image src={'/assets/logo1.svg'} width={'50px'} height={'50px'} />
					<Text fontSize={'20px'} fontWeight={'semibold'}>
						Huprom
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
