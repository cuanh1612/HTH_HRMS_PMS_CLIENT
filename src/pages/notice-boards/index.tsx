import {
	Button,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Text,
	useDisclosure,
	Drawer as CDrawer,
	DrawerOverlay,
	DrawerContent,
	DrawerCloseButton,
	DrawerHeader,
	DrawerBody,
	VStack,
} from '@chakra-ui/react'
import { AlertDialog, Table } from 'components/common'
import { Drawer } from 'components/Drawer'
import { DateRange, Input, Select } from 'components/filter'
import { ClientLayout } from 'components/layouts'
import { AuthContext } from 'contexts/AuthContext'
import { deleteNoticeMutation, deleteNoticesMutation } from 'mutations'
import { useRouter } from 'next/router'
import { allNoticeBoardQuery } from 'queries'
import { useContext, useEffect, useState } from 'react'
import { AiOutlineSearch } from 'react-icons/ai'
import { IoEyeOutline } from 'react-icons/io5'
import { MdOutlineDeleteOutline, MdOutlineMoreVert } from 'react-icons/md'
import { RiPencilLine } from 'react-icons/ri'
import { NextLayout } from 'type/element/layout'
import { IFilter, TColumn } from 'type/tableTypes'
import { dateFilter, selectFilter, textFilter } from 'utils/tableFilters'
import AddNoticeBoard from './add-notice-boards'
import UpdateNoticeBoard from './[noticeBoardId]/update'

export interface IProjectProps {}

const NoticeBoard: NextLayout = ({}: IProjectProps) => {
	const { isAuthenticated, handleLoading, setToast } = useContext(AuthContext)
	const router = useRouter()

	//State ---------------------------------------------------------------------
	const [noticeId, setNoticeId] = useState<number>()
	// set filter
	const [filter, setFilter] = useState<IFilter>({
		columnId: '',
		filterValue: '',
	})

	// data select to delete all
	const [dataSl, setDataSl] = useState<Array<number> | null>()

	// set loading table
	const [isLoading, setIsloading] = useState(true)

	// is reset table
	const [isResetFilter, setIsReset] = useState(false)

	//Setup drawer --------------------------------------------------------------
	const { isOpen: isOpenAdd, onOpen: onOpenAdd, onClose: onCloseAdd } = useDisclosure()
	const { isOpen: isOpenUpdate, onOpen: onOpenUpdate, onClose: onCloseUpdate } = useDisclosure()

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

	// query
	const { data: allNotices, mutate: refetchNotices } = allNoticeBoardQuery(isAuthenticated)

	// mutation
	// delete one
	const [deleteNotice, { status: statusDlOne, data: dataDlOne }] = deleteNoticeMutation(setToast)

	// delete many
	const [deleteMany, { status: statusDlMany, data: dataDlMany }] = deleteNoticesMutation(setToast)
	//User effect ---------------------------------------------------------------

	// header ----------------------------------------
	const columns: TColumn[] = [
		{
			Header: 'Notice board',
			columns: [
				{
					Header: 'Id',
					accessor: 'id',
					width: 80,
					minWidth: 80,
					disableResizing: true,
					Cell: ({ value }) => {
						return value
					},
				},
				{
					Header: 'Notice',
					accessor: 'heading',
					filter: textFilter(['heading']),
					minWidth: 80,
					Cell: ({ value }) => {
						return <Text isTruncated>{value}</Text>
					},
				},
				{
					Header: 'Date',
					accessor: 'updatedAt',
					filter: dateFilter(['updatedAt']),
					minWidth: 180,
					width: 180,
					disableResizing: true,
					Cell: ({ value }) => {
						return (
							<Text isTruncated>{`${new Date(value).getDate()}-${
								new Date(value).getUTCMonth() + 1
							}-${new Date(value).getFullYear()}`}</Text>
						)
					},
				},
				{
					Header: 'To',
					accessor: 'notice_to',
					filter: selectFilter(['notice_to']),
					minWidth: 180,
					width: 180,
					disableResizing: true,
					Cell: ({ value }) => {
						return <Text isTruncated>{value}</Text>
					},
				},
				{
					Header: 'Action',
					accessor: 'action',
					disableResizing: true,
					width: 120,
					minWidth: 120,
					disableSortBy: true,
					Cell: ({ row }) => (
						<Menu>
							<MenuButton as={Button} paddingInline={3}>
								<MdOutlineMoreVert />
							</MenuButton>
							<MenuList>
								<MenuItem icon={<IoEyeOutline fontSize={'15px'} />}>View</MenuItem>
								<MenuItem
									onClick={() => {
										setNoticeId(Number(row.values['id']))
										onOpenUpdate()
									}}
									icon={<RiPencilLine fontSize={'15px'} />}
								>
									Edit
								</MenuItem>

								<MenuItem
									onClick={() => {
										setNoticeId(Number(row.values['id']))
										onOpenDl()
									}}
									icon={<MdOutlineDeleteOutline fontSize={'15px'} />}
								>
									Delete
								</MenuItem>
							</MenuList>
						</Menu>
					),
				},
			],
		},
	]

	// set loading == false when get all notices successfully
	useEffect(() => {
		if (allNotices) {
			console.log(allNotices)
			setIsloading(false)
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
		}
	}, [statusDlMany])

	return (
		<>
			<Button colorScheme="blue" onClick={onOpenAdd}>
				Add notice
			</Button>

			<Button disabled={!dataSl || dataSl.length == 0 ? true : false} onClick={onOpenDlMany}>
				Delete all
			</Button>

			<Button
				onClick={() => {
					setIsReset(true)
					setTimeout(() => {
						setIsReset(false)
					}, 1000)
				}}
			>
				reset filter
			</Button>

			<Button onClick={onOpenFilter}>open filter</Button>

			<Table
				data={allNotices?.noticeBoards || []}
				columns={columns}
				isLoading={isLoading}
				isSelect
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

			<CDrawer isOpen={isOpenFilter} placement="right" onClose={onCloseFilter}>
				<DrawerOverlay />
				<DrawerContent>
					<DrawerCloseButton />
					<DrawerHeader>Filters</DrawerHeader>

					<DrawerBody>
						<VStack spacing={5}>
							<Input
								handleSearch={(data: IFilter) => {
									setFilter(data)
								}}
								columnId={'heading'}
								label="Notice"
								placeholder="Enter notice"
								icon={
									<AiOutlineSearch fontSize={'20px'} color="gray" opacity={0.6} />
								}
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
						</VStack>
					</DrawerBody>
				</DrawerContent>
			</CDrawer>
		</>
	)
}

NoticeBoard.getLayout = ClientLayout

export default NoticeBoard
