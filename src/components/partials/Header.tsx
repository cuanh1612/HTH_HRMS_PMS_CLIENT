import { Avatar, HStack, useBreakpoint, useColorMode } from '@chakra-ui/react'
import { ButtonIcon, ButtonMenu } from 'components/common'
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
				<ButtonMenu dir={'start'} onOpenMenu={onOpenMenu}/>
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
