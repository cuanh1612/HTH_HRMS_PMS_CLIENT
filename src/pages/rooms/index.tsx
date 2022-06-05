import {
	Avatar,
	AvatarGroup,
	Box,
	Button,
	HStack,
	IconButton,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	SimpleGrid,
	Text,
	useDisclosure,
	VStack,
} from '@chakra-ui/react'
import { Drawer } from 'components/Drawer'
import { ClientLayout } from 'components/layouts'
import { AuthContext } from 'contexts/AuthContext'
import { useRouter } from 'next/router'
import { allRoomsQuery } from 'queries'
import React, { useContext, useEffect, useState } from 'react'
import { IoEyeOutline, IoVideocamOutline } from 'react-icons/io5'
import { MdOutlineDeleteOutline, MdOutlineMoreVert } from 'react-icons/md'
import { RiPencilLine } from 'react-icons/ri'
import { NextLayout } from 'type/element/layout'
import AddRooms from './add-rooms'
import UpdateRoom from './[roomId]/update-room'

const zoom: NextLayout = () => {
	const { isAuthenticated, handleLoading, currentUser } = useContext(AuthContext)
	const router = useRouter()

	//State ---------------------------------------------------------------------
	const [roomIdShow, setRoomIdShow] = useState<string | number>(7)

	//Setup modal ----------------------------------------------------------------
	const {
		isOpen: isOpenCreRoom,
		onOpen: onOpenCreRoom,
		onClose: onCloseCreRoom,
	} = useDisclosure()

	const {
		isOpen: isOpenUpRoom,
		onOpen: onOpenUpRoom,
		onClose: onCloseUpRoom,
	} = useDisclosure()

	// query
	const { data: dataRooms, mutate: refetchAllRooms } = allRoomsQuery({
		isAuthenticated,
		role: currentUser?.role,
		id: currentUser?.id,
	})

	console.log(dataRooms)
	const data = [
		{
			url: '',
			date: '15-12-2001',
			title: 'nguyen quang hoang',
			description: 'nguyqn quang hoang dang an com thi bi ma danh den sung ca mong',
			employees: [
				{
					name: 'nguyen quang hoang',
				},
				{
					name: 'nguyen huy hoang',
				},
				{
					name: 'huy hoang',
				},
			],
		},
		{
			url: '',
			date: '15-12-2001',
			title: 'nguyen quang hoang',
			description: 'nguyqn quang hoang dang an com thi bi ma danh den sung ca mong',
			employees: [
				{
					name: 'nguyen quang hoang',
				},
				{
					name: 'nguyen huy hoang',
				},
				{
					name: 'huy hoang',
				},
			],
		},
		{
			url: '',
			date: '15-12-2001',
			title: 'nguyen quang hoang',
			description: 'nguyqn quang hoang dang an com thi bi ma danh den sung ca mong',
			employee: {
				name: 'nguyen quang hoang',
			},
			employees: [
				{
					name: 'nguyen quang hoang',
				},
				{
					name: 'nguyen huy hoang',
				},
				{
					name: 'huy hoang',
				},
			],
		},
		{
			url: '',
			date: '15-12-2001',
			title: 'nguyen quang hoang',
			description: 'nguyqn quang hoang dang an com thi bi ma danh den sung ca mong',
			employee: {
				name: 'nguyen quang hoang',
			},
			employees: [
				{
					name: 'nguyen quang hoang',
				},
				{
					name: 'nguyen huy hoang',
				},
				{
					name: 'huy hoang',
				},
			],
		},
		{
			url: '',
			date: '15-12-2001',
			title: 'nguyen quang hoang',
			employee: {
				name: 'nguyen quang hoang',
			},
			description: 'nguyqn quang hoang dang an com thi bi ma danh den sung ca mong',
			employees: [
				{
					name: 'nguyen quang hoang',
				},
				{
					name: 'nguyen huy hoang',
				},
				{
					name: 'huy hoang',
				},
			],
		},
		{
			url: '',
			date: '15-12-2001',
			title: 'nguyen quang hoang',
			employee: {
				name: 'nguyen quang hoang',
			},
			description: 'nguyqn quang hoang dang an com thi bi ma danh den sung ca mong',
			employees: [
				{
					name: 'nguyen quang hoang',
				},
				{
					name: 'nguyen huy hoang',
				},
				{
					name: 'huy hoang',
				},
			],
		},
		{
			url: '',
			date: '15-12-2001',
			employee: {
				name: 'nguyen quang hoang',
			},
			title: 'nguyen quang hoang',
			description: 'nguyqn quang hoang dang an com thi bi ma danh den sung ca mong',
			employees: [
				{
					name: 'nguyen quang hoang',
				},
				{
					name: 'nguyen huy hoang',
				},
				{
					name: 'huy hoang',
				},
			],
		},
		{
			url: '',
			date: '15-12-2001',
			title: 'nguyen quang hoang',
			employee: {
				name: 'nguyen quang hoang',
			},
			description:
				'nguyqn quang hoang dang an com th dfg dfdf gdf df di bi ma danh den sung  fg f fg  fg ffgffgfg gf fgfg fg fghf fgca mong',
			employees: [
				{
					name: 'nguyen quang hoang',
				},
				{
					name: 'nguyen huy hoang',
				},
				{
					name: 'huy hoang',
				},
			],
		},
	]

	//Useeffect ---------------------------------------------------------
	//Handle check loged in
	useEffect(() => {
		if (isAuthenticated) {
			handleLoading(false)
		} else {
			if (isAuthenticated === false) {
				router.push('/login')
			}
		}
	}, [isAuthenticated])
	return (
		<>
			<Button mb={5} onClick={onOpenCreRoom}>
				create room
			</Button>
			<Button mb={5} onClick={onOpenUpRoom}>
				update room
			</Button>
			<SimpleGrid minChildWidth="300px" spacing={10}>
				{data.map((item, key) => (
					<VStack
						overflow={'hidden'}
						paddingTop={4}
						key={key}
						bg="hu-Green.dark"
						borderRadius={'10px'}
						alignItems={'start'}
						boxShadow={'5px 5px 10px 0px #00000025'}
					>
						<HStack w={'full'} paddingInline={5} justifyContent={'space-between'}>
							<HStack spacing={4}>
								<Avatar size={'sm'} name={item.employee?.name} />
								<Text color={'white'}>{item.employee?.name}</Text>
							</HStack>
							<Menu>
								<MenuButton as={Button} paddingInline={3}>
									<MdOutlineMoreVert />
								</MenuButton>
								<MenuList>
									<MenuItem icon={<IoEyeOutline fontSize={'15px'} />}>
										View
									</MenuItem>
									<MenuItem
										onClick={() => {}}
										icon={<RiPencilLine fontSize={'15px'} />}
									>
										Edit
									</MenuItem>

									<MenuItem
										onClick={() => {}}
										icon={<MdOutlineDeleteOutline fontSize={'15px'} />}
									>
										Delete
									</MenuItem>
								</MenuList>
							</Menu>
						</HStack>
						<Text
							color={'white'}
							paddingInline={5}
							isTruncated
							fontSize={'xl'}
							fontWeight={'bold'}
						>
							{item.title}
						</Text>
						<Text color={'white'} paddingInline={5} opacity={0.6}>
							{item.date}
						</Text>
						<Text
							color={'white'}
							mb={'10px!important'}
							paddingInline={5}
							flex={1}
							opacity={0.6}
						>
							{item.description}
						</Text>
						<HStack
							color={'black'}
							paddingInline={5}
							paddingBlock={4}
							bg={'white'}
							boxSizing={'border-box'}
							borderBottomLeftRadius={'10px'}
							borderBottomRightRadius={'10px'}
							border={'1px solid black'}
							width={'full'}
							justifyContent={'space-between'}
						>
							<AvatarGroup size="sm" max={2}>
								{item.employees.map((emp) => (
									<Avatar name={emp.name} />
								))}
							</AvatarGroup>

							<IconButton
								color={'green'}
								aria-label={'call-video'}
								icon={<IoVideocamOutline />}
							/>
						</HStack>
					</VStack>
				))}
			</SimpleGrid>

			<Drawer
				size="xl"
				title="Add Room"
				onClose={onCloseCreRoom}
				isOpen={isOpenCreRoom}
			>
				<AddRooms onCloseDrawer={onCloseCreRoom} />
			</Drawer>

			<Drawer
				size="xl"
				title="Update Room"
				onClose={onCloseUpRoom}
				isOpen={isOpenUpRoom}
			>
				<UpdateRoom onCloseDrawer={onCloseUpRoom} roomId={roomIdShow} />
			</Drawer>
		</>
	)
}

zoom.getLayout = ClientLayout
export default zoom
