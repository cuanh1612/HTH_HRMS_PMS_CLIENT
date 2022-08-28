import {
	Avatar,
	Box,
	Button,
	Checkbox,
	Grid,
	GridItem,
	HStack,
	Text,
	VStack,
} from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { Editor, Loading } from 'components/common'
import { Input, InputNumber, Select, SelectMany, TimePicker } from 'components/form'
import { AuthContext } from 'contexts/AuthContext'
import { createEventMutation } from 'mutations'
import { useRouter } from 'next/router'
import { allClientsNormalQuery, allEmployeesNormalQuery, allEventsQuery } from 'queries'
import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { AiOutlineBgColors, AiOutlineCheck } from 'react-icons/ai'
import { BsCalendarDate } from 'react-icons/bs'
import { MdOutlineDriveFileRenameOutline, MdPlace } from 'react-icons/md'
import { IOption } from 'type/basicTypes'
import { createEventForm } from 'type/form/basicFormType'
import { dataTypeRepeat } from 'utils/basicData'
import { compareDateTime } from 'utils/time'
import { createEventValidate } from 'utils/validate'

export interface IAddEventProps {
	onCloseDrawer: () => void
}

export default function AddEvent({ onCloseDrawer }: IAddEventProps) {
	const { isAuthenticated, handleLoading, setToast, socket } = useContext(AuthContext)
	const router = useRouter()

	//State ----------------------------------------------------------------------
	const [description, setDescription] = useState<string>('')
	const [optionEmployees, setOptionEmployees] = useState<IOption[]>([])
	const [optionClients, setOptionClients] = useState<IOption[]>([])
	const [isRepeatEvent, setIsRepeatEvent] = useState<boolean>(false)

	//query ----------------------------------------------------------------------
	// get all employees
	const { data: allEmployees } = allEmployeesNormalQuery(isAuthenticated)

	// get all clients
	const { data: allClients } = allClientsNormalQuery(isAuthenticated)

	// refetch all event
	const { mutate: refetchAllEvents } = allEventsQuery(isAuthenticated)

	//mutation -------------------------------------------------------------------
	const [mutateCreEvent, { status: statusCreEvent, data: dataCreEvent }] =
		createEventMutation(setToast)

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

	//Set data option employees state
	useEffect(() => {
		if (allEmployees && allEmployees.employees) {
			const newOptionEmployees: IOption[] = []

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
					value: employee.email,
				})
			})

			setOptionEmployees(newOptionEmployees)
		}
	}, [allEmployees])

	//Set data option clients state
	useEffect(() => {
		if (allClients && allClients.clients) {
			const newOptionClients: IOption[] = []

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
					value: client.email,
				})
			})

			setOptionClients(newOptionClients)
		}
	}, [allClients])

	//Note when request success
	useEffect(() => {
		if (statusCreEvent === 'success') {
			//Close drawer when using drawer
			if (onCloseDrawer) {
				onCloseDrawer()
			}

			if (socket) {
				socket.emit('newEvent')
			}

			setToast({
				type: statusCreEvent,
				msg: dataCreEvent?.message as string,
			})

			refetchAllEvents()

			if (socket) {
				socket.emit('newEvent')
			}
		}
	}, [statusCreEvent])

	// setForm and submit form create new contract -------------------------------
	const formSetting = useForm<createEventForm>({
		defaultValues: {
			name: '',
			color: '#FF0000',
			where: '',
			starts_on_date: undefined,
			ends_on_date: undefined,
			employeeEmails: [],
			clientEmails: [],
			repeatEvery: 1,
			cycles: 1,
			typeRepeat: undefined,
			starts_on_time: '',
			ends_on_time: '',
		},
		resolver: yupResolver(createEventValidate),
	})

	const { handleSubmit } = formSetting

	const onSubmit = async (values: createEventForm) => {
		if (!description) {
			setToast({
				msg: 'Please enter field description',
				type: 'warning',
			})
		} else {
			//Check time valid create event
			const isValidTime = compareDateTime(
				values.starts_on_date,
				values.ends_on_date,
				values.starts_on_time,
				values.ends_on_time
			)

			if (isValidTime) {
				return setToast({
					msg: 'Ends on time cannot be less than starts on time',
					type: 'warning',
				})
			} else {
				//Set value submit
				values.description = description
				values.isRepeat = isRepeatEvent
				if (!isRepeatEvent) {
					values.repeatEvery = undefined
					values.cycles = undefined
				} else if (values.repeatEvery && values.cycles) {
					values.repeatEvery = Number(values.repeatEvery)
					values.cycles = Number(values.cycles)
				}
				await mutateCreEvent({
					...values,
				})
			}
		}
	}

	//Function -------------------------------------------------------------------
	const onChangeDescription = (value: string) => {
		setDescription(value)
	}

	//Handle change is repeat
	const onChangeIsRepeat = () => {
		setIsRepeatEvent(!isRepeatEvent)
	}

	return (
		<>
			<Box pos="relative" p={6} as={'form'} h="auto" onSubmit={handleSubmit(onSubmit)}>
				<Grid templateColumns="repeat(2, 1fr)" gap={6}>
					<GridItem w="100%" colSpan={[2, 1]}>
						<Input
							name="name"
							label="Event Name"
							icon={
								<MdOutlineDriveFileRenameOutline
									fontSize={'20px'}
									color="gray"
									opacity={0.6}
								/>
							}
							form={formSetting}
							placeholder="Enter Event Name"
							type="text"
							required
						/>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<Input
							name="color"
							label="Label Color"
							icon={
								<AiOutlineBgColors fontSize={'20px'} color="gray" opacity={0.6} />
							}
							form={formSetting}
							type="color"
							required
						/>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<Input
							name="where"
							label="Where"
							icon={<MdPlace fontSize={'20px'} color="gray" opacity={0.6} />}
							form={formSetting}
							type="text"
							placeholder="Enter Event place"
							required
						/>
					</GridItem>

					<GridItem w="100%" colSpan={2}>
						<VStack align={'start'}>
							<Text fontWeight={'normal'} color={'gray.400'}>
								Description
							</Text>
							<Editor note={description} onChangeNote={onChangeDescription}/>
						</VStack>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<Input
							name="starts_on_date"
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
							name={'starts_on_time'}
							label={'Starts On Time'}
							required
						/>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<Input
							name="ends_on_date"
							label="Ends On Date"
							icon={<BsCalendarDate fontSize={'20px'} color="gray" opacity={0.6} />}
							form={formSetting}
							type="date"
							required
						/>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<TimePicker
							form={formSetting}
							name={'ends_on_time'}
							label={'Ends On Time'}
							required
						/>
					</GridItem>

					<GridItem w="100%" colSpan={[2]}>
						<SelectMany
							form={formSetting}
							label={'Select Employee'}
							name={'employeeEmails'}
							required={true}
							options={optionEmployees}
						/>
					</GridItem>

					<GridItem w="100%" colSpan={[2]}>
						<SelectMany
							form={formSetting}
							label={'Select Client'}
							name={'clientEmails'}
							required={true}
							options={optionClients}
						/>
					</GridItem>

					<GridItem w="100%" colSpan={[2]}>
						<HStack>
							<Checkbox isChecked={isRepeatEvent} onChange={onChangeIsRepeat} />
							<Text>Repeat</Text>
						</HStack>
					</GridItem>

					{isRepeatEvent && (
						<>
							<GridItem w="100%" colSpan={[2, 1]}>
								<InputNumber
									name="repeatEvery"
									label="Repeat every"
									form={formSetting}
									required
									min={1}
								/>
							</GridItem>

							<GridItem w="100%" colSpan={[2, 1]}>
								<Select
									form={formSetting}
									label={'Repeat Type'}
									required={true}
									name={'typeRepeat'}
									placeholder={'Select type repeat'}
									options={dataTypeRepeat}
								/>
							</GridItem>

							<GridItem w="100%" colSpan={[2, 1]}>
								<InputNumber
									name="cycles"
									label="Cycles"
									form={formSetting}
									required
									min={1}
								/>
							</GridItem>
						</>
					)}
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

				{statusCreEvent === 'running' && <Loading />}
			</Box>
		</>
	)
}
