import { Box, Button, Grid, GridItem, Text } from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { Loading } from 'components/common'
import { Input, InputNumber, SelectCustom } from 'components/form'
import { AuthContext } from 'contexts/AuthContext'
import { createJobOfferLetterMutation } from 'mutations/jobOfferLetter'
import { useRouter } from 'next/router'
import { allJobsQuery } from 'queries/job'
import { allJobApplicationsQuery } from 'queries/jobApplication'
import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { AiOutlineCheck } from 'react-icons/ai'
import { BsCalendarDate } from 'react-icons/bs'
import { IOption } from 'type/basicTypes'
import { createJobOfferLetterForm } from 'type/form/basicFormType'
import { CreateJobOfferValidate } from 'utils/validate'

export interface IAddJobOfferLettersProps {
	onCloseDrawer?: () => void
}

export default function AddOfferLetter({ onCloseDrawer }: IAddJobOfferLettersProps) {
	const { isAuthenticated, handleLoading, setToast } = useContext(AuthContext)
	const router = useRouter()

	//State -------------------------------------------------------------------
	const [optionJobs, setOptionJobs] = useState<IOption[]>([])
	const [optionJobApplications, setOptionJobApplications] = useState<IOption[]>([])

	//Setup modal -------------------------------------------------------

	//Query -------------------------------------------------------------------
	// get all jobs
	const { data: allJobs } = allJobsQuery()
	// get all job applications
	const { data: allJobApplications } = allJobApplicationsQuery(isAuthenticated)
	//refetch all job offer
	// const { mutate: refetchAllJobOfferLetters } = allJobOffersQuery(isAuthenticated)

	//mutation ----------------------------------------------------------------
	const [mutateCreJobOffer, { status: statusCreJobOffer, data: dataCreJobOffer }] =
		createJobOfferLetterMutation(setToast)

	// setForm and submit form create new job offer ----------------------------
	const formSetting = useForm<createJobOfferLetterForm>({
		defaultValues: {
			job: undefined,
			job_application: undefined,
			exprise_on: undefined,
			expected_joining_date: undefined,
			salary: 1,
		},
		resolver: yupResolver(CreateJobOfferValidate),
	})

	const { handleSubmit } = formSetting

	//Handle crete job offer
	const onSubmit = async (values: createJobOfferLetterForm) => {
		console.log(values)
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

	//Set data option job type state
	useEffect(() => {
		if (allJobs && allJobs.jobs) {
			let newOptionJobs: IOption[] = []

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
		if (allJobApplications && allJobApplications.jobApplications) {
			let newOptionJobs: IOption[] = []

			allJobApplications.jobApplications.map((jobApplication) => {
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
	}, [allJobApplications])

	//Note when request success
	useEffect(() => {
		if (statusCreJobOffer === 'success') {
			//Inform notice success
			if (dataCreJobOffer) {
				setToast({
					type: 'success',
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

			// refetchAllJobOfferLetters()
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
						/>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<SelectCustom
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
