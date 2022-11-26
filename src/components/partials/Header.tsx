import {
	Avatar,
	Box,
	Button,
	HStack,
	IconButton,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Text,
	useBreakpoint,
	useColorMode,
	useDisclosure,
	VStack,
} from '@chakra-ui/react'
import { ButtonIcon, ButtonMenu } from 'components/common'
import { Drawer } from 'components/Drawer'
import NotificationItem from 'components/NotificationItem'
import { AuthContext } from 'contexts/AuthContext'
import { logoutServerMutation } from 'mutations'
import { useRouter } from 'next/router'
import { NotificationByCurrentUserQuery } from 'queries/notification'
import { useContext, useEffect, useState } from 'react'
import { AiOutlineBell } from 'react-icons/ai'
import { BsFillBellSlashFill, BsMoon, BsPerson, BsQuestion, BsSun } from 'react-icons/bs'
import { IoExitOutline, IoSettingsOutline } from 'react-icons/io5'
import { MdOutlineEditNote } from 'react-icons/md'
import UpdateClient from 'src/pages/clients/update-clients'
import ConfigCompany from 'src/pages/config-company-info'
import UpdateEmployees from 'src/pages/employees/update-employees'
import StickysNote from 'src/pages/sticky-notes'
import { notificationType } from 'type/basicTypes'
import 'intro.js/introjs.css'
import introJs from 'intro.js'
import { optionIntro } from 'utils/helper'

