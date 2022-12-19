import { Box, Button, Grid, GridItem, HStack, Text } from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { Loading } from 'components/common'
import { Input, Select, Textarea, UploadAvatar } from 'components/form'
import { AuthContext } from 'contexts/AuthContext'
import { createJobApplicationMutation } from 'mutations/jobApplication'
import { useRouter } from 'next/router'
import { allJobsQuery } from 'queries/job'
import { allJobApplicationsQuery } from 'queries/jobApplication'
import { allLocationsQuery } from 'queries/location'
import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { AiOutlineCheck, AiOutlineMail, AiOutlineMobile } from 'react-icons/ai'
import { MdDriveFileRenameOutline } from 'react-icons/md'
import { IOption } from 'type/basicTypes'
import { ICloudinaryImg, IImg } from 'type/fileType'
import { createJobApplicationForm } from 'type/form/basicFormType'
import { jobMutationResponse } from 'type/mutationResponses'
import { dataApplicationSource, dataJobApplicationStatus } from 'utils/basicData'
import { uploadFile } from 'utils/uploadFile'
import { CreateJobApplicationValidate } from 'utils/validate'

export interface IAddJobApplicationProps {
	onCloseDrawer?: () => void
	dataJob?: jobMutationResponse
	onUpdateCandidates?: any
}

export default function AddJobApplication({
	onCloseDrawer,
	dataJob,
	onUpdateCandidates,
}: IAddJobApplicationProps) {
	const { isAuthenticated, handleLoading, setToast } = useContext(AuthContext)
	const router = useRouter()

	//State -------------------------------------------------------------------
	// all departments
	const [optionJobs, setOptionJobs] = useState<IOption[]>([])
	const [optionLocations, setOptionLocations] = useState<IOption[]>([])

	const [infoImg, setInfoImg] = useState<IImg>() // state data image upload
	const [loadingImg, setLoadingImg] = useState<boolean>(false) // state loading when image upload

	//Query -------------------------------------------------------------------

	// get all locations
	const { data: allLocations } = allLocationsQuery()
	const { data: allJobs } = allJobsQuery()

	// refetch all job application
	const { mutate: refetchJobApplications } = allJobApplicationsQuery(isAuthenticated)

	//mutation ----------------------------------------------------------------
	const [
		mutateCreJobApplication,
		{ status: statusCreJobApplication, data: dataCreJobApplication },
	] = createJobApplicationMutation(setToast)

	//Function -----------------------------------------------------------------
	const handleUploadAvatar = async () => {
		if (infoImg) {
			setLoadingImg(true)

			const dataUploadAvatar: Array<ICloudinaryImg> = await uploadFile({
				files: infoImg.files,
				raw: false,
				tags: ['avatar'],
				options: infoImg.options,
				upload_preset: 'job-applications',
			})

			setLoadingImg(false)

			return dataUploadAvatar[0]
		}

		return null
	}

	// setForm and submit form create new job application ---------------------
	const formSetting = useForm<createJobApplicationForm>({
		defaultValues: {
			name: undefined,
			email: undefined,
			mobile: undefined,
			cover_leter: undefined,
			status: undefined,
			source: undefined,
			jobs: dataJob?.job?.id || undefined,
			location: undefined,
		},
		resolver: yupResolver(CreateJobApplicationValidate),
	})

	const { handleSubmit } = formSetting

	//Handle crete job
	const onSubmit = async (values: createJobApplicationForm) => {
		//Upload avatar
		const dataUploadAvatar: ICloudinaryImg | null = await handleUploadAvatar()

		//Check upload avatar success
		if (dataUploadAvatar) {
			values.picture = {
				name: dataUploadAvatar.name,
				url: dataUploadAvatar.url,
				public_id: dataUploadAvatar.public_id,
			}

			//create new job application
			mutateCreJobApplication(values)
		} else {
			setToast({
				type: 'warning',
				msg: 'Please select avatar candidate',
			})
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

	//Set data option locations state
	useEffect(() => {
		if (allLocations && allLocations.locations) {
			const newOptionLocations: IOption[] = []

			allLocations.locations.map((location) => {
				newOptionLocations.push({
					label: location.name,
					value: location.id,
				})
			})

			setOptionLocations(newOptionLocations)
		}
	}, [allLocations])

	//Set data option jobs
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

	//Note when request success
	useEffect(() => {
		if (statusCreJobApplication === 'success') {
			//Inform notice success
			if (dataCreJobApplication) {
				setToast({
					type: statusCreJobApplication,
					msg: dataCreJobApplication?.message,
				})
			}

			//Close drawer when using drawer
			if (onCloseDrawer) {
				onCloseDrawer()
			}

			//Reset data form
			formSetting.reset({
				name: undefined,
				email: undefined,
				mobile: undefined,
				cover_leter: undefined,
				status: undefined,
				source: undefined,
				...(dataJob?.job ? { jobs: dataJob.job.id } : { jobs: undefined }),
				location: undefined,
			})
			refetchJobApplications()
			if (onUpdateCandidates) onUpdateCandidates()
		}
	}, [statusCreJobApplication])

	return (
		<>
			<Box pos="relative" p={6} as={'form'} h="auto" onSubmit={handleSubmit(onSubmit)}>
				<Grid templateColumns="repeat(2, 1fr)" gap={6}>
					<GridItem w="100%" colSpan={2}>
						<Text color={'gray.400'} mb={2}>
							Job Application Picture <span style={{ color: 'red' }}>*</span>
						</Text>
						<UploadAvatar
							setInfoImg={(data?: IImg) => {
								setInfoImg(data)
							}}
						/>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<HStack>
							<Select
								form={formSetting}
								label={'Jobs'}
								name={'jobs'}
								required={true}
								options={optionJobs}
								placeholder={'Select job'}
								disabled={dataJob?.job ? true : false}
							/>
						</HStack>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<Input
							name="name"
							label="Name"
							icon={
								<MdDriveFileRenameOutline
									fontSize={'20px'}
									color="gray"
									opacity={0.6}
								/>
							}
							form={formSetting}
							placeholder="Name"
							type="text"
							required
						/>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<Input
							name="email"
							label="Email"
							icon={<AiOutlineMail fontSize={'20px'} color="gray" opacity={0.6} />}
							form={formSetting}
							placeholder="Email"
							type="email"
							required
						/>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<Input
							name="mobile"
							label="Mobile"
							icon={<AiOutlineMobile fontSize={'20px'} color="gray" opacity={0.6} />}
							form={formSetting}
							placeholder="Mobile"
							type="tel"
							required
						/>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<HStack>
							<Select
								form={formSetting}
								label={'Location'}
								name={'location'}
								required={true}
								options={optionLocations}
								placeholder={'Select location'}
							/>
						</HStack>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<Select
							name="status"
							label="status"
							required={true}
							form={formSetting}
							options={dataJobApplicationStatus}
							placeholder={'Select status'}
						/>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<Select
							placeholder={'Select source'}
							name="source"
							label="Application Source"
							required={true}
							form={formSetting}
							options={dataApplicationSource}
						/>
					</GridItem>

					<GridItem w="100%" colSpan={[2]}>
						<Textarea
							name="cover_leter"
							label="Application Cover Letter"
							form={formSetting}
							placeholder="Application Source"
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
				{(statusCreJobApplication === 'running' || loadingImg) && <Loading />}
			</Box>
		</>
	)
}
