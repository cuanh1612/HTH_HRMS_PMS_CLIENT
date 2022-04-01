import { Avatar, Box, Heading, HStack, Text, useColorMode } from '@chakra-ui/react'
import ButtonIcon from 'components/ButtonIcon'
import { AuthContext } from 'contexts/AuthContext'
import { useContext, useEffect } from 'react'
import { BsMoon, BsSun } from 'react-icons/bs'

export const Header = () => {
	// set darkMode
	const { colorMode, toggleColorMode } = useColorMode()

	// get user
	const { currentUser } = useContext(AuthContext)

	return (
		<HStack alignItems={'center'} justify={'space-between'} paddingBlock={4}>
			<Box>s</Box>
            <Heading color={'hu-Pink.normal'} size={'lg'} fontFamily={'"Montserrat", sans-serif'}>
                Huprom
            </Heading>
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
                    fontFamily={'"Hind Madurai", sans-serif'}
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
