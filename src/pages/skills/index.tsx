import { Box, Button, useDisclosure, VStack } from '@chakra-ui/react'
import { AlertDialog, Func, FuncCollapse, Head, Table } from 'components/common'
import { Drawer } from 'components/Drawer'
import { Input } from 'components/filter'
import { ClientLayout } from 'components/layouts'
import { AuthContext } from 'contexts/AuthContext'
import { deleteManySkillMutation, deleteSkillMutation } from 'mutations/skill'

import { useRouter } from 'next/router'
import { allSkillsQuery } from 'queries/skill'
import { useContext, useEffect, useState } from 'react'
import { CSVLink } from 'react-csv'
import { AiOutlineDelete, AiOutlineSearch } from 'react-icons/ai'
import { BiExport } from 'react-icons/bi'
import { IoAdd } from 'react-icons/io5'
import { VscFilter } from 'react-icons/vsc'
import { NextLayout } from 'type/element/layout'
import { IFilter, TColumn } from 'type/tableTypes'
import { SkillsColumn } from 'utils/columns'
import AddSkill from './add-skills'
import UpdateSkill from './update-skills'

const Skill: NextLayout = () => {
	const { isAuthenticated, handleLoading, currentUser, setToast } = useContext(AuthContext)
	const router = useRouter()

	// set loading table
	const [isLoading, setIsLoading] = useState(true)
	// set filter
	const [filter, setFilter] = useState<IFilter>({
		columnId: '',
		filterValue: '',
	})
	const [idSkill, setIdSkill] = useState<number | null>(null)
	// is reset table
	const [isResetFilter, setIsReset] = useState(false)
	// data select to delete all
	const [dataSl, setDataSl] = useState<Array<number> | null>()
	//State download csv
	const [dataCSV, setDataCSV] = useState<any[]>([])

	//Setup drawer --------------------------------------------------------------
	const { isOpen: isOpenAdd, onOpen: onOpenAdd, onClose: onCloseAdd } = useDisclosure()
	const { isOpen: isOpenUpdate, onOpen: onOpenUpdate, onClose: onCloseUpdate } = useDisclosure()
	// set isOpen of drawer to filters
	const { isOpen: isOpenFilter, onOpen: onOpenFilter, onClose: onCloseFilter } = useDisclosure()
	// set isOpen of dialog to delete one
	const { isOpen: isOpenDialogDl, onOpen: onOpenDl, onClose: onCloseDl } = useDisclosure()
	// set isOpen of dialog to delete many
	const {
		isOpen: isOpenDialogDlMany,
		onOpen: onOpenDlMany,
		onClose: onCloseDlMany,
	} = useDisclosure()

	//Query ---------------------------------------------------------------------
	const { data: dataAllSkills, mutate: refetchAllSkills } = allSkillsQuery(isAuthenticated)

	// mutate
	const [deleteOne, { status: statusDlOne, data: dataDl }] = deleteSkillMutation(setToast)
	const [deleteMany, { status: statusDlMany, data: dataDlMany }] =
		deleteManySkillMutation(setToast)

	//Setup download csv --------------------------------------------------------
	const headersCSV = [
		{ label: 'id', key: 'id' },
		{ label: 'name', key: 'name' },
	]

	//User effect ---------------------------------------------------------------
	//Handle check logged in
	useEffect(() => {
		if (isAuthenticated) {
			handleLoading(false)
		} else {
			if (isAuthenticated === false) {
				router.push('/login')
			}
		}
	}, [isAuthenticated])

	useEffect(() => {
		if (dataAllSkills) {
			setIsLoading(false)

			if (dataAllSkills.skills) {
				// Set data csv
				const dataCSV: any[] = dataAllSkills.skills.map((skill) => ({
					id: skill.id,
					name: skill.name,
				}))
				setDataCSV(dataCSV)
			}
		}
	}, [dataAllSkills])

	useEffect(() => {
		if (statusDlOne == 'success' && dataDl) {
			setToast({
				type: statusDlOne,
				msg: dataDl.message,
			})
			refetchAllSkills()
		}
	}, [statusDlOne])

	useEffect(() => {
		if (statusDlMany == 'success' && dataDlMany) {
			setToast({
				type: statusDlMany,
				msg: dataDlMany.message,
			})
			setDataSl([])
			refetchAllSkills()
		}
	}, [statusDlMany])

	const columns: TColumn[] = SkillsColumn({
		currentUser,
		onDelete: (id: number) => {
			setIdSkill(id)
			onOpenDl()
		},
		onUpdate: (id: number) => {
			setIdSkill(id)
			onOpenUpdate()
		},
	})

	return (
		<Box pb={8}>
			<Head title="Skills" />

			<Box className='function'>
				<FuncCollapse>
					{currentUser && currentUser.role === 'Admin' && (
						<>
							<Func
								icon={<IoAdd />}
								description={'Add new notice by form'}
								title={'Add new'}
								action={onOpenAdd}
							/>
							<CSVLink filename={'skills.csv'} headers={headersCSV} data={dataCSV}>
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
								description={'Delete all notices you selected'}
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
				</FuncCollapse>
			</Box>

			<Box className="table">
				<Table
					data={dataAllSkills?.skills || []}
					columns={columns}
					isLoading={isLoading}
					isSelect={currentUser?.role === 'Admin'}
					selectByColumn="id"
					setSelect={(data: Array<number>) => setDataSl(data)}
					filter={filter}
					isResetFilter={isResetFilter}
				/>
			</Box>

			<Drawer size="xl" title="Add Skills" onClose={onCloseAdd} isOpen={isOpenAdd}>
				<AddSkill onCloseDrawer={onCloseAdd} />
			</Drawer>
			<Drawer size="xl" title="Update Skills" onClose={onCloseUpdate} isOpen={isOpenUpdate}>
				<UpdateSkill onCloseDrawer={onCloseUpdate} skillId={idSkill} />
			</Drawer>
			{/* alert dialog when delete one */}
			<AlertDialog
				handleDelete={() => {
					setIsLoading(true)
					deleteOne(idSkill)
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
						setIsLoading(true)
						deleteMany({
							skills: dataSl,
						})
					}
				}}
				title="Are you sure to delete all?"
				content="You will not be able to recover the deleted record!"
				isOpen={isOpenDialogDlMany}
				onClose={onCloseDlMany}
			/>

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
						columnId={'name'}
						label="Name"
						placeholder="Enter notice"
						icon={<AiOutlineSearch fontSize={'20px'} color="gray" opacity={0.6} />}
						type={'text'}
					/>
				</VStack>
			</Drawer>
		</Box>
	)
}
Skill.getLayout = ClientLayout

export default Skill
