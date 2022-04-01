import {
	Box,
	Button,
	Grid,
	GridItem,
	Radio,
	RadioGroup,
	Stack,
	Text,
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
import { createLeaveForm } from 'type/form/auth'
import { dataStatusLeave } from 'utils/basicData'
import { CreateLeaveValidate } from 'utils/validate'

export interface IAddLeavesProps {
	onCloseDrawer?: () => void
}

export default function AddLeaves({ onCloseDrawer }: IAddLeavesProps) {
	const { isAuthenticated, handleLoading } = useContext(AuthContext)
	const router = useRouter()

	//State ---------------------------------------------------------------------
	const [optionEmployees, setOptionEmployees] = useState<IOption[]>([])
	const [optionLeaveTypes, setOptionLeaveTypes] = useState<IOption[]>([])
	const [duration, setDuration] = useState<string>('Single')

	//Query ---------------------------------------------------------------------
	const { data: dataEmployees } = allEmployeesQuery(isAuthenticated)
	const { data: dataLeaveTypes } = allLeaveTypesQuery()
	console.log(dataEmployees)
	console.log(dataLeaveTypes)

	// setForm and submit form create new leave -------------------------------
	const formSetting = useForm<createLeaveForm>({
		defaultValues: {
			employee: '',
			leave_type: '',
			status: '',
			reason: '',
		},
		resolver: yupResolver(CreateLeaveValidate),
	})

	const { handleSubmit } = formSetting

	const onSubmit = (values: createLeaveForm) => {}

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

	return (
		<>
			<Box pos="relative" p={6} as={'form'} h="auto">
				<Grid templateColumns="repeat(2, 1fr)" gap={6}>
					<GridItem w="100%" colSpan={[2, 1]}>
						<Select
							name="employee"
							label="Choose Member"
							required
							form={formSetting}
							placeholder={'Select Member'}
							options={optionEmployees}
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
			</Box>
		</>
	)
}
