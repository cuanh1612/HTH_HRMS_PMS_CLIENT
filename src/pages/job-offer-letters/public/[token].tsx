import { ChevronDownIcon } from '@chakra-ui/icons'
import {
	Box,
	Button,
	Container,
	Divider,
	Grid,
	GridItem,
	HStack,
	Image,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Text,
	useDisclosure,
	VStack,
} from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { Head, Loading } from 'components/common'
import { Input } from 'components/form'
import Modal from 'components/modal/Modal'
import { AuthContext } from 'contexts/AuthContext'
import jsPDF from 'jspdf'
import { createSignJobOfferLetterMutation } from 'mutations'
import { updateOfferLetterStatusMutation } from 'mutations/jobOfferLetter'
import { GetServerSideProps } from 'next'
import { companyInfoQuery } from 'queries/companyInfo'
import { publicJobOfferLetterQuery } from 'queries/jobOfferLetter'
import { useContext, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
	AiOutlineCheck,
	AiOutlineCloseCircle,
	AiOutlineDownload,
	AiOutlineMail,
} from 'react-icons/ai'
import { MdOutlineDriveFileRenameOutline } from 'react-icons/md'
import SignaturePad from 'react-signature-canvas'
import { SWRConfig } from 'swr'
import { createSignatureForm } from 'type/form/basicFormType'
import { contractMutationResponse, jobOfferLetterMutationResponse } from 'type/mutationResponses'
import { signBase64Empaty } from 'utils/basicData'
import { getDataBlob, uploadBase64 } from 'utils/uploadFile'
import { CreateSignatureValidate } from 'utils/validate'

