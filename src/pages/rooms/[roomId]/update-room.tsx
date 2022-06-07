import { Avatar, Box, Button, Grid, GridItem, HStack, Text } from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { Loading } from 'components/common'
import { Input, SelectMany, Textarea, TimePicker } from 'components/form'
import { AuthContext } from 'contexts/AuthContext'
import { updateRoomMutation } from 'mutations/room'
import { useRouter } from 'next/router'
import { allClientsNormalQuery, allEmployeesNormalQuery } from 'queries'
import { detailRoomQuery } from 'queries/room'
import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { AiOutlineCheck } from 'react-icons/ai'
import { BsCalendarDate } from 'react-icons/bs'
import { MdOutlineDriveFileRenameOutline } from 'react-icons/md'
import 'react-quill/dist/quill.bubble.css'
import 'react-quill/dist/quill.snow.css'
import { IOption } from 'type/basicTypes'
import { updateRoomForm } from 'type/form/basicFormType'
import { updateRoomValidate } from 'utils/validate'


export interface IUpdateRoomProps {
	onCloseDrawer?: () => void
	roomId?: string | number
}

export default function UpdateRoom({ roomId: RoomIdProp, onCloseDrawer }: IUpdateRoomProps) {
	const { isAuthenticated, handleLoading, setToast, currentUser } = useContext(AuthContext)
	const router = useRouter()
	const { roomId: roomIdRouter } = router.query

	//State -------------------------------------------------------------
	const [optionEmployees, setOptionEmployees] = useState<IOption[]>([])
	const [optionClients, setOptionClients] = useState<IOption[]>([])
	const [selectedOptionEmployees, setSelectedOptionEmployees] = useState<IOption[]>([])
	const [selectedOptionClients, setSelectedOptionClients] = useState<IOption[]>([])

	//Query -------------------------------------------------------------
	const { data: dataDetailRoom } = detailRoomQuery(
		isAuthenticated,
		RoomIdProp || (roomIdRouter as string)
	)

	// get all employees
	const { data: allEmployees } = allEmployeesNormalQuery(isAuthenticated)

	// get all clients
	const { data: allClients } = allClientsNormalQuery(isAuthenticated)

	//mutation -----------------------------------------------------------
	const [mutateUpdateRoom, { status: statusUpdateRoom, data: dataUpdateRoom }] =
		updateRoomMutation(setToast)

	// setForm and submit form update room ------------------------
	const formSetting = useForm<updateRoomForm>({
		defaultValues: {
			title: '',
			start_time: '',
			description: '',
			date: undefined,
			employees: undefined,
			clients: undefined,
		},
		resolver: yupResolver(updateRoomValidate),
	})

	const { handleSubmit } = formSetting

	const onSubmit = async (values: updateRoomForm) => {
		mutateUpdateRoom({
			inputUpdate: values,
			roomId: RoomIdProp || (roomIdRouter as string),
		})
	}

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
		if (statusUpdateRoom === 'success') {
			if (onCloseDrawer) {
				onCloseDrawer()
			}

			setToast({
				type: 'success',
				msg: dataUpdateRoom?.message as string,
			})
		}
	}, [statusUpdateRoom])

	//Set data option employees state
	useEffect(() => {
		if (allEmployees && allEmployees.employees && currentUser) {
			let newOptionEmployees: IOption[] = []

			allEmployees.employees.map((employee) => {
				if (currentUser.id != employee.id) {
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
				}
			})

			setOptionEmployees(newOptionEmployees)
		}
	}, [allEmployees, currentUser])

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

	//Chane data form when have data detail event
	useEffect(() => {
		if (dataDetailRoom && dataDetailRoom.room) {
			//Set data selected option employee
			if (dataDetailRoom.room.employees) {
				let newSelectedOptionEmployees: IOption[] = []

				dataDetailRoom.room.employees.map((employee) => {
					newSelectedOptionEmployees.push({
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
						value: employee.email,
					})
				})

				setSelectedOptionEmployees(newSelectedOptionEmployees)
			}

			//Set data selected option clients
			if (dataDetailRoom.room.clients) {
				let newSelectedOptionClients: IOption[] = []

				dataDetailRoom.room.clients.map((client) => {
					newSelectedOptionClients.push({
						label: (
							<>
								<HStack>
									<Avatar
										size={'xs'}
										name={client.name}
										src={client.avatar?.url}
									/>
									<Text>{client.email}</Text>
								</HStack>
							</>
						),
						value: client.email,
					})
				})

				setSelectedOptionClients(newSelectedOptionClients)
			}

			if (allClients && allClients.clients) {
				let newOptionClients: IOption[] = []

				allClients.clients.map((client) => {
					newOptionClients.push({
						label: (
							<>
								<HStack>
									<Avatar
										size={'xs'}
										name={client.name}
										src={client.avatar?.url}
									/>
									<Text>{client.email}</Text>
								</HStack>
							</>
						),
						value: client.email,
					})
				})

				setOptionClients(newOptionClients)
			}

			//set data form
			formSetting.reset({
				title: dataDetailRoom.room.title.replace(/-/g, ' ') || '',
				start_time: dataDetailRoom.room.start_time,
				description: dataDetailRoom.room.description || '',
				date: dataDetailRoom.room.date || undefined,
				employees:
					dataDetailRoom.room.employees.map((employee) => employee.id) || undefined,
				clients: dataDetailRoom.room.clients.map((client) => client.id) || undefined,
			})
		}
	}, [dataDetailRoom])

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
							selectedOptions={selectedOptionEmployees}
						/>
					</GridItem>

					<GridItem w="100%" colSpan={[2]}>
						<SelectMany
							form={formSetting}
							label={'Select Client'}
							name={'clients'}
							required={true}
							options={optionClients}
							selectedOptions={selectedOptionClients}
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

				{statusUpdateRoom === 'running' && <Loading />}
			</Box>
		</>
	)
}
