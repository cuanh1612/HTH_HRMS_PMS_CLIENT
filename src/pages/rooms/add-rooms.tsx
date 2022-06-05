import { Avatar, Box, Button, Grid, GridItem, HStack, Text } from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { Loading } from 'components/common'
import { Input, SelectMany, Textarea, TimePicker } from 'components/form'
import { AuthContext } from 'contexts/AuthContext'
import { createRoomMutation } from 'mutations/room'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { allClientsNormalQuery, allEmployeesNormalQuery } from 'queries'
import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { AiOutlineCheck } from 'react-icons/ai'
import { BsCalendarDate } from 'react-icons/bs'
import { MdOutlineDriveFileRenameOutline } from 'react-icons/md'
import 'react-quill/dist/quill.bubble.css'
import 'react-quill/dist/quill.snow.css'
import { IOption } from 'type/basicTypes'
import { createRoomForm } from 'type/form/basicFormType'
import { createRoomValidate } from 'utils/validate'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

export interface IAddRoomsProps {
	onCloseDrawer: () => void
}

export default function AddRooms({ onCloseDrawer }: IAddRoomsProps) {
	const { isAuthenticated, handleLoading, setToast, currentUser } = useContext(AuthContext)
	const router = useRouter()

	//State ----------------------------------------------------------------------
	const [optionEmployees, setOptionEmployees] = useState<IOption[]>([])
	const [optionClients, setOptionClients] = useState<IOption[]>([])

	//query ----------------------------------------------------------------------
	// get all employees
	const { data: allEmployees } = allEmployeesNormalQuery(isAuthenticated)

	// get all clients
	const { data: allClients } = allClientsNormalQuery(isAuthenticated)

	//mutation -------------------------------------------------------------------
	const [mutateCreRoom, { status: statusCreRoom, data: dataCreRoom }] =
		createRoomMutation(setToast)

	//User effect ---------------------------------------------------------------
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

	//Note when request success
	useEffect(() => {
		if (statusCreRoom === 'success') {
			//Close drawer when using drawer
			if (onCloseDrawer) {
				onCloseDrawer()
			}

			setToast({
				type: 'success',
				msg: dataCreRoom?.message as string,
			})
		}
	}, [statusCreRoom])

	//Set data option employees state
	useEffect(() => {
		if (allEmployees && allEmployees.employees) {
			let newOptionEmployees: IOption[] = []

			allEmployees.employees.map((employee) => {
				newOptionEmployees.push({
					label: (
						<>
							<HStack>
								<Avatar
									size={'xs'}
									name={employee.name}
									src={employee.avatar?.url}
								/>
								<Text>{employee.email}</Text>
							</HStack>
						</>
					),
					value: employee.id,
				})
			})

			setOptionEmployees(newOptionEmployees)
		}
	}, [allEmployees])

	//Set data option clients state
	useEffect(() => {
		if (allClients && allClients.clients) {
			let newOptionClients: IOption[] = []

			allClients.clients.map((client) => {
				newOptionClients.push({
					label: (
						<>
							<HStack>
								<Avatar size={'xs'} name={client.name} src={client.avatar?.url} />
								<Text>{client.email}</Text>
							</HStack>
						</>
					),
					value: client.id,
				})
			})

			setOptionClients(newOptionClients)
		}
	}, [allClients])

	// setForm and submit form create new zooms -------------------------------
	const formSetting = useForm<createRoomForm>({
		defaultValues: {
			title: '',
			start_time: '',
			description: '',
			date: undefined,
			employees: undefined,
			clients: undefined,
		},
		resolver: yupResolver(createRoomValidate),
	})

	const { handleSubmit } = formSetting

	const onSubmit = async (values: createRoomForm) => {
		if (!currentUser) {
			setToast({
				msg: 'Please login first',
				type: 'error',
			})
		} else {
			values.empl_create = currentUser.id
			mutateCreRoom(values)
		}
	}

	return (
		<>
			<Box pos="relative" p={6} as={'form'} h="auto" onSubmit={handleSubmit(onSubmit)}>
				<Grid templateColumns="repeat(2, 1fr)" gap={6}>
					<GridItem w="100%" colSpan={[2, 1]}>
						<Input
							name="title"
							label="Title"
							icon={
								<MdOutlineDriveFileRenameOutline
									fontSize={'20px'}
									color="gray"
									opacity={0.6}
								/>
							}
							form={formSetting}
							placeholder="Enter Room Title"
							type="text"
							required
						/>
					</GridItem>

					<GridItem w="100%" colSpan={[2]}>
						<Textarea
							placeholder="Enter description room"
							name="description"
							label="Description"
							form={formSetting}
							required
						/>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<Input
							name="date"
							label="Start On Date"
							icon={<BsCalendarDate fontSize={'20px'} color="gray" opacity={0.6} />}
							form={formSetting}
							type="date"
							required
						/>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<TimePicker
							form={formSetting}
							name={'start_time'}
							label={'Starts On Time'}
							required
						/>
					</GridItem>

					<GridItem w="100%" colSpan={[2]}>
						<SelectMany
							form={formSetting}
							label={'Select Employee'}
							name={'employees'}
							required={true}
							options={optionEmployees}
						/>
					</GridItem>

					<GridItem w="100%" colSpan={[2]}>
						<SelectMany
							form={formSetting}
							label={'Select Client'}
							name={'clients'}
							required={true}
							options={optionClients}
						/>
					</GridItem>
				</Grid>

				<Button
					color={'white'}
					bg={'hu-Green.normal'}
					transform="auto"
					_hover={{ bg: 'hu-Green.normalH', scale: 1.05 }}
					_active={{
						bg: 'hu-Green.normalA',
						scale: 1,
					}}
					leftIcon={<AiOutlineCheck />}
					mt={6}
					type="submit"
				>
					Save
				</Button>

				{statusCreRoom === 'running' && <Loading />}
			</Box>
		</>
	)
}