export default function PublicContract({
	result,
	token,
}: {
	result: jobOfferLetterMutationResponse
	token: string
}) {
	const { handleLoading, setToast } = useContext(AuthContext)

	//state ------------------------------------------------------------
	const [isUpSignImg, setIsUpSignImg] = useState<boolean>(false)

	//Setup modal ------------------------------------------------------
	const {
		isOpen: isOpenSignature,
		onOpen: onOpenSignature,
		onClose: onCloseSignature,
	} = useDisclosure()

	let signPad: any = useRef({})

	//mutation ---------------------------------------------------------
	const [mutateCreSign, { status: statusCreSign, data: dataCreSign }] =
		createSignJobOfferLetterMutation(setToast)
	const [updateStatus, { status: statusUpdate, data: dataUpdate }] =
		updateOfferLetterStatusMutation(setToast)

	//Query ------------------------------------------------------------ can phai sua lai
	const { data: dataDetailJobOfferLetter, mutate: refetchDetailJobOfferLetter } =
		publicJobOfferLetterQuery(token)
	const { data: dataCompanyInfo } = companyInfoQuery()

	// setForm and submit form create new sign -------------------------
	const formSetting = useForm<createSignatureForm>({
		defaultValues: {
			first_name: '',
			last_name: '',
			email: '',
		},
		resolver: yupResolver(CreateSignatureValidate),
	})

	const { handleSubmit } = formSetting

	const onSubmit = async (values: createSignatureForm) => {
		if (dataDetailJobOfferLetter?.jobOfferLetter?.sign) {
			setToast({
				type: 'error',
				msg: 'Job offer letter has been signed',
			})
		} else {
			const signBase64 = signPad.current.toDataURL()

			if (signBase64 === signBase64Empaty) {
				setToast({
					type: 'warning',
					msg: 'Please sign job offer letter',
				})
			} else {
				//Set img sing
				setIsUpSignImg(true)
				const uploadedSign = await uploadBase64('sign-huprom', signBase64, [values.email])
				setIsUpSignImg(false)

				if (result.jobOfferLetter?.id) {
					mutateCreSign({
						jobOfferLetter: result.jobOfferLetter.id,
						last_name: values.last_name,
						first_name: values.first_name,
						public_id: uploadedSign.public_id as string,
						url: uploadedSign.url as string,
						email: values.email,
					})
				}
			}
		}
	}

	//Function ---------------------------------------------------------
	const onClearSign = () => {
		signPad.current.clear()
	}

	//UseEffect --------------------------------------------------------
	//Handle loading page
	useEffect(() => {
		handleLoading(false)
	}, [])

	//Notice when signed
	useEffect(() => {
		if (statusCreSign === 'success' && dataCreSign) {
			setToast({
				msg: dataCreSign.message,
				type: statusCreSign,
			})
			updateStatus({
				id: result.jobOfferLetter?.id,
				status: 'Accepted',
			})
		}
	}, [statusCreSign])

	// update status successfully
	useEffect(() => {
		if (statusUpdate == 'success' && dataUpdate) {
			if (dataUpdate.message == 'Rejected') {
				setToast({
					msg: 'Rejected offer letter successfully',
					type: 'warning',
				})
			}
			refetchDetailJobOfferLetter()
			//Close modal
			onCloseSignature()
		}
	}, [statusUpdate])

	//Setting react convert to pdf -------------------------------------
	const generatePDF = async () => {
		if (!dataDetailJobOfferLetter?.jobOfferLetter) {
			setToast({
				msg: 'Not found job offer letter to download PDF',
				type: 'error',
			})
		} else {
			var doc = new jsPDF('p', 'pt')

			doc.text(`Offer Letters #${dataDetailJobOfferLetter.jobOfferLetter.id}`, 20, 20)
			doc.setFontSize(12)
			doc.text(
				dataCompanyInfo?.companyInfo.name ? dataCompanyInfo.companyInfo.name : 'HUPROM',
				20,
				60
			)
			doc.text(
				dataCompanyInfo?.companyInfo.website
					? dataCompanyInfo.companyInfo.website
					: 'huprom.com',
				20,
				80
			)
			doc.text(
				dataCompanyInfo?.companyInfo.phone
					? dataCompanyInfo.companyInfo.phone
					: '+84 833876372',
				20,
				100
			)
			doc.text(
				dataCompanyInfo?.companyInfo.email
					? dataCompanyInfo.companyInfo.email
					: 'huynqdev1612@gmail.com',
				20,
				120
			)
			doc.setFontSize(14)
			doc.text('Candidate Detail', 20, 160)
			doc.setFontSize(12)
			doc.text(
				`Candidate Name: #${
					dataDetailJobOfferLetter?.jobOfferLetter?.job_application.name || '--'
				}`,
				20,
				190
			)
			doc.text(
				`Candidate Email: ${
					dataDetailJobOfferLetter?.jobOfferLetter?.job_application.email || '--'
				}`,
				20,
				210
			)

			doc.setFontSize(14)
			doc.text('Job Detail', 20, 250)
			doc.setFontSize(12)
			doc.text(
				`Job title: ${dataDetailJobOfferLetter?.jobOfferLetter?.job.title || '--'}`,
				20,
				280
			)
			doc.text(
				`Work Experience: ${
					dataDetailJobOfferLetter?.jobOfferLetter?.job.work_experience.name || '--'
				}`,
				20,
				300
			)

			doc.setFontSize(14)
			doc.text('Job Offer Detail', 20, 340)
			doc.setFontSize(12)
			doc.text(
				`Salary Offered: ${
					dataDetailJobOfferLetter?.jobOfferLetter?.salary
						? `$ ${dataDetailJobOfferLetter?.jobOfferLetter?.salary}`
						: '--'
				}`,
				20,
				370
			)
			doc.text(
				`Joining Date: ${
					dataDetailJobOfferLetter?.jobOfferLetter?.expected_joining_date || '--'
				}`,
				20,
				390
			)
			doc.text(
				`Last Date Of Acceptance: ${
					dataDetailJobOfferLetter?.jobOfferLetter?.exprise_on || '--'
				}`,
				20,
				410
			)

			if (dataDetailJobOfferLetter?.jobOfferLetter?.sign) {
				doc.setFontSize(14)
				doc.text('Signature', 20, 450)
				dataDetailJobOfferLetter?.jobOfferLetter?.sign?.url &&
					doc.addImage((await parser64IMGSign()) as string, 'png', 0, 470, 300, 150)
				doc.setFontSize(12)
				doc.text(
					`(${dataDetailJobOfferLetter?.jobOfferLetter?.sign?.first_name} ${dataDetailJobOfferLetter?.jobOfferLetter?.sign?.last_name})`,
					20,
					640
				)
			}

			doc.save('demo.pdf')
		}
	}

	const parser64IMGSign = async () => {
		if (dataDetailJobOfferLetter?.jobOfferLetter?.sign?.url) {
			const url = await getDataBlob(dataDetailJobOfferLetter?.jobOfferLetter?.sign?.url)
			return url
		}
	}

	return (
		<SWRConfig
			value={{
				fallback: {
					[token]: result,
				},
			}}
		>
			<Head title={'Public offer letter'} />
			<Box bgColor={'#f2f4f7'} minHeight={'100vh'} p={10}>
				<Container maxW="container.xl" bg="white" color="#262626" borderRadius={5} p={5}>
					<VStack spacing={4} align="start">
						<HStack justify="space-between" wrap={'wrap'} w={'full'}>
							<Image
								boxSize={'50px'}
								src={dataCompanyInfo?.companyInfo.logo_url || '/assets/logo1.svg'}
								alt="Avatar"
								borderRadius={5}
							/>
							<VStack align={'end'}>
								<Text fontSize={20} fontWeight={'bold'}>
									JOB OFFER LETTER
								</Text>
								<Box
									px={2}
									borderRadius={5}
									bgColor={
										dataDetailJobOfferLetter?.jobOfferLetter?.status ===
										'Pending'
											? 'yellow'
											: dataDetailJobOfferLetter?.jobOfferLetter?.status ===
											  'Rejected'
											? 'red'
											: dataDetailJobOfferLetter?.jobOfferLetter?.status ===
											  'Accepted'
											? 'lightgreen'
											: 'white'
									}
								>
									<Text fontSize={20} fontWeight={'semibold'}>
										{dataDetailJobOfferLetter?.jobOfferLetter?.status}
									</Text>
								</Box>
							</VStack>
						</HStack>
						<Grid templateColumns="repeat(2, 1fr)" gap={6} w={'full'}>
							<GridItem w="100%" colSpan={[2, 1]}>
								<Text>
									{dataCompanyInfo?.companyInfo.name
										? dataCompanyInfo.companyInfo.name
										: 'HUPROM'}
								</Text>
								<Text>
									{dataCompanyInfo?.companyInfo.website
										? dataCompanyInfo.companyInfo.website
										: 'huprom.com'}
								</Text>
								<Text>
									{dataCompanyInfo?.companyInfo.phone
										? dataCompanyInfo.companyInfo.phone
										: '+84 833876372'}
								</Text>
								<Text>
									{dataCompanyInfo?.companyInfo.email
										? dataCompanyInfo.companyInfo.email
										: 'huynqdev1612@gmail.com'}
								</Text>
							</GridItem>

							<GridItem w="100%" colSpan={2}>
								<VStack align={'start'}>
									<Text fontSize={20} fontWeight={'semibold'}>
										Candidate Details
									</Text>
									<Grid templateColumns="repeat(4, 1fr)" gap={6} w={'full'}>
										<GridItem w="100%" colSpan={[4, 1]}>
											<Text color={'gray.400'}>Candidate Name:</Text>
										</GridItem>
										<GridItem w="100%" colSpan={[4, 3]}>
											<Text>
												{dataDetailJobOfferLetter?.jobOfferLetter
													?.job_application.name || '--'}
											</Text>
										</GridItem>
										<GridItem w="100%" colSpan={[4, 1]}>
											<Text color={'gray.400'}>Candidate Email:</Text>
										</GridItem>
										<GridItem w="100%" colSpan={[4, 3]}>
											<Text>
												{dataDetailJobOfferLetter?.jobOfferLetter
													?.job_application.email || '--'}
											</Text>
										</GridItem>
									</Grid>
								</VStack>
							</GridItem>

							<GridItem w="100%" colSpan={2}>
								<VStack align={'start'}>
									<Text fontSize={20} fontWeight={'semibold'}>
										Job Details
									</Text>
									<Grid templateColumns="repeat(4, 1fr)" gap={6} w={'full'}>
										<GridItem w="100%" colSpan={[4, 1]}>
											<Text color={'gray.400'}>Job title:</Text>
										</GridItem>
										<GridItem w="100%" colSpan={[4, 3]}>
											<Text>
												{dataDetailJobOfferLetter?.jobOfferLetter?.job
													.title || '--'}
											</Text>
										</GridItem>
										<GridItem w="100%" colSpan={[4, 1]}>
											<Text color={'gray.400'}>Work Experience:</Text>
										</GridItem>
										<GridItem w="100%" colSpan={[4, 3]}>
											<Text>
												{dataDetailJobOfferLetter?.jobOfferLetter?.job
													?.work_experience?.name || '--'}
											</Text>
										</GridItem>
									</Grid>
								</VStack>
							</GridItem>

							<GridItem w="100%" colSpan={2}>
								<VStack align={'start'}>
									<Text fontSize={20} fontWeight={'semibold'}>
										Offer Details
									</Text>
									<Grid templateColumns="repeat(4, 1fr)" gap={6} w={'full'}>
										<GridItem w="100%" colSpan={[4, 1]}>
											<Text color={'gray.400'}>Salary Offered:</Text>
										</GridItem>
										<GridItem w="100%" colSpan={[4, 3]}>
											<Text>
												{dataDetailJobOfferLetter?.jobOfferLetter?.salary
													? `$ ${dataDetailJobOfferLetter?.jobOfferLetter?.salary}`
													: '--'}
											</Text>
										</GridItem>
										<GridItem w="100%" colSpan={[4, 1]}>
											<Text color={'gray.400'}>Joining Date:</Text>
										</GridItem>
										<GridItem w="100%" colSpan={[4, 3]}>
											<Text>
												{dataDetailJobOfferLetter?.jobOfferLetter
													?.expected_joining_date || '--'}
											</Text>
										</GridItem>
										<GridItem w="100%" colSpan={[4, 1]}>
											<Text color={'gray.400'}>Last Date Of Acceptance:</Text>
										</GridItem>
										<GridItem w="100%" colSpan={[4, 3]}>
											<Text>
												{dataDetailJobOfferLetter?.jobOfferLetter
													?.exprise_on || '--'}
											</Text>
										</GridItem>
									</Grid>
								</VStack>
							</GridItem>
						</Grid>

						<Divider />

						<VStack width={'full'} align={'start'}>
							{dataDetailJobOfferLetter?.jobOfferLetter?.sign && (
								<>
									<Text>Signature</Text>
									<Image
										src={dataDetailJobOfferLetter?.jobOfferLetter?.sign.url}
										alt={`${dataDetailJobOfferLetter?.jobOfferLetter?.sign.first_name} ${dataDetailJobOfferLetter?.jobOfferLetter?.sign.last_name}`}
									/>
									<Text fontSize={13}>
										(
										{dataDetailJobOfferLetter?.jobOfferLetter?.sign.first_name +
											dataDetailJobOfferLetter?.jobOfferLetter?.sign
												.last_name}
										)
									</Text>
								</>
							)}
						</VStack>
						{dataDetailJobOfferLetter &&
							!dataDetailJobOfferLetter.jobOfferLetter?.status.includes(
								'Rejected'
							) && (
								<VStack spacing={4} width={'full'}>
									<HStack justify={'end'} w={'full'}>
										<Menu placement="top-end">
											<MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
												Actions
											</MenuButton>
											<MenuList>
												{!dataDetailJobOfferLetter?.jobOfferLetter
													?.sign && (
													<MenuItem
														onClick={onOpenSignature}
														icon={<AiOutlineCheck fontSize={15} />}
													>
														Sign
													</MenuItem>
												)}
												<MenuItem
													onClick={() => {
														updateStatus({
															id: result.jobOfferLetter?.id,
															status: 'Rejected',
														})
													}}
													icon={<AiOutlineCloseCircle fontSize={15} />}
												>
													Rejected
												</MenuItem>
												<MenuItem
													onClick={generatePDF}
													icon={<AiOutlineDownload fontSize={15} />}
												>
													Download
												</MenuItem>
											</MenuList>
										</Menu>
									</HStack>
								</VStack>
							)}
					</VStack>
				</Container>

				{/* Modal signature */}
				<Modal
					size="3xl"
					isOpen={isOpenSignature}
					onOpen={onOpenSignature}
					onClose={onCloseSignature}
					title="Job Offer Letter Sign"
				>
					<Box
						pos="relative"
						p={6}
						as={'form'}
						h="auto"
						onSubmit={handleSubmit(onSubmit)}
					>
						<Grid templateColumns="repeat(3, 1fr)" gap={6}>
							<GridItem w="100%" colSpan={[3, 1]}>
								<Input
									name="first_name"
									label="First Name"
									icon={
										<MdOutlineDriveFileRenameOutline
											fontSize={'20px'}
											color="gray"
											opacity={0.6}
										/>
									}
									form={formSetting}
									placeholder="Enter First Name"
									type="text"
									required
								/>
							</GridItem>

							<GridItem w="100%" colSpan={[3, 1]}>
								<Input
									name="last_name"
									label="Last Name"
									icon={
										<MdOutlineDriveFileRenameOutline
											fontSize={'20px'}
											color="gray"
											opacity={0.6}
										/>
									}
									form={formSetting}
									placeholder="Enter Last Name"
									type="text"
									required
								/>
							</GridItem>

							<GridItem w="100%" colSpan={[3, 1]}>
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
									placeholder="Enter Email"
									type="email"
									required
								/>
							</GridItem>

							<GridItem w="100%" colSpan={3} bgColor={'#f2f4f7'} p={4}>
								<VStack align={'start'}>
									<Text color={'gray.400'}>
										Signature <span style={{ color: 'red' }}>*</span>
									</Text>
									<SignaturePad ref={signPad} backgroundColor={'white'} />
								</VStack>
							</GridItem>
						</Grid>

						<HStack justify={'end'} mt={4}>
							<Button onClick={onClearSign}>Clear</Button>
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
								type="submit"
							>
								Save
							</Button>
						</HStack>

						{(statusCreSign === 'running' || isUpSignImg) && <Loading />}
					</Box>
				</Modal>
			</Box>
		</SWRConfig>
	)
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	const getAccessToken: contractMutationResponse = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/api/job-offer-letters/public/${context.query.token}`,
		{
			method: 'GET',
			headers: {
				cookie: context.req.headers.cookie,
			} as HeadersInit,
		}
	).then((e) => e.json())

	if (!getAccessToken.success) {
		return {
			notFound: true,
		}
	}

	return {
		props: {
			result: getAccessToken,
			token: context.query.token,
		},
	}
}
