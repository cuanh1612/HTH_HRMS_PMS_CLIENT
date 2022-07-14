import {
	Box,
	HStack,
	Text,
	VStack,
	useBreakpoint,
	Drawer,
	DrawerOverlay,
	DrawerContent,
	DrawerBody,
	CloseButton,
} from '@chakra-ui/react'
import { AuthContext } from 'contexts/AuthContext'
import React, { useState, useEffect, useContext } from 'react'
import {
	AiOutlineFile,
	AiOutlineHome,
	AiOutlineMail,
	AiOutlineProject,
	AiOutlineUsergroupAdd,
} from 'react-icons/ai'
import { BiMessageDots, BiTime } from 'react-icons/bi'
import { BsCheck2, BsPerson, BsPersonBadge } from 'react-icons/bs'
import { VscTasklist } from 'react-icons/vsc'
import { IoIosGitNetwork } from 'react-icons/io'
import { IoAirplaneOutline, IoDocumentTextOutline, IoExitOutline, IoVideocamOutline } from 'react-icons/io5'
import {
	MdOutlineAttachMoney,
	MdOutlineDashboard,
	MdOutlineDashboardCustomize,
	MdOutlineEditNote,
	MdOutlineEvent,
	MdOutlinePreview,
} from 'react-icons/md'
import LinkGroup from './LinkGroup'
import LinkItem from './LinkItem'
import { companyInfoQuery } from 'queries/companyInfo'
import Image from 'next/image'
import { GiSkills } from 'react-icons/gi'
import { RiSuitcaseLine } from 'react-icons/ri'

const LinkItems = () => {
	const { currentUser } = useContext(AuthContext)

	return (
		<>
			{currentUser?.role == 'Admin' && (
				<LinkGroup
					data={[
						{
							icon: <MdOutlineDashboardCustomize fontSize={20} />,
							link: '/dashboard',
							title: 'Admin dashboard',
						},
						{
							icon: <MdOutlineDashboard fontSize={20} />,
							link: '/private-dashboard',
							title: 'Private dashboard',
						},
					]}
					title="Dashboard"
					icon={<AiOutlineHome fontSize={20} />}
				/>
			)}
			{currentUser?.role == 'Employee' && (
				<LinkItem
					link="/private-dashboard"
					title="Dashboard"
					icon={<AiOutlineHome fontSize={20} />}
				/>
			)}
			{currentUser?.role == 'Client' && (
				<LinkItem
					link="/private-dashboard-client"
					title="Dashboard"
					icon={<AiOutlineHome fontSize={20} />}
				/>
			)}

			{currentUser?.role == 'Admin' && (
				<LinkItem link="/clients" title="Clients" icon={<BsPerson fontSize={20} />} />
			)}
			{currentUser?.role != 'Client' && (
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
			)}

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
					{
						icon: <VscTasklist fontSize={20} />,
						link: '/tasks',
						title: 'Tasks',
					},
					{
						icon: <BiTime fontSize={20} />,
						link: '/time-logs',
						title: 'Time Logs',
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
			{currentUser?.role != 'Client' && (
				<LinkItem
					link="/messages"
					title="Messages"
					icon={<BiMessageDots fontSize={20} />}
				/>
			)}
			{currentUser?.role == 'Admin' && (
				<>
					<LinkItem
						link="/salaries"
						title="Salaries"
						icon={<MdOutlineAttachMoney fontSize={20} />}
					/>
					<LinkGroup
						data={[
							{
								icon: <MdOutlineDashboard fontSize={20} />,
								link: '/dashboard-jobs',
								title: 'Dashboard',
							},
							{
								icon: <GiSkills fontSize={20} />,
								link: '/skills',
								title: 'Skills',
							},
							{
								icon: <RiSuitcaseLine fontSize={20} />,
								link: '/jobs',
								title: 'Jobs',
							},
							{
								icon: <IoDocumentTextOutline fontSize={20} />,
								link: '/job-applications',
								title: 'Job applications',
							},
							{
								icon: <AiOutlineMail fontSize={20} />,
								link: '/job-offer-letters',
								title: 'Offer letters',
							},
							{
								icon: <MdOutlineEvent fontSize={20} />,
								link: '/interviews',
								title: 'Interview schedule',
							},
							{
								icon: <MdOutlinePreview fontSize={20} />,
								link: '/recruit',
								title: 'Front website',
							},
						]}
						title="Recruit"
						icon={<BsPersonBadge fontSize={20} />}
					/>
				</>
			)}

			{currentUser?.role != 'Client' && (
				<LinkItem link="/rooms" title="Rooms" icon={<IoVideocamOutline fontSize={20} />} />
			)}
		</>
	)
}

const SideLeft = () => {

	//Get info company
	const { data: dataCompanyInfo } = companyInfoQuery()

	return (
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
				<Image src={'/assets/logo1.svg'} width={'50px'} height={'50px'} />
				<Text fontWeight={'bold'} fontSize={'xl'}>
					{dataCompanyInfo?.companyInfo.name}
				</Text>
			</HStack>

			<VStack
				paddingTop={4}
				paddingBottom={4}
				height={'calc( 100vh - 75px )'}
				overflow={'auto'}
				spacing={4}
			>
				<LinkItems />
			</VStack>
		</Box>
	)
}

const SideLeftInDrawer = ({ onClose, isOpen }: { isOpen: boolean; onClose: any }) => {

	//Get info company
	const { data: dataCompanyInfo } = companyInfoQuery()

	return (
		<Drawer isOpen={isOpen} placement="left" onClose={onClose}>
			<DrawerOverlay />
			<DrawerContent>
				<DrawerBody padding={4}>
					<HStack
						zIndex={10}
						style={{
							top: '0px',
							position: 'sticky',
						}}
						spacing={5}
						w={'full'}
						h={'73px'}
					>
						<Image src={'/assets/logo1.svg'} width={'50px'} height={'50px'} />

						<HStack w={'full'} justifyContent={'space-between'}>
							<Text fontWeight={'bold'} fontSize={'xl'}>
								{dataCompanyInfo?.companyInfo.name}
							</Text>
							<CloseButton onClick={onClose} />
						</HStack>
					</HStack>

					<VStack
						paddingTop={4}
						height={'calc( 100vh - 110px )'}
						overflow={'auto'}
						spacing={4}
					>
						<LinkItems />
					</VStack>
				</DrawerBody>
			</DrawerContent>
		</Drawer>
	)
}

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
