import { Avatar, Box, HStack, useBreakpoint, useColorMode, VStack } from '@chakra-ui/react'
import { ButtonIcon } from 'components/common'
import { AuthContext } from 'contexts/AuthContext'
import { useContext, useEffect, useState } from 'react'
import { BsMoon, BsSun } from 'react-icons/bs'

export const Header = () => {
	// set darkMode
	const { colorMode, toggleColorMode } = useColorMode()

	// get user
	const { currentUser, onOpenMenu } = useContext(AuthContext)

	const [isLarge, setIsLarge] = useState(true)

	const breakpoint = useBreakpoint()
	useEffect(() => {
		if (breakpoint == 'md' || breakpoint == 'sm' || breakpoint == 'base') {
			setIsLarge(false)
		} else {
			setIsLarge(true)
		}
		console.log(breakpoint)
	}, [breakpoint])

	return (
		<HStack
			bg={colorMode == 'light' ? 'white' : '#1a202c'}
			marginBottom={'30px'}
			paddingInline={10}
			borderBottom={'1px solid gray'}
			zIndex={10}
			top={0}
			position={'sticky'}
			alignItems={'center'}
			justify={'space-between'}
			paddingBlock={4}
		>
			{!isLarge && (
				<VStack
					onClick={onOpenMenu}
					cursor={'pointer'}
					role="group"
					alignItems={'start'}
					spacing={'6px'}
				>
					<Box
						_groupHover={{
							w: '25px',
							scale: 1.1,
						}}
						transform={'auto'}
						as="span"
						transition={'0.1s linear'}
						background={colorMode == 'light' ? 'hu-Green.normal' : 'hu-Green.light'}
						borderRadius="full"
						h={'4px'}
						w={'15px'}
						pos="relative"
						display={'block'}
					></Box>
					<Box
						_groupHover={{
							scale: 1.1,
						}}
						transform={'auto'}
						as="span"
						background={colorMode == 'light' ? 'hu-Green.normalA' : 'hu-Green.lightA'}
						borderRadius="full"
						h={'4px'}
						w={'25px'}
						pos="relative"
						display={'block'}
					></Box>
				</VStack>
			)}

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
				<Avatar
					w={'40px'}
					height={'40px'}
					borderRadius={'full'}
					name={currentUser?.name}
					src="/"
				/>
			</HStack>
		</HStack>
	)
}
