import { Avatar, Box, HStack, useColorMode } from '@chakra-ui/react'
import ButtonIcon from 'components/ButtonIcon'
import { AuthContext } from 'contexts/AuthContext'
import { useContext, useEffect } from 'react'
import { BsMoon, BsSun } from 'react-icons/bs'

export const Header = () => {

    // set darkMode
	const { colorMode, toggleColorMode } = useColorMode()

    // get user
    const {currentUser} = useContext(AuthContext)

	return (
		<HStack paddingBlock={4}>
			<Box flex={1}>s</Box>
			<HStack>
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
                
                 
                    <Avatar name={currentUser?.name} src='h'/>
                
			</HStack>
		</HStack>
	)
}
