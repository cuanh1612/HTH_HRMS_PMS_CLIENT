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
import { Loading } from 'components/common'
import { Input, SelectCustom, SelectMany, Textarea, TimePicker } from 'components/form'
import { AuthContext } from 'contexts/AuthContext'
import { createInterviewMutation } from 'mutations/interview'
import { useRouter } from 'next/router'
import { allEmployeesQuery } from 'queries'
import { allInterviewsNewQuery, allInterviewsQuery } from 'queries/interview'
import { allJobApplicationsQuery } from 'queries/jobApplication'
import { ChangeEvent, useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { AiOutlineCheck } from 'react-icons/ai'
import { BsCalendarDate } from 'react-icons/bs'
import { IOption } from 'type/basicTypes'
import { createInterviewForm } from 'type/form/basicFormType'
import { dataInterviewType } from 'utils/basicData'
import { CreateInterviewValidate } from 'utils/validate'

export interface IAddJobProps {
	onCloseDrawer?: () => void
}

export default function AddJob({ onCloseDrawer }: IAddJobProps) {
	const { isAuthenticated, handleLoading, setToast } = useContext(AuthContext)
	const router = useRouter()

	//State -------------------------------------------------------------------
	const [optionsCandidates, setOptionsCandidates] = useState<IOption[]>([])
	const [optionsInterviews, setOptionsInterviews] = useState<IOption[]>([])
	const [isSendReminder, setIsSendReminder] = useState<boolean>(false)

	//Setup modal -------------------------------------------------------------
	//Query -------------------------------------------------------------------
	// get all work candidate
	const { data: allCandidates } = allJobApplicationsQuery(isAuthenticated)
	const { mutate: refetchAllInterviews } = allInterviewsQuery(isAuthenticated)
	const { data: allEmployees } = allEmployeesQuery(isAuthenticated)
	const { mutate: refetchAllInterviewsNew } = allInterviewsNewQuery(isAuthenticated)

	//mutation ----------------------------------------------------------------
	const [mutateCreInterview, { status: statusCreInterview, data: dataCreInterview }] =
		createInterviewMutation(setToast)

	//Funcion -----------------------------------------------------------------

	// setForm and submit form create new interview ---------------------------
	const formSetting = useForm<createInterviewForm>({
		defaultValues: {
			date: undefined,
			candidate: undefined,
			interviewer: undefined,
			comment: undefined,
			start_time: '',
			type: undefined,
		},
		resolver: yupResolver(CreateInterviewValidate),
	})

	const { handleSubmit } = formSetting

	//Handle crete job
	const onSubmit = async (values: createInterviewForm) => {
		values.isSendReminder = isSendReminder
		await mutateCreInterview(values)
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

	//Set data option candidate
	useEffect(() => {
		if (allCandidates && allCandidates.jobApplications) {
			const newOptionCandidates: IOption[] = []

			allCandidates.jobApplications.map((candidate) => {
				newOptionCandidates.push({
					label: (
						<>
							<HStack>
								<Avatar
									size={'xs'}
									name={candidate.name}
									src={candidate.picture?.url}
								/>
								<Text>{candidate.name}</Text>
							</HStack>
						</>
					),
					value: candidate.id,
				})
			})

			setOptionsCandidates(newOptionCandidates)
		}
	}, [allCandidates])

	//Set data option interviewers
	useEffect(() => {
		if (allEmployees && allEmployees.employees) {
			const newOptionsInterviewer: IOption[] = []

			allEmployees.employees.map((employee) => {
				newOptionsInterviewer.push({
					label: (
						<>
							<HStack>
								<Avatar
									size={'xs'}
									name={employee.name}
									src={employee.avatar?.url}
								/>
								<Text>{employee.name}</Text>
							</HStack>
						</>
					),
					value: employee.id,
				})
			})

			setOptionsInterviews(newOptionsInterviewer)
		}
	}, [allEmployees])

	//Note when request success
	useEffect(() => {
		if (statusCreInterview === 'success') {
			//Inform notice success
			if (dataCreInterview) {
				setToast({
					type: 'success',
					msg: dataCreInterview?.message,
				})
			}

			//Close drawer when using drawer
			if (onCloseDrawer) {
				onCloseDrawer()
			}

			//Reset data form
			formSetting.reset({
				date: undefined,
				candidate: undefined,
				interviewer: undefined,
				comment: undefined,
				start_time: '',
				type: undefined,
			})

			refetchAllInterviews()
			refetchAllInterviewsNew()
		}
	}, [statusCreInterview])

	return (
		<>
			<Box pos="relative" p={6} as={'form'} h="auto" onSubmit={handleSubmit(onSubmit)}>
				<Grid templateColumns="repeat(2, 1fr)" gap={6}>
					<GridItem w="100%" colSpan={[2, 1]}>
						<SelectCustom
							form={formSetting}
							label={'Candidate'}
							name={'candidate'}
							required={true}
							options={optionsCandidates}
							placeholder={'Select Candidate'}
						/>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<HStack>
							<SelectMany
								form={formSetting}
								label={'Select Interview'}
								name={'interviewer'}
								required={true}
								options={optionsInterviews}
							/>
						</HStack>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<SelectCustom
							name="type"
							label="Interview Type"
							required={true}
							form={formSetting}
							options={dataInterviewType}
						/>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<Input
							name="date"
							label="Start On"
							icon={<BsCalendarDate fontSize={'20px'} color="gray" opacity={0.6} />}
							form={formSetting}
							placeholder="Starts on date"
							type="date"
							required
						/>
					</GridItem>
					<GridItem w="100%" colSpan={[2, 1]}>
						<TimePicker
							form={formSetting}
							label="Start Time"
							name={'start_time'}
							required={true}
							timeInit={formSetting.getValues()['start_time']}
						/>
					</GridItem>

					<GridItem w="100%" colSpan={[2]}>
						<Textarea
							name="comment"
							label="Comment"
							form={formSetting}
							placeholder="Comment"
						/>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<VStack alignItems={'start'}>
							<Checkbox
								colorScheme={'teal'}
								name="can_login"
								defaultChecked={isSendReminder}
								onChange={(e: ChangeEvent<HTMLInputElement>) =>
									setIsSendReminder(e.target.checked)
								}
							>
								Send Reminder
							</Checkbox>
						</VStack>
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
				{statusCreInterview === 'running' && <Loading />}
			</Box>
		</>
	)
}
