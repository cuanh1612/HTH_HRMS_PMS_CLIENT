import {
	Button,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Text,
	useDisclosure,
	VStack,
	Collapse,
	SimpleGrid,
	HStack,
	Box,
} from '@chakra-ui/react'
import { AlertDialog, Func, Table } from 'components/common'
import { Drawer } from 'components/Drawer'
import { DateRange, Input, Select } from 'components/filter'
import { ClientLayout } from 'components/layouts'
import { AuthContext } from 'contexts/AuthContext'
import { deleteNoticeMutation, deleteNoticesMutation } from 'mutations'
import { useRouter } from 'next/router'
import { allNoticeBoardQuery, allNoticeBoardToQuery } from 'queries'
import { useContext, useEffect, useState } from 'react'
import {
	AiOutlineCaretDown,
	AiOutlineCaretUp,
	AiOutlineDelete,
	AiOutlineSearch,
} from 'react-icons/ai'
import { IoAdd, IoEyeOutline } from 'react-icons/io5'
import { MdOutlineDeleteOutline, MdOutlineEvent, MdOutlineMoreVert } from 'react-icons/md'
import { RiPencilLine } from 'react-icons/ri'
import { NextLayout } from 'type/element/layout'
import { IFilter, TColumn } from 'type/tableTypes'
import { dateFilter, selectFilter, textFilter } from 'utils/tableFilters'
import AddNoticeBoard from './add-notice-boards'
import UpdateNoticeBoard from './[noticeBoardId]/update'
import { CSVLink } from 'react-csv'
import { VscFilter } from 'react-icons/vsc'
import { BiExport } from 'react-icons/bi'
import { noticeBoardColumn } from 'utils/columns'

export interface IProjectProps {}

