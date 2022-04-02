import {
	Box,
	Button,
	Grid,
	GridItem,
	Radio,
	RadioGroup,
	Stack,
	Text,
	useDisclosure,
	VStack,
} from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { Select } from 'components/form/Select'
import { Textarea } from 'components/form/Textarea'
import { AuthContext } from 'contexts/AuthContext'
import { useRouter } from 'next/router'
import { allEmployeesQuery } from 'queries/employee'
import { allLeaveTypesQuery } from 'queries/leaveType'
import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { AiOutlineCheck } from 'react-icons/ai'
import { IOption } from 'type/basicTypes'
import { createLeaveForm, updateLeaveForm } from 'type/form/auth'
import { dataStatusLeave } from 'utils/basicData'
import { CreateLeaveValidate, UpdateLeaveValidate } from 'utils/validate'
import { MultiDatePicker } from 'components/form/MultiDatePicker'
import { BsCalendarDate } from 'react-icons/bs'
import { createLeaveMutation, updateLeaveMutation } from 'mutations/leave'
import Modal from 'components/Modal'
import AddLeaveType from '../leave-type'
import Loading from 'components/Loading'
import { detailLeaveQuery } from 'queries/leave'
import { Input } from 'components/form/Input'

export interface IUpdateLeavesProps {
	onCloseDrawer?: () => void
	leaveId: number | null
}

export default function UpdateLeaves({ onCloseDrawer, leaveId }: IUpdateLeavesProps) {
	const { isAuthenticated, handleLoading, setToast } = useContext(AuthContext)
	const router = useRouter()

	//State ---------------------------------------------------------------------
	const [optionEmployees, setOptionEmployees] = useState<IOption[]>([])
	const [optionLeaveTypes, setOptionLeaveTypes] = useState<IOption[]>([])
	const [duration, setDuration] = useState<string>('Single')

	//Setup modal ----------------------------------------------------------------
	const {
		isOpen: isOpenLeaveType,
		onOpen: onOpenLeaveType,
		onClose: onCloseLeaveType,
	} = useDisclosure()

	//Query ---------------------------------------------------------------------
	const { data: dataEmployees } = allEmployeesQuery(isAuthenticated)
	const { data: dataLeaveTypes } = allLeaveTypesQuery()
	const { data: dataDetailLeave, error: errorDetailLeave } = detailLeaveQuery(leaveId)

	//mutation ------------------------------------------------------------------
	const [mutateUpLeave, { status: statusUpLeave, data: dataUpLeave }] =
		updateLeaveMutation(setToast)

	// setForm and submit form update leave -------------------------------------
	const formSetting = useForm<updateLeaveForm>({
		defaultValues: {
			employee: '',
			leave_type: '',
			status: '',
			reason: '',
			date: undefined,
		},
		resolver: yupResolver(UpdateLeaveValidate),
	})

	const { handleSubmit } = formSetting

	const onSubmit = (values: updateLeaveForm) => {
		if (!leaveId) {
			setToast({
				type: 'error',
				msg: 'Not found leave to update',
			})
		} else {
			values.duration = duration
			mutateUpLeave({
				inputUpdate: values,
				leaveId,
			})
		}
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

	//Setting form when have data detail leave
	useEffect(() => {
		if (dataDetailLeave?.leave) {
			//Set duration state
			setDuration(dataDetailLeave.leave.duration)

			//Set data form
			formSetting.reset({
				employee: dataDetailLeave.leave.employee.id.toString(),
				status: dataDetailLeave.leave.status,
				leave_type: dataDetailLeave.leave.leave_type.id.toString(),
				reason: dataDetailLeave.leave.reason,
				date: dataDetailLeave.leave.date,
			})
		}
	}, [dataDetailLeave])

	//Set options select employees
	useEffect(() => {
		if (dataEmployees?.employees) {
			const newOptionEmployees: IOption[] = dataEmployees.employees.map((employee) => {
				return {
					value: employee.id.toString(),
					lable: employee.email,
				}
			})

			setOptionEmployees(newOptionEmployees)
		}
	}, [dataEmployees])

	//Set options select leave type
	useEffect(() => {
		if (dataLeaveTypes?.leaveTypes) {
			const newOptionLeaveTypes: IOption[] = dataLeaveTypes.leaveTypes.map((leaveType) => {
				return {
					value: leaveType.id.toString(),
					lable: leaveType.name,
				}
			})

			setOptionLeaveTypes(newOptionLeaveTypes)
		}
	}, [dataLeaveTypes])

	//Note when request success
	useEffect(() => {
		if (statusUpLeave === 'success') {
			//Close drawer when using drawer
			if (onCloseDrawer) {
				onCloseDrawer()
			}

			setToast({
				type: 'success',
				msg: dataUpLeave?.message as string,
			})
		}
	}, [statusUpLeave])

	return (
		<>
			<Box pos="relative" p={6} as={'form'} h="auto" onSubmit={handleSubmit(onSubmit)}>
				<Grid templateColumns="repeat(2, 1fr)" gap={6}>
					<GridItem w="100%" colSpan={[2, 1]}>
						<Select
							name="employee"
							label="Member"
							required
							form={formSetting}
							placeholder={'Select Member'}
							options={optionEmployees}
							disabled={true}
						/>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<Select
							name="leave_type"
							label="Leave Type"
							required
							form={formSetting}
							placeholder={'Select Leave Type'}
							options={optionLeaveTypes}
							isModal={true}
							onOpenModal={onOpenLeaveType}
						/>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<Select
							name="status"
							label="Leave Status"
							required
							form={formSetting}
							placeholder={'Select Leave Status'}
							options={dataStatusLeave}
						/>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<Input
							name="date"
							label="Leave Date"
							icon={<BsCalendarDate fontSize={'20px'} color="gray" opacity={0.6} />}
							form={formSetting}
							placeholder="Select Leave Date"
							type="date"
							required
						/>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<VStack align={'start'}>
							<Text>Select Duration</Text>
							<RadioGroup onChange={setDuration} value={duration}>
								<Stack direction="row">
									<Radio value="Single">Single</Radio>
									<Radio value="Half Day">Half Day</Radio>
								</Stack>
							</RadioGroup>
						</VStack>
					</GridItem>

					<GridItem w="100%" colSpan={2}>
						<Textarea
							name="reason"
							label="Reason for absence"
							placeholder="e.g.Feeling not well"
							form={formSetting}
							required
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

				{statusUpLeave === 'running' && <Loading />}
			</Box>

			{/* Modal Leave type */}
			<Modal
				size="3xl"
				isOpen={isOpenLeaveType}
				onOpen={onOpenLeaveType}
				onClose={onCloseLeaveType}
				title="Add New Leave Type"
			>
				<Text>
					<AddLeaveType />
				</Text>
			</Modal>
		</>
	)
}
