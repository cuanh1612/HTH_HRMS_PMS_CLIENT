import {
	Box,
	HStack,
	Text,
	VStack,
	useBreakpoint,
	Drawer,
	DrawerOverlay,
	DrawerContent,
	DrawerCloseButton,
	DrawerHeader,
	DrawerBody,
	DrawerFooter,
	Button,
    IconButton,
    CloseButton,
} from '@chakra-ui/react'
import { AuthContext } from 'contexts/AuthContext'
import React, { useState, useEffect, useContext } from 'react'
import { AiOutlineFile, AiOutlineProject, AiOutlineUsergroupAdd } from 'react-icons/ai'
import { BiMessageDots } from 'react-icons/bi'
import { BsCheck2, BsPerson } from 'react-icons/bs'
import { IoIosGitNetwork } from 'react-icons/io'
import { IoAirplaneOutline, IoExitOutline } from 'react-icons/io5'
import { MdOutlineEditNote, MdOutlineEvent } from 'react-icons/md'
import LinkGroup from './LinkGroup'
import LinkItem from './LinkItem'

const SideLeft = () => (
	<Box
		minW={300}
		zIndex={10}
		h={'100vh'}
		borderRight={'1px solid gray'}
		style={{
			top: '0px',
			position: 'sticky',
		}}
		paddingLeft={5}
	>
		<HStack spacing={5} w={'full'} h={'73px'}>
			<Box w={'50px'} h={'50px'} borderRadius={4} border={'1px solid red'}></Box>
			<Text fontWeight={'bold'} fontSize={'xl'}>
				HUPROM
			</Text>
		</HStack>

		<VStack paddingTop={4} height={'calc( 100vh - 75px )'} overflow={'auto'} spacing={4}>
			<LinkGroup
				data={[
					{
						icon: <BsPerson fontSize={20} />,
						link: '/employees',
						title: 'Employees',
					},
					{
						icon: <IoExitOutline fontSize={20} />,
						link: '/leaves',
						title: 'Leaves',
					},
					{
						icon: <BsCheck2 fontSize={20} />,
						link: '/attendance',
						title: 'Attendance',
					},
					{
						icon: <IoAirplaneOutline fontSize={20} />,
						link: '/holidays',
						title: 'Holiday',
					},
				]}
				title="HR"
				icon={<AiOutlineUsergroupAdd fontSize={20} />}
			/>
			<LinkGroup
				data={[
					{
						icon: <AiOutlineFile fontSize={20} />,
						link: '/contracts',
						title: 'Contracts',
					},
					{
						icon: <AiOutlineProject fontSize={20} />,
						link: '/projects',
						title: 'Projects',
					},
				]}
				title="Work"
				icon={<IoIosGitNetwork fontSize={20} />}
			/>
			<LinkItem link="/events" title="Events" icon={<MdOutlineEvent fontSize={20} />} />
			<LinkItem
				link="/notice-boards"
				title="Notice boards"
				icon={<MdOutlineEditNote fontSize={20} />}
			/>
			<LinkItem link="/messages" title="Messages" icon={<BiMessageDots fontSize={20} />} />
		</VStack>
	</Box>
)

const SideLeftInDrawer = ({ onClose, isOpen }: { isOpen: boolean; onClose: any }) => (
	<Drawer isOpen={isOpen} placement="left" onClose={onClose}>
		<DrawerOverlay />
		<DrawerContent>
			<DrawerBody padding={4}>
				<HStack
					bg={'white'}
					zIndex={10}
					style={{
						top: '0px',
						position: 'sticky',
					}}
					spacing={5}
					w={'full'}
					h={'73px'}
				>
					<Box w={'50px'} h={'50px'} borderRadius={4} border={'1px solid red'}></Box>
					<HStack w={'full'} justifyContent={'space-between'}>
						<Text fontWeight={'bold'} fontSize={'xl'}>
							HUPROM
						</Text>
                        <CloseButton onClick={onClose}/>
					</HStack>
				</HStack>

				<VStack
					paddingTop={4}
					height={'calc( 100vh - 180px )'}
					overflow={'auto'}
					spacing={4}
				>
					<LinkGroup
						data={[
							{
								icon: <BsPerson fontSize={20} />,
								link: '/employees',
								title: 'Employees',
							},
							{
								icon: <IoExitOutline fontSize={20} />,
								link: '/leaves',
								title: 'Leaves',
							},
							{
								icon: <BsCheck2 fontSize={20} />,
								link: '/attendance',
								title: 'Attendance',
							},
							{
								icon: <IoAirplaneOutline fontSize={20} />,
								link: '/holidays',
								title: 'Holiday',
							},
						]}
						title="HR"
						icon={<AiOutlineUsergroupAdd fontSize={20} />}
					/>
					<LinkGroup
						data={[
							{
								icon: <AiOutlineFile fontSize={20} />,
								link: '/contracts',
								title: 'Contracts',
							},
							{
								icon: <AiOutlineProject fontSize={20} />,
								link: '/projects',
								title: 'Projects',
							},
						]}
						title="Work"
						icon={<IoIosGitNetwork fontSize={20} />}
					/>
					<LinkItem
						link="/events"
						title="Events"
						icon={<MdOutlineEvent fontSize={20} />}
					/>
					<LinkItem
						link="/notice-boards"
						title="Notice boards"
						icon={<MdOutlineEditNote fontSize={20} />}
					/>
					<LinkItem
						link="/messages"
						title="Messages"
						icon={<BiMessageDots fontSize={20} />}
					/>
				</VStack>
			</DrawerBody>

			<DrawerFooter>
				<Button variant="outline" mr={3}>
					Cancel
				</Button>
			</DrawerFooter>
		</DrawerContent>
	</Drawer>
)

export default function Navigation() {
	const [isLarge, setIsLarge] = useState(true)
	const { onCloseMenu, isOpenMenu } = useContext(AuthContext)
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
		<>
			{isLarge ? (
				<SideLeft />
			) : (
				<SideLeftInDrawer isOpen={isOpenMenu} onClose={onCloseMenu} />
			)}
		</>
	)
}