const NoticeBoard: NextLayout = ({}: IProjectProps) => {
	const { isAuthenticated, handleLoading, setToast, currentUser, socket } =
		useContext(AuthContext)
	const router = useRouter()

	//State ---------------------------------------------------------------------
	const [noticeId, setNoticeId] = useState<number>()
	// set filter
	const [filter, setFilter] = useState<IFilter>({
		columnId: '',
		filterValue: '',
	})

	//state csv
	const [dataCSV, setDataCSV] = useState<any[]>([])

	// data select to delete all
	const [dataSl, setDataSl] = useState<Array<number> | null>()

	// set loading table
	const [isLoading, setIsloading] = useState(true)

	// is reset table
	const [isResetFilter, setIsReset] = useState(false)

	//Setup drawer --------------------------------------------------------------
	const { isOpen: isOpenAdd, onOpen: onOpenAdd, onClose: onCloseAdd } = useDisclosure()
	const { isOpen: isOpenUpdate, onOpen: onOpenUpdate, onClose: onCloseUpdate } = useDisclosure()

	//set isopen of function
	const { isOpen, onToggle } = useDisclosure({
		defaultIsOpen: true,
	})

	// set isOpen of dialog to delete one
	const { isOpen: isOpenDialogDl, onOpen: onOpenDl, onClose: onCloseDl } = useDisclosure()

	// set isOpen of drawer to filters
	const { isOpen: isOpenFilter, onOpen: onOpenFilter, onClose: onCloseFilter } = useDisclosure()

	// set isOpen of dialog to delete one
	const {
		isOpen: isOpenDialogDlMany,
		onOpen: onOpenDlMany,
		onClose: onCloseDlMany,
	} = useDisclosure()

	//Setup download csv --------------------------------------------------------
	const headersCSV = [
		{ label: 'id', key: 'id' },
		{ label: 'details', key: 'details' },
		{ label: 'heading', key: 'heading' },
		{ label: 'notice_to', key: 'notice_to' },
		{ label: 'createdAt', key: 'createdAt' },
		{ label: 'updatedAt', key: 'updatedAt' },
	]

	// query
	const { data: allNotices, mutate: refetchNotices } =
		currentUser?.role === 'Admin'
			? allNoticeBoardQuery(isAuthenticated)
			: currentUser?.role === 'Employee'
			? allNoticeBoardToQuery(isAuthenticated, 'Employees')
			: allNoticeBoardToQuery(isAuthenticated, 'Clients')

	// mutation
	// delete one
	const [deleteNotice, { status: statusDlOne, data: dataDlOne }] = deleteNoticeMutation(setToast)

	// delete many
	const [deleteMany, { status: statusDlMany, data: dataDlMany }] = deleteNoticesMutation(setToast)
	//User effect ---------------------------------------------------------------

	// header ----------------------------------------
	const columns: TColumn[] = noticeBoardColumn({
		currentUser,
		onUpdate: (id: number) => {
			setNoticeId(id)
			onOpenUpdate()
		},
		onDelete: (id: number) => {
			setNoticeId(id)
			onOpenDl()
		},
	})

	// set loading == false when get all notices successfully
	useEffect(() => {
		if (allNotices) {
			console.log(allNotices)
			setIsloading(false)

			if (allNotices.noticeBoards) {
				//Set data csv
				const dataCSV: any[] = allNotices.noticeBoards.map((noticeboard) => ({
					id: noticeboard.id,
					details: noticeboard.details,
					heading: noticeboard.heading,
					notice_to: noticeboard.notice_to,
					createdAt: noticeboard.createdAt,
					updatedAt: noticeboard.updatedAt,
				}))

				setDataCSV(dataCSV)
			}
		}
	}, [allNotices])

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

	// when delete one successfully
	useEffect(() => {
		if (statusDlOne == 'success' && dataDlOne) {
			setToast({
				type: 'success',
				msg: dataDlOne.message,
			})
			refetchNotices()
			setIsloading(false)
			if (socket) {
				socket.emit('newNoticeBoard')
			}
		}
	}, [statusDlOne])

	// when delete many successfully
	useEffect(() => {
		if (statusDlMany == 'success' && dataDlMany) {
			setToast({
				type: 'success',
				msg: dataDlMany.message,
			})
			setDataSl([])
			refetchNotices()
			setIsloading(false)

			if (socket) {
				socket.emit('newNoticeBoard')
			}
		}
	}, [statusDlMany])

	//Join room socket
	useEffect(() => {
		//Join room
		if (socket) {
			socket.emit('joinRoomNoticeBoard')

			socket.on('getNewNoticeBoard', () => {
				refetchNotices()
			})
		}

		//Leave room
		function leaveRoom() {
			if (socket) {
				socket.emit('leaveRoomNoticeBoard')
			}
		}

		return leaveRoom
	}, [socket])

	return (
		<Box w={'full'} pb={8}>
			<HStack
				_hover={{
					textDecoration: 'none',
				}}
				onClick={onToggle}
				color={'gray.500'}
				cursor={'pointer'}
				userSelect={'none'}
			>
				<Text fontWeight={'semibold'}>Function</Text>
				{isOpen ? <AiOutlineCaretDown /> : <AiOutlineCaretUp />}
			</HStack>
			<Collapse in={isOpen} animateOpacity>
				<SimpleGrid
					w={'full'}
					cursor={'pointer'}
					columns={[1, 2, 2, 3, null, 4]}
					spacing={10}
					pt={3}
				>
					{currentUser && currentUser.role === 'Admin' && (
						<>
							<Func
								icon={<IoAdd />}
								description={'Add new client by form'}
								title={'Add new'}
								action={onOpenAdd}
							/>
							<CSVLink
								filename={'noticeBoards.csv'}
								headers={headersCSV}
								data={dataCSV}
							>
								<Func
									icon={<BiExport />}
									description={'export to csv'}
									title={'export'}
									action={() => {}}
								/>
							</CSVLink>
							<Func
								icon={<AiOutlineDelete />}
								title={'Delete all'}
								description={'Delete all client you selected'}
								action={onOpenDlMany}
								disabled={!dataSl || dataSl.length == 0 ? true : false}
							/>
						</>
					)}
					<Func
						icon={<VscFilter />}
						description={'Open draw to filter'}
						title={'filter'}
						action={onOpenFilter}
					/>
					<Func
						icon={<MdOutlineEvent />}
						title={'Calendar'}
						description={'show tasks as calendar'}
						action={() => {
							router.push('/time-logs/calendar')
						}}
					/>
				</SimpleGrid>
			</Collapse>
			<br />

			<Table
				data={allNotices?.noticeBoards || []}
				columns={columns}
				isLoading={isLoading}
				isSelect={currentUser?.role === 'Admin'}
				selectByColumn="id"
				setSelect={(data: Array<number>) => setDataSl(data)}
				filter={filter}
				isResetFilter={isResetFilter}
			/>

			{/* alert dialog when delete one */}
			<AlertDialog
				handleDelete={() => {
					setIsloading(true)
					deleteNotice(noticeId)
				}}
				title="Are you sure?"
				content="You will not be able to recover the deleted record!"
				isOpen={isOpenDialogDl}
				onClose={onCloseDl}
			/>

			{/* alert dialog when delete many */}
			<AlertDialog
				handleDelete={() => {
					if (dataSl) {
						setIsloading(true)
						deleteMany(dataSl)
					}
				}}
				title="Are you sure to delete all?"
				content="You will not be able to recover the deleted record!"
				isOpen={isOpenDialogDlMany}
				onClose={onCloseDlMany}
			/>

			<Drawer size="xl" title="Add notice board" onClose={onCloseAdd} isOpen={isOpenAdd}>
				<AddNoticeBoard onCloseDrawer={onCloseAdd} />
			</Drawer>

			<Drawer
				size="xl"
				title="Add notice board"
				onClose={onCloseUpdate}
				isOpen={isOpenUpdate}
			>
				<UpdateNoticeBoard onCloseDrawer={onCloseUpdate} noticeBoardIdProp={noticeId} />
			</Drawer>

			<Drawer
				isOpen={isOpenFilter}
				size={'xs'}
				onClose={onCloseFilter}
				title={'Filter'}
				footer={
					<Button
						onClick={() => {
							setIsReset(true)
							setTimeout(() => {
								setIsReset(false)
							}, 1000)
						}}
					>
						reset
					</Button>
				}
			>
				<VStack p={6} spacing={5}>
					<Input
						handleSearch={(data: IFilter) => {
							setFilter(data)
						}}
						columnId={'heading'}
						label="Notice"
						placeholder="Enter notice"
						icon={<AiOutlineSearch fontSize={'20px'} color="gray" opacity={0.6} />}
						type={'text'}
					/>
					<DateRange
						handleSelect={(date: { from: Date; to: Date }) => {
							setFilter({
								columnId: 'updatedAt',
								filterValue: date,
							})
						}}
						label="Select date"
					/>

					{currentUser?.role === 'Admin' && (
						<Select
							options={[
								{
									label: 'Employees',
									value: 'Employees',
								},
								{
									label: 'Clients',
									value: 'Clients',
								},
							]}
							handleSearch={(data: IFilter) => {
								setFilter(data)
							}}
							columnId={'notice_to'}
							label="To"
							placeholder="Select role"
						/>
					)}
				</VStack>
			</Drawer>
		</Box>
	)
}

NoticeBoard.getLayout = ClientLayout

export default NoticeBoard
