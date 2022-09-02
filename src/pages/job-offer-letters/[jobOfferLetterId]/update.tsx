import { Box, Button, Grid, GridItem } from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { Loading } from 'components/common'
import { Input, InputNumber, Select } from 'components/form'
import { AuthContext } from 'contexts/AuthContext'
import { updateJobOfferLetterMutation } from 'mutations/jobOfferLetter'
import { useRouter } from 'next/router'
import { allJobsQuery, detailJobQuery } from 'queries/job'
import { applicationsByJobQuery } from 'queries/jobApplication'
import { allJobOffersQuery, detailJobOfferQuery } from 'queries/jobOfferLetter'
import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { AiOutlineCheck } from 'react-icons/ai'
import { BsCalendarDate } from 'react-icons/bs'
import { IOption } from 'type/basicTypes'
import { updateJobOfferLetterForm } from 'type/form/basicFormType'
import { dataJobOfferStatus, dataJobRate } from 'utils/basicData'
import { UpdateJobOfferValidate } from 'utils/validate'

export interface IUpdateJobOfferLettersProps {
	onCloseDrawer?: () => void
	jobOfferLetterId: number | null
	onUpdateOffer?: any
}

export default function UpdateOfferLetter({
	onCloseDrawer,
	jobOfferLetterId: jobOfferLetterIdProp,
	onUpdateOffer,
}: IUpdateJobOfferLettersProps) {
	const { isAuthenticated, handleLoading, setToast } = useContext(AuthContext)
	const router = useRouter()
	const { jobOFferLetterId: jobOFferLetterIdRouter } = router.query

	//State -------------------------------------------------------------------
	const [optionJobs, setOptionJobs] = useState<IOption[]>([])
	const [optionJobApplications, setOptionJobApplications] = useState<IOption[]>([])

	const [optionSelectedJobId, setOptionSelectedJobId] = useState<number | string>()

	//Setup modal -------------------------------------------------------

	//Query -------------------------------------------------------------------
	//Get detail job offer letter
	const { data: dataDetailJobOfferLetter } = detailJobOfferQuery(
		isAuthenticated,
		jobOfferLetterIdProp || (jobOFferLetterIdRouter as string)
	)

	// get all jobs
	const { data: allJobs } = allJobsQuery()
	// get all job applications
	const { data: allJobApplicationsByJob } = applicationsByJobQuery(
		isAuthenticated,
		optionSelectedJobId
	)
	//refetch all job offer
	const { mutate: refetchAllJobOfferLetters } = allJobOffersQuery(isAuthenticated)
	//get detail job
	const { data: dataDetailJob } = detailJobQuery(optionSelectedJobId)

	//mutation ----------------------------------------------------------------
	const [mutateUpJobOffer, { status: statusUpJobOffer, data: dataUpJobOffer }] =
		updateJobOfferLetterMutation(setToast)

	// setForm and submit form update job offer ----------------------------
	const formSetting = useForm<updateJobOfferLetterForm>({
		defaultValues: {
			job: undefined,
			job_application: undefined,
			exprise_on: undefined,
			expected_joining_date: undefined,
			salary: 1,
			rate: undefined,
			status: undefined,
		},
		resolver: yupResolver(UpdateJobOfferValidate),
	})

	const { handleSubmit } = formSetting

	//Handle crete job offer
	const onSubmit = async (values: updateJobOfferLetterForm) => {
		if (!jobOfferLetterIdProp && !jobOFferLetterIdRouter) {
			setToast({
				msg: 'Not found job offer letter to update',
				type: 'error',
			})
		} else {
			values.jobOfferLetterId = jobOfferLetterIdProp || (jobOFferLetterIdRouter as string)
			await mutateUpJobOffer(values)
		}
	}

	//Handle change job select
	const onChangeJob = (jobId: string | number) => {
		setOptionSelectedJobId(jobId)

		//Reset data form
		formSetting.setValue('job_application', undefined)
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

	useEffect(() => {
		const subscription = formSetting.watch((value, { name }) => {
			if (name == 'job') {
				onChangeJob(value[name] || '')
			}
		})
		return () => subscription.unsubscribe()
	}, [formSetting.watch])

	//Set data form when have data detail job offer letter
	useEffect(() => {
		if (dataDetailJobOfferLetter && dataDetailJobOfferLetter.jobOfferLetter) {
			//Set data selected option job
			if (dataDetailJobOfferLetter.jobOfferLetter.job) {
				setOptionSelectedJobId(dataDetailJobOfferLetter.jobOfferLetter.job.id)
			}

			//set data form
			formSetting.reset({
				job: dataDetailJobOfferLetter.jobOfferLetter.job.id || undefined,
				job_application:
					dataDetailJobOfferLetter.jobOfferLetter.job_application.id || undefined,
				exprise_on: dataDetailJobOfferLetter.jobOfferLetter.exprise_on || undefined,
				expected_joining_date:
					dataDetailJobOfferLetter.jobOfferLetter.expected_joining_date || undefined,
				salary: dataDetailJobOfferLetter.jobOfferLetter.salary || 1,
				rate: dataDetailJobOfferLetter.jobOfferLetter.rate || undefined,
				status: dataDetailJobOfferLetter.jobOfferLetter.status || undefined,
			})
		}
	}, [dataDetailJobOfferLetter])

	//Set data option rate when have data detail job
	useEffect(() => {
		if (dataDetailJob && dataDetailJob.job) {
			//Reset data form
			formSetting.setValue('rate', dataDetailJob.job.rate)
		}
	}, [dataDetailJob])

	//Set data option job type state
	useEffect(() => {
		if (allJobs && allJobs.jobs) {
			const newOptionJobs: IOption[] = []

			allJobs.jobs.map((job) => {
				newOptionJobs.push({
					label: job.title,
					value: job.id,
				})
			})

			setOptionJobs(newOptionJobs)
		}
	}, [allJobs])

	//Set data option job application
	useEffect(() => {
		if (allJobApplicationsByJob && allJobApplicationsByJob.jobApplications) {
			const newOptionJobs: IOption[] = []

			allJobApplicationsByJob.jobApplications.map((jobApplication) => {
				newOptionJobs.push({
					label: jobApplication.name,
					value: jobApplication.id,
				})
			})

			setOptionJobApplications(newOptionJobs)
		}
	}, [allJobApplicationsByJob])

	//Note when request success
	useEffect(() => {
		if (statusUpJobOffer === 'success') {
			//Inform notice success
			if (dataUpJobOffer) {
				setToast({
					type: statusUpJobOffer,
					msg: dataUpJobOffer?.message,
				})
			}

			//Close drawer when using drawer
			if (onCloseDrawer) {
				onCloseDrawer()
			}

			//Reset data form
			formSetting.reset({
				job: undefined,
				job_application: undefined,
				exprise_on: undefined,
				expected_joining_date: undefined,
				salary: 1,
			})

			refetchAllJobOfferLetters()
			if (onUpdateOffer) {
				onUpdateOffer()
			}
		}
	}, [statusUpJobOffer])

	return (
		<>
			<Box pos="relative" p={6} as={'form'} h="auto" onSubmit={handleSubmit(onSubmit)}>
				<Grid templateColumns="repeat(2, 1fr)" gap={6}>
					<GridItem w="100%" colSpan={[2, 1]}>
						<Select
							form={formSetting}
							label={'Job'}
							name={'job'}
							required={true}
							options={optionJobs}
						/>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<Select
							form={formSetting}
							label={'Job Application'}
							name={'job_application'}
							required={true}
							options={optionJobApplications}
						/>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<Input
							name="exprise_on"
							label="Offer Expire On"
							icon={<BsCalendarDate fontSize={'20px'} color="gray" opacity={0.6} />}
							form={formSetting}
							placeholder="Offer Expire On"
							type="date"
							required
						/>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<Input
							name="expected_joining_date"
							label="Expected Joining Date"
							icon={<BsCalendarDate fontSize={'20px'} color="gray" opacity={0.6} />}
							form={formSetting}
							placeholder="Expected Joining Date"
							type="date"
							required
						/>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<InputNumber
							name="salary"
							label="salary"
							form={formSetting}
							required
							min={1}
						/>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<Select
							name="rate"
							placeholder="Select rate"
							label="Rate"
							required={true}
							form={formSetting}
							options={dataJobRate}
							disabled={true}
						/>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<Select
							name="status"
							label="Status"
							required={true}
							form={formSetting}
							options={dataJobOfferStatus}
							placeholder={'Select status'}
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
				{statusUpJobOffer === 'running' && <Loading />}
			</Box>
		</>
	)
}