export const Header = () => {
	// set darkMode
	const { colorMode, toggleColorMode } = useColorMode()

	const { push, pathname } = useRouter()

	// get user
	const { currentUser, onOpenMenu, isAuthenticated, socket, setToast, setIsAuthenticated } =
		useContext(AuthContext)

	const [isLarge, setIsLarge] = useState(true)

	const breakpoint = useBreakpoint()

	// set isOpen of dialog to UpdateProfiles
	const {
		isOpen: isOpenUpdateProfile,
		onOpen: onOpenUpdateProfile,
		onClose: onCloseUpdateProfile,
	} = useDisclosure()

	const { isOpen: isOpenNote, onOpen: onOpenNote, onClose: onCloseNote } = useDisclosure()
	const {
		isOpen: isOpenConfigPage,
		onOpen: onOpenConfigPage,
		onClose: onCloseConfigPage,
	} = useDisclosure()

	//Query -------------------------------------------------
	const { data: dataNotification, mutate: refetchNotifications } =
		NotificationByCurrentUserQuery(isAuthenticated)
	const [logout, { status: statusLogout }] = logoutServerMutation(setToast)

	useEffect(() => {
		if (breakpoint == 'md' || breakpoint == 'sm' || breakpoint == 'base') {
			setIsLarge(false)
		} else {
			setIsLarge(true)
		}
	}, [breakpoint])

	//Handle socket
	useEffect(() => {
		if (socket) {
			socket.on('getNewNotifications', () => {
				refetchNotifications()
			})
		}
	}, [socket])

	useEffect(() => {
		if (statusLogout == 'success') {
			setToast({
				msg: 'Logout Successfully',
				type: 'success',
			})
			setIsAuthenticated(false)
			push('/login')
		}
	}, [statusLogout])

	return (
		<HStack
			bg={colorMode == 'light' ? 'white' : '#1a202c'}
			paddingInline={[5, null, null, 10]}
			zIndex={10}
			top={0}
			borderBottom={`1px solid ${colorMode == 'dark' ? '#2e2e2e' : '#f1f1f1'}`}
			w={['full', null, null,'calc(100% - 300px)']}
			position={'fixed'}
			alignItems={'center'}
			justify={'space-between'}
			paddingBlock={4}
		>
			{!isLarge ? <ButtonMenu dir={'start'} onOpenMenu={onOpenMenu} /> : <div></div>}

			<HStack spacing={5}>
				<ButtonIcon
					icon={<BsQuestion fontSize={20} />}
					ariaLabel="darkMode"
					handle={() => {
						const option = optionIntro(pathname, colorMode)
						introJs().setOptions(option).start()
					}}
				/>
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
				<Box mt={'100px'}>
					<Menu placement="bottom-end">
						<MenuButton as={IconButton} position={'relative'}>
							<HStack
								alignItems={'center'}
								justifyContent={'center'}
								w={'full'}
								h={'100%'}
							>
								<AiOutlineBell fontSize={20} />
								{dataNotification?.notifications?.length ? (
									dataNotification?.notifications?.length >= 99 ? (
										'+99'
									) : (
										<Box
											bgColor={'red'}
											color={'white'}
											minH={5}
											minW={5}
											lineHeight={'18px'}
											borderRadius={'50%'}
											fontSize={12}
											position={'absolute'}
											right={'-4px'}
											top={'-5px'}
										>
											{dataNotification?.notifications?.length}
										</Box>
									)
								) : null}
							</HStack>
						</MenuButton>
						<MenuList mt={'2'} borderRadius={'10px'} padding={0}>
							<Box
								width={'300px'}
								minH={'150px'}
								maxH={'290px'}
								overflow={'auto'}
								borderRadius={'10px'}
							>
								{dataNotification?.notifications &&
								dataNotification.notifications.length > 0 ? (
									dataNotification.notifications.map(
										(notification: notificationType) => (
											<NotificationItem
												refetchNotifications={refetchNotifications}
												key={notification.id}
												notification={notification}
											/>
										)
									)
								) : (
									<VStack
										spacing={2}
										w={'full'}
										minH={'150px'}
										justify={'center'}
									>
										<BsFillBellSlashFill color="#a3aebc" />
										<Text color={'#a3aebc'}>No new notification</Text>
									</VStack>
								)}
							</Box>
						</MenuList>
					</Menu>
				</Box>
				<Menu>
					<MenuButton>
						<Avatar
							w={'40px'}
							height={'40px'}
							borderRadius={'full'}
							name={currentUser?.name}
							src={currentUser?.avatar?.url}
						/>
					</MenuButton>
					{/* sticky-notes */}
					<MenuList>
						<MenuItem
							onClick={onOpenUpdateProfile}
							icon={<BsPerson fontSize={'15px'} />}
						>
							Profile
						</MenuItem>
						<MenuItem
							onClick={onOpenNote}
							icon={<MdOutlineEditNote fontSize={'15px'} />}
						>
							Sticky note
						</MenuItem>
						{currentUser?.role == 'Admin' && (
							<MenuItem
								onClick={onOpenConfigPage}
								icon={<IoSettingsOutline fontSize={'15px'} />}
							>
								Config website
							</MenuItem>
						)}
						<MenuItem
							onClick={logout}
							color={colorMode == 'dark' ? 'red.300' : 'red.500'}
							icon={<IoExitOutline fontSize={'15px'} />}
						>
							Logout
						</MenuItem>
					</MenuList>
				</Menu>
			</HStack>

			{/* drawer to update client */}
			{currentUser && (
				<Drawer
					size="xl"
					title={`Update profile`}
					onClose={onCloseUpdateProfile}
					isOpen={isOpenUpdateProfile}
				>
					{currentUser.role === 'Client' ? (
						<UpdateClient
							onCloseDrawer={onCloseUpdateProfile}
							clientUpdateId={currentUser.id}
						/>
					) : (
						<UpdateEmployees
							onCloseDrawer={onCloseUpdateProfile}
							employeeId={currentUser.id}
						/>
					)}
				</Drawer>
			)}

			<Drawer size="full" title="Notes" onClose={onCloseNote} isOpen={isOpenNote}>
				<StickysNote />
			</Drawer>
			<Drawer
				footer={
					<Button type="submit" form="formSetConfig">
						Save
					</Button>
				}
				size="md"
				title="Config System"
				onClose={onCloseConfigPage}
				isOpen={isOpenConfigPage}
			>
				<ConfigCompany />
			</Drawer>
		</HStack>
	)
}
