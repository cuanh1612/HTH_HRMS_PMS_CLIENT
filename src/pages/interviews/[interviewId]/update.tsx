import { Avatar, Box, Button, Grid, GridItem, HStack, Text } from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { Loading } from 'components/common'
import { Input, SelectCustom, SelectMany, Textarea, TimePicker } from 'components/form'
import { AuthContext } from 'contexts/AuthContext'
import { updateInterviewMutation } from 'mutations/interview'
import { useRouter } from 'next/router'
import { allEmployeesQuery } from 'queries'
import {
	newInterviewQuery,
	todayInterviewCalendarQuery,
	todayInterviewQuery,
} from 'queries/dashboardJobs'
import { allInterviewsNewQuery, allInterviewsQuery, detailInterviewQuery } from 'queries/interview'
import { allJobApplicationsQuery } from 'queries/jobApplication'
import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { AiOutlineCheck } from 'react-icons/ai'
import { BsCalendarDate } from 'react-icons/bs'
import { IOption } from 'type/basicTypes'
import { updateInterviewForm } from 'type/form/basicFormType'
import { dataInterviewStatus, dataInterviewType } from 'utils/basicData'
import { CreateInterviewValidate } from 'utils/validate'

export interface IUpdateInterviewProps {
	onCloseDrawer?: () => void
	interviewId: string | number | null
	onUpdateInterview?: any
}

export default function UpdateInterview({
	onCloseDrawer,
	interviewId: interviewIdProp,
	onUpdateInterview,
}: IUpdateInterviewProps) {
	const { isAuthenticated, handleLoading, setToast } = useContext(AuthContext)
	const router = useRouter()
	const { interviewId: interviewIdRouter } = router.query

	//State -------------------------------------------------------------------
	const [optionsCandidates, setOptionsCandidates] = useState<IOption[]>([])
	const [optionsInterviews, setOptionsInterviews] = useState<IOption[]>([])

	//Option selected
	const [selectedOptionsInterviewer, setSelectedOptionInterviewer] = useState<IOption[]>([])

	//Setup modal -------------------------------------------------------------
	//Query -------------------------------------------------------------------
	// get all work candidate
	const { data: allCandidates } = allJobApplicationsQuery(isAuthenticated)
	const { mutate: refetchAllInterviews } = allInterviewsQuery(isAuthenticated)
	const { data: allEmployees } = allEmployeesQuery(isAuthenticated)
	const { mutate: refetchAllInterviewsNew } = allInterviewsNewQuery(isAuthenticated)
	const { mutate: refetchNewInterview } = newInterviewQuery(isAuthenticated)
	const { mutate: refetchTodayInterview } = todayInterviewQuery(isAuthenticated)
	const { mutate: refetchTodayInterviewCalendar } = todayInterviewCalendarQuery(isAuthenticated)

	//Get detail interview
	const { data: dataDetailInterview } = detailInterviewQuery(
		isAuthenticated,
		interviewIdProp || (interviewIdRouter as string)
	)

	//mutation ----------------------------------------------------------------
	const [mutateUpInterview, { status: statusUpInterview, data: dataUpInterview }] =
		updateInterviewMutation(setToast)

	//Function -----------------------------------------------------------------
	// setForm and submit form update interview ---------------------------
	const formSetting = useForm<updateInterviewForm>({
		defaultValues: {
			date: undefined,
			candidate: undefined,
			interviewer: undefined,
			comment: undefined,
			start_time: '',
			type: undefined,
			status: undefined,
		},
		resolver: yupResolver(CreateInterviewValidate),
	})

	const { handleSubmit } = formSetting

	//Handle crete job
	const onSubmit = async (values: updateInterviewForm) => {
		values.interviewId = interviewIdProp || (interviewIdRouter as string)
		await mutateUpInterview(values)
		if (!interviewIdProp && !interviewIdRouter) {
			setToast({
				msg: 'Not found interview to update',
				type: 'error',
			})
		} else {
			values.interviewId = interviewIdProp || (interviewIdRouter as string)
			mutateUpInterview(values)
		}
	}

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
		if (statusUpInterview === 'success') {
			//Inform notice success
			if (dataUpInterview) {
				setToast({
					type: statusUpInterview,
					msg: dataUpInterview?.message,
				})
			}

			//Close drawer when using drawer
			if (onCloseDrawer) {
				onCloseDrawer()
			}

			refetchAllInterviews()
			refetchAllInterviewsNew()
			refetchNewInterview()
			refetchTodayInterview()
			refetchTodayInterviewCalendar()
			if (onUpdateInterview) onUpdateInterview()
		}
	}, [statusUpInterview])

	//Change data when have data detail interview
	useEffect(() => {
		if (dataDetailInterview && dataDetailInterview.interview) {
			const newSelectedInterviewer: IOption[] = []

			//Set data selected option interviewer
			if (dataDetailInterview.interview.interviewer) {
				dataDetailInterview.interview.interviewer.map((interviewer) => {
					newSelectedInterviewer.push({
						label: (
							<>
								<HStack>
									<Avatar
										size={'xs'}
										name={interviewer.name}
										src={interviewer.avatar?.url}
									/>
									<Text>{interviewer.name}</Text>
								</HStack>
							</>
						),
						value: interviewer.id,
					})
				})
			}

			setSelectedOptionInterviewer(newSelectedInterviewer)

			//set data form
			formSetting.reset({
				date: dataDetailInterview.interview.date || undefined,
				candidate: dataDetailInterview.interview.candidate.id || undefined,
				interviewer:
					dataDetailInterview.interview.interviewer.map(
						(interviewer) => interviewer.id
					) || undefined,
				comment: dataDetailInterview.interview.comment || undefined,
				start_time: dataDetailInterview.interview.start_time || undefined,
				type: dataDetailInterview.interview.type || undefined,
				status: dataDetailInterview.interview.status || undefined,
			})
		}
	}, [dataDetailInterview])

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
								selectedOptions={selectedOptionsInterviewer}
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

					<GridItem w="100%" colSpan={[2, 1]}>
						<SelectCustom
							name="status"
							label="Interview Status"
							required={true}
							form={formSetting}
							options={dataInterviewStatus}
						/>
					</GridItem>

					<GridItem w="100%" colSpan={[2]}>
						<Textarea
							name="comment"
							label="Comment"
							form={formSetting}
							placeholder="Comment"
							defaultValue={dataDetailInterview?.interview?.comment}
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
				{statusUpInterview === 'running' && <Loading />}
			</Box>
		</>
	)
}
