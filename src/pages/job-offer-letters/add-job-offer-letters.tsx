import { Box, Button, Grid, GridItem, Text } from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { Loading } from 'components/common'
import { Input, InputNumber, SelectCustom } from 'components/form'
import { AuthContext } from 'contexts/AuthContext'
import { createJobOfferLetterMutation } from 'mutations/jobOfferLetter'
import { useRouter } from 'next/router'
import { allJobsQuery, detailJobQuery } from 'queries/job'
import { applicationsByJobQuery } from 'queries/jobApplication'
import { allJobOffersQuery } from 'queries/jobOfferLetter'
import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { AiOutlineCheck } from 'react-icons/ai'
import { BsCalendarDate } from 'react-icons/bs'
import { IOption, jobType } from 'type/basicTypes'
import { createJobOfferLetterForm } from 'type/form/basicFormType'
import { dataJobRate } from 'utils/basicData'
import { CreateJobOfferValidate } from 'utils/validate'

export interface IAddJobOfferLettersProps {
	onCloseDrawer?: () => void
	job?: jobType
	onUpdateOffer?: any
}

export default function AddOfferLetter({
	onCloseDrawer,
	job: jobProp,
	onUpdateOffer
}: IAddJobOfferLettersProps) {
	const { isAuthenticated, handleLoading, setToast } = useContext(AuthContext)
	const router = useRouter()

	//State -------------------------------------------------------------------
	const [optionJobs, setOptionJobs] = useState<IOption[]>([])
	const [optionJobApplications, setOptionJobApplications] = useState<IOption[]>([])
	const [optionSelectedJob, setOptionSelectedJob] = useState<number | string | undefined>(
		jobProp ? jobProp.id : undefined
	)

	const [optionSelectedJobApplication, setOptionSelectedJobApplication] = useState<IOption>({
		label: (
			<>
				<Text color={'gray.400'}>Select Job Application</Text>
			</>
		),
		value: undefined,
	})
	const [optionSelectedRate, setOptionSelectedRate] = useState<IOption>({
		label: (
			<>
				<Text color={'gray.400'}>Select...</Text>
			</>
		),
		value: undefined,
	})

	//State selected when have data detail job pass by prop
	const [optionSelectedJobProp, _] = useState<IOption | undefined>(jobProp ? ({
		label: (
			<>
				<Text>{jobProp.title}</Text>
			</>
		),
		value: jobProp.id,
	}) : undefined)

	//Setup modal -------------------------------------------------------

	//Query -------------------------------------------------------------------
	// get all jobs
	const { data: allJobs } = allJobsQuery()
	// get all job applications
	const { data: allJobApplicationsByJob } = applicationsByJobQuery(
		isAuthenticated,
		optionSelectedJob
	)
	//refetch all job offer
	const { mutate: refetchAllJobOfferLetters } = allJobOffersQuery(isAuthenticated)
	//get detail job
	const { data: dataDetailJob } = detailJobQuery(optionSelectedJob)

	//mutation ----------------------------------------------------------------
	const [mutateCreJobOffer, { status: statusCreJobOffer, data: dataCreJobOffer }] =
		createJobOfferLetterMutation(setToast)

	// setForm and submit form create new job offer ----------------------------
	const formSetting = useForm<createJobOfferLetterForm>({
		defaultValues: {
			job: jobProp ? jobProp.id : undefined,
			job_application: undefined,
			exprise_on: undefined,
			expected_joining_date: undefined,
			salary: 1,
			rate: undefined,
		},
		resolver: yupResolver(CreateJobOfferValidate),
	})

	const { handleSubmit } = formSetting

	//Handle crete job offer
	const onSubmit = async (values: createJobOfferLetterForm) => {
		await mutateCreJobOffer(values)
	}

	//Handle change job select
	const onChangeJob = (jobId: string | number) => {
		setOptionSelectedJob(jobId)

		//Clear data when change job
		setOptionSelectedJobApplication({
			label: (
				<>
					<Text color={'gray.400'}>Select Job Application</Text>
				</>
			),
			value: undefined,
		})

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

	//Set data option rate when have data detail job
	useEffect(() => {
		if (dataDetailJob && dataDetailJob.job) {
			setOptionSelectedRate({
				label: (
					<>
						<Text>{dataDetailJob.job.rate}</Text>
					</>
				),
				value: dataDetailJob.job.rate,
			})

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
					label: (
						<>
							<Text>{job.title}</Text>
						</>
					),
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
					label: (
						<>
							<Text>{jobApplication.name}</Text>
						</>
					),
					value: jobApplication.id,
				})
			})

			setOptionJobApplications(newOptionJobs)
		}
	}, [allJobApplicationsByJob])

	//Note when request success
	useEffect(() => {
		if (statusCreJobOffer === 'success') {
			//Inform notice success
			if (dataCreJobOffer) {
				setToast({
					type: statusCreJobOffer,
					msg: dataCreJobOffer?.message,
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
			if(onUpdateOffer) {
				onUpdateOffer()
			}
		}
	}, [statusCreJobOffer])

	return (
		<>
			<Box pos="relative" p={6} as={'form'} h="auto" onSubmit={handleSubmit(onSubmit)}>
				<Grid templateColumns="repeat(2, 1fr)" gap={6}>
					<GridItem w="100%" colSpan={[2, 1]}>
						<SelectCustom
							form={formSetting}
							label={'Job'}
							name={'job'}
							required={true}
							options={optionJobs}
							onChangeValue={onChangeJob}
							selectedOption={optionSelectedJobProp}
							disabled={optionSelectedJobProp ? true : false}
						/>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<SelectCustom
							form={formSetting}
							label={'Job Application'}
							name={'job_application'}
							required={true}
							options={optionJobApplications}
							selectedOption={optionSelectedJobApplication}
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
						<SelectCustom
							name="rate"
							label="Rate"
							required={true}
							form={formSetting}
							options={dataJobRate}
							selectedOption={optionSelectedRate}
							disabled={true}
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
				{statusCreJobOffer === 'running' && <Loading />}
			</Box>
		</>
	)
}
