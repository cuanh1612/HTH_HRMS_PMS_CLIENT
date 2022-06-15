import { Avatar, Button, HStack, Menu, MenuButton, MenuItem, MenuList, useBreakpoint, useColorMode } from '@chakra-ui/react'
import { ButtonIcon, ButtonMenu } from 'components/common'
import { AuthContext } from 'contexts/AuthContext'
import { useContext, useEffect, useState } from 'react'
import { BsMoon, BsPerson, BsSun } from 'react-icons/bs'
import { IoExitOutline } from 'react-icons/io5'

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
			{!isLarge ? <ButtonMenu dir={'start'} onOpenMenu={onOpenMenu} /> : <div></div>}

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
				<Menu>
					<MenuButton>
						<Avatar
							w={'40px'}
							height={'40px'}
							borderRadius={'full'}
							name={currentUser?.name}
							src="/"
						/>
					</MenuButton>
					<MenuList>
						<MenuItem icon={<BsPerson fontSize={'15px'}/>}>Profile</MenuItem>
						<MenuItem color={'red.500'} icon={<IoExitOutline fontSize={'15px'}/>}>Logout</MenuItem>
						
					</MenuList>
				</Menu>
			</HStack>
		</HStack>
	)
}
