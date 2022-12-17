import {
	Box,
	Button,
	Checkbox,
	Container,
	Divider,
	Grid,
	GridItem,
	HStack,
	Img,
	Text,
	VStack,
} from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { Head, ItemFileUpload, Loading } from 'components/common'
import { Input, Select, Textarea, UploadAvatar } from 'components/form'
import { RecruitLayout } from 'components/layouts'
import { AuthContext } from 'contexts/AuthContext'
import { createJobApplicationMutation } from 'mutations/jobApplication'
import { useRouter } from 'next/router'
import { allLocationsQuery } from 'queries/location'
import { useCallback, useContext, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useForm } from 'react-hook-form'
import { AiOutlineCheck, AiOutlineMail, AiOutlineMobile } from 'react-icons/ai'
import { MdDriveFileRenameOutline } from 'react-icons/md'
import { IOption } from 'type/basicTypes'
import { NextLayout } from 'type/element/layout'
import { ICloudinaryImg, IImg } from 'type/fileType'
import { createJobApplicationForm } from 'type/form/basicFormType'
import { dataApplicationSource, dataJobApplicationStatus } from 'utils/basicData'
import { generateImgFile } from 'utils/helper'
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

	//Setting files uploads -----------------------------------------------------
	//handle ondrop file
	const onDrop = useCallback((acceptedFiles: File[]) => {
		//Check size
		let isValidSize = true
		acceptedFiles.forEach((file) => {
			if (file.size >= 10485760) {
				isValidSize = false
			}
		})

		if (isValidSize) {
			setFilesUpload(acceptedFiles)
		} else {
			setToast({
				msg: 'Each file should be less than 10MB in size.',
				type: 'warning',
			})
		}
	}, [])

	const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

	//Setup for upload files
	const [filesUpload, setFilesUpload] = useState<File[]>([])
	const [isLoadUpFiles, setIsLoadUpFiles] = useState<boolean>(false)

	//Remove file upload
	const onRemoveFile = (index: number) => {
		const newFilesUpload = filesUpload.filter((_, indexFile) => indexFile !== index)
		setFilesUpload(newFilesUpload)
	}

	//Handle upload files
	const handleUploadFiles = async () => {
		if (filesUpload.length > 0) {
			//Set is load upload file
			setIsLoadUpFiles(true)

			const dataUploadFiles: Array<ICloudinaryImg> = await uploadFile({
				files: filesUpload,
				tags: ['cv'],
				raw: true,
				upload_preset: 'job-applications',
			})

			//Set is load upload file
			setIsLoadUpFiles(false)

			return dataUploadFiles
		}

		return null
	}

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
			files: undefined,
		},
		resolver: yupResolver(CreateJobApplicationValidate),
	})

	const { handleSubmit } = formSetting
	useEffect(() => {
		handleLoading(false)
	}, [])

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

				//Upload job application files
				const dataUploadFiles: ICloudinaryImg[] | null = await handleUploadFiles()

				//Check upload files success
				if (dataUploadFiles && dataUploadFiles?.length > 0) {
					// add file to value
					values.files = dataUploadFiles
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
				files: undefined,
			})

			//Set file upload for job apply
			setFilesUpload([])
		}
	}, [statusCreJobApplication])

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
									name="source"
									label="Application Source"
									required={true}
									form={formSetting}
									options={dataApplicationSource}
									placeholder={'Select source'}
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
								<VStack
									align={'start'}
									w="full"
									bgColor={'white'}
									borderRadius={5}
									spacing={5}
								>
									<Box position={'relative'} p={2} w={'full'}>
										<VStack w={'full'} spacing={5} position={'relative'}>
											<VStack
												align={'center'}
												w={'full'}
												border={'4px dotted #009F9D30'}
												p={10}
												spacing={10}
												borderRadius={20}
												{...getRootProps()}
											>
												<Img
													width={150}
													height={100}
													alt="upload_file"
													src="/assets/uploadFiles.svg"
												/>
												<input {...getInputProps()} />
												{isDragActive ? (
													<Text
														fontSize={16}
														fontWeight={'semibold'}
														color={'gray'}
													>
														Drop the files here ...
													</Text>
												) : (
													<Text
														fontSize={16}
														fontWeight={'semibold'}
														color={'gray'}
													>
														Drag your CV, documents, photos, or videos relative job apply here
														to start uploading
													</Text>
												)}
											</VStack>
										</VStack>
									</Box>

									{filesUpload.length > 0 && (
										<VStack w={'full'} px={2}>
											{filesUpload.map((file, index) => (
												<ItemFileUpload
													key={index}
													src={generateImgFile(file.name)}
													fileName={file.name}
													index={index}
													onRemoveFile={onRemoveFile}
												/>
											))}
										</VStack>
									)}
								</VStack>
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
						{(statusCreJobApplication === 'running' || loadingImg || isLoadUpFiles) && (
							<Loading />
						)}
					</Box>
				</VStack>
			</Container>
		</>
	)
}

Apply.getLayout = RecruitLayout
export default Apply
