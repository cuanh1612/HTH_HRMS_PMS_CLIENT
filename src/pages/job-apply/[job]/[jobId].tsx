import {
	Box,
	Button,
	Checkbox,
	Container,
	Divider,
	Grid,
	GridItem,
	HStack,
	Text,
	VStack,
} from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { Head, Loading } from 'components/common'
import { Input, SelectCustom, Textarea, UploadAvatar } from 'components/form'
import { RecruitLayout } from 'components/layouts'
import { AuthContext } from 'contexts/AuthContext'
import { createJobApplicationMutation } from 'mutations/jobApplication'
import { useRouter } from 'next/router'
import { companyInfoQuery } from 'queries/companyInfo'
import { allLocationsQuery } from 'queries/location'
import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { AiOutlineCheck, AiOutlineMail, AiOutlineMobile } from 'react-icons/ai'
import { MdDriveFileRenameOutline } from 'react-icons/md'
import { IOption } from 'type/basicTypes'
import { NextLayout } from 'type/element/layout'
import { ICloudinaryImg, IImg } from 'type/fileType'
import { createJobApplicationForm } from 'type/form/basicFormType'
import { dataApplicationSource, dataJobApplicationStatus } from 'utils/basicData'
import { uploadFile } from 'utils/uploadFile'
import { CreateJobApplicationValidate } from 'utils/validate'

const Apply: NextLayout = () => {
	const { handleLoading, setToast } = useContext(AuthContext)
	const router = useRouter()
	const { jobId } = router.query

	//State -------------------------------------------------------------------
	const [optionLocations, setOptionLocations] = useState<IOption[]>([])
	const [isAgree, setIsAgree] = useState<boolean>(false)

	const [infoImg, setInfoImg] = useState<IImg>() // state data image upload
	const [loadingImg, setLoadingImg] = useState<boolean>(false) // state loading when image upload

	// setForm and submit form create new application job -----------------
	const formSetting = useForm<createJobApplicationForm>({
		defaultValues: {
			name: undefined,
			email: undefined,
			mobile: undefined,
			cover_leter: undefined,
			status: undefined,
			source: undefined,
			jobs: (jobId as string) || undefined,
			location: undefined,
		},
		resolver: yupResolver(CreateJobApplicationValidate),
	})

	const { handleSubmit } = formSetting
	useEffect(() => {
		handleLoading(false)
	}, [])

	//Query -------------------------------------------------------------------
	const { data: dataCompanyInfo, mutate: refetchCompanyInfo } = companyInfoQuery()
	console.log(dataCompanyInfo);
	

	//mutation ----------------------------------------------------------------
	const [
		mutateCreJobApplication,
		{ status: statusCreJobApplication, data: dataCreJobApplication },
	] = createJobApplicationMutation(setToast)

	//query --------------------------------------------------------------------
	// get all locations
	const { data: allLocations } = allLocationsQuery()

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

	//Handle crete job
	const onSubmit = async (values: createJobApplicationForm) => {
		if (isAgree) {
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
		} else {
			setToast({
				msg: `Please check "I agree with the above Terms and Conditions"`,
				type: 'warning',
			})
		}
	}

	//Use effect -----------------------------------------------------------
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

			//Reset data form
			formSetting.reset({
				name: undefined,
				email: undefined,
				mobile: undefined,
				cover_leter: undefined,
				status: undefined,
				source: undefined,
				...(jobId ? { jobs: jobId as string } : { jobs: undefined }),
				location: undefined,
			})
		}
	}, [statusCreJobApplication])

	//Set data option locations state
	useEffect(() => {
		if (allLocations && allLocations.locations) {
			const newOptionLocations: IOption[] = []

			allLocations.locations.map((location) => {
				newOptionLocations.push({
					label: (
						<>
							<Text>{location.name}</Text>
						</>
					),
					value: location.id,
				})
			})

			setOptionLocations(newOptionLocations)
		}
	}, [allLocations])

	return (
		<>
			<Head title={'Job apply'} />
			<Container
				maxW="container.xl"
				border={'1px solid'}
				borderColor={'gray.400'}
				borderRadius={4}
			>
				<VStack spacing={6} align={'start'} py={6}>
					<Text fontSize={20} fontWeight={'semibold'}>
						Personal Information
					</Text>
					<Divider />
					<Box
						w={'full'}
						pos="relative"
						p={6}
						as={'form'}
						h="auto"
						onSubmit={handleSubmit(onSubmit)}
					>
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
									icon={
										<AiOutlineMail
											fontSize={'20px'}
											color="gray"
											opacity={0.6}
										/>
									}
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
									icon={
										<AiOutlineMobile
											fontSize={'20px'}
											color="gray"
											opacity={0.6}
										/>
									}
									form={formSetting}
									placeholder="Mobile"
									type="tel"
									required
								/>
							</GridItem>

							<GridItem w="100%" colSpan={[2, 1]}>
								<HStack>
									<SelectCustom
										form={formSetting}
										label={'Location'}
										name={'location'}
										required={true}
										options={optionLocations}
									/>
								</HStack>
							</GridItem>

							<GridItem w="100%" colSpan={[2, 1]}>
								<SelectCustom
									name="status"
									label="status"
									required={true}
									form={formSetting}
									options={dataJobApplicationStatus}
								/>
							</GridItem>

							<GridItem w="100%" colSpan={[2, 1]}>
								<SelectCustom
									name="source"
									label="Application Source"
									required={true}
									form={formSetting}
									options={dataApplicationSource}
								/>
							</GridItem>

							<GridItem w="100%" colSpan={[2]}>
								<Textarea
									name="cover_Letter"
									label="Application Cover Leeter"
									form={formSetting}
									placeholder="Application Source"
								/>
							</GridItem>

							<GridItem w="100%" colSpan={[2]}>
								<Text fontSize={20} fontWeight={'semibold'}>
									Terms And Condition
								</Text>
							</GridItem>

							<GridItem w="100%" colSpan={[2]}>
								<Text>
									If any provision of these Terms and Conditions is held to be
									invalid or unenforceable, the provision shall be removed (or
									interpreted, if possible, in a manner as to be enforceable), and
									the remaining provisions shall be enforced. Headings are for
									reference purposes only and in no way define, limit, construe or
									describe the scope or extent of such section. Our failure to act
									with respect to a breach by you or others does not waive our
									right to act with respect to subsequent or similar breaches.
									These Terms and Conditions set forth the entire understanding
									and agreement between us with respect to the subject matter
									contained herein and supersede any other agreement, proposals
									and communications, written or oral, between our representatives
									and you with respect to the subject matter hereof, including any
									terms and conditions on any of customer's documents or purchase
									orders.
								</Text>
							</GridItem>

							<GridItem w="100%" colSpan={[2]}>
								<Text>
									No Joint Venture, No Derogation of Rights. You agree that no
									joint venture, partnership, employment, or agency relationship
									exists between you and us as a result of these Terms and
									Conditions or your use of the Site. Our performance of these
									Terms and Conditions is subject to existing laws and legal
									process, and nothing contained herein is in derogation of our
									right to comply with governmental, court and law enforcement
									requests or requirements relating to your use of the Site or
									information provided to or gathered by us with respect to such
									use.
								</Text>
							</GridItem>

							<GridItem w="100%" colSpan={[2]}>
								<Checkbox
									isChecked={isAgree}
									onChange={() => {
										setIsAgree(!isAgree)
									}}
								>
									I agree with the above Terms and Conditions
								</Checkbox>
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
				</VStack>
			</Container>
		</>
	)
}

Apply.getLayout = RecruitLayout
export default Apply
