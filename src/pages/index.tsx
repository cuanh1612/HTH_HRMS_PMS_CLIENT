import { Box, HStack, Menu, MenuButton, MenuList, Text, VStack } from '@chakra-ui/react'
import NotificationItem from 'components/NotificationItem'
import { AuthContext } from 'contexts/AuthContext'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { NotificationByCurrentUserQuery } from 'queries/notification'
import { useContext, useEffect } from 'react'
import { AiOutlineBell } from 'react-icons/ai'
import { BsFillBellSlashFill } from 'react-icons/bs'

export default function index() {
	const { isAuthenticated, handleLoading } = useContext(AuthContext)
	const { push } = useRouter()

	//Query -------------------------------------------------
	const { data: dataNotification } = NotificationByCurrentUserQuery(isAuthenticated)

	//Handle check loged in
	useEffect(() => {
		if (isAuthenticated) {
			handleLoading(false)
		} else {
			if (isAuthenticated === false) {
				push('/login')
			}
		}
	}, [isAuthenticated])
	return (
		<Box
			height={'100vh'}
			border={'1px solid red'}
			style={{
				position: 'relative',
				overflow: 'auto',
				minHeight: '100vh',
			}}
		>
			<Box ml={'500px'} mt={'100px'}>
				<Menu placement="bottom-end">
					<MenuButton position={'relative'}>
						<HStack>
							<AiOutlineBell fontSize={20} />
							<Box
								bgColor={'red'}
								color={'white'}
								minH={5}
								minW={5}
								borderRadius={'50%'}
								fontSize={12}
								position={'absolute'}
								left={'2px'}
								top={'-10px'}
							>
								23
							</Box>
						</HStack>
					</MenuButton>
					<MenuList padding={0} borderRadius={0}>
						<Box width={'400px'} bgColor={'#f2f4f7'} minH={'150px'}>
							{dataNotification?.notifications ? (
								dataNotification.notifications.map((notification) => (
									<NotificationItem
										key={notification.id}
										notification={notification}
									/>
								))
							) : (
								<VStack spacing={2} w={'full'} minH={'150px'} justify={'center'}>
									<BsFillBellSlashFill color="#a3aebc" />
									<Text color={'#a3aebc'}>No new notification</Text>
								</VStack>
							)}
						</Box>
					</MenuList>
				</Menu>
			</Box>
		</Box>
	)
}
