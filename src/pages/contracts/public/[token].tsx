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
	Table,
	TableContainer,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
	useDisclosure,
	VStack
} from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { Head, Loading } from 'components/common'
import { Input } from 'components/form'
import Modal from 'components/modal/Modal'
import { AuthContext } from 'contexts/AuthContext'
import { convert } from 'html-to-text'
import jsPDF from 'jspdf'
import { createSignContractMutation } from 'mutations'
import { GetServerSideProps } from 'next'
import Link from 'next/link'
import { publicContractQuery } from 'queries'
import { useContext, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { AiOutlineCheck, AiOutlineDownload, AiOutlineMail } from 'react-icons/ai'
import { MdOutlineDriveFileRenameOutline } from 'react-icons/md'
import SignaturePad from 'react-signature-canvas'
import { SWRConfig } from 'swr'
import { createSignatureForm } from 'type/form/basicFormType'
import { contractMutationResponse } from 'type/mutationResponses'
import { signBase64Empaty } from 'utils/basicData'
import { getDataBlob, uploadBase64 } from 'utils/uploadFile'
import { CreateSignatureValidate } from 'utils/validate'

export default function PublicContract({
	result,
	token,
}: {
	result: contractMutationResponse
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

	//Useref -----------------------------------------------------------
	let signPad: any = useRef({})

	//mutation ---------------------------------------------------------
	const [mutateCreSign, { status: statusCreSign, data: dataCreSign }] =
		createSignContractMutation(setToast)

	//Query ------------------------------------------------------------
	const { data: dataDetailContract, mutate: refetchDetailContract } = publicContractQuery(token)

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
		if (dataDetailContract?.contract?.sign) {
			setToast({
				type: 'error',
				msg: 'Contract has been signed',
			})
		} else {
			const signBase64 = signPad.current.toDataURL()

			if (signBase64 === signBase64Empaty) {
				setToast({
					type: 'warning',
					msg: 'Please sign contract',
				})
			} else {
				//Set img sing
				setIsUpSignImg(true)
				const uploadedSign = await uploadBase64('sign-huprom', signBase64, [values.email])
				setIsUpSignImg(false)

				if (result.contract?.id) {
					mutateCreSign({
						contract: result.contract.id,
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

			refetchDetailContract()

			//Close modal
			onCloseSignature()
		}
	}, [statusCreSign])

	//Setting react convert to pdf -------------------------------------
	const generatePDF = async () => {
		if (!dataDetailContract?.contract) {
			setToast({
				msg: 'Not found contract to download PDF',
				type: 'error',
			})
		} else {
			var doc = new jsPDF('p', 'pt')

			doc.text(`Contract #${result.contract?.id}`, 20, 20)
			doc.setFontSize(12)
			doc.text('HUPROM', 20, 60)
			doc.text('xx Nguyen Xi Street - Gia Lai - Viet Nam', 20, 80)
			doc.text('+84 833876372', 20, 100)
			doc.setFontSize(14)
			doc.text('Main Contract', 20, 140)
			doc.setFontSize(12)
			doc.text(`Contract Number: #${result.contract?.id}`, 20, 170)
			doc.text(`Start Date: ${dataDetailContract?.contract?.start_date}`, 20, 190)
			doc.text(`End Date: ${dataDetailContract?.contract?.end_date}`, 20, 210)
			doc.setFontSize(14)
			doc.text('Client', 20, 250)
			doc.setFontSize(12)
			doc.text(`${dataDetailContract?.contract?.client.name}`, 20, 280)
			doc.text(`${dataDetailContract?.contract?.client.company_name}`, 20, 300)
			doc.text(`${dataDetailContract?.contract?.client.company_address}`, 20, 320)
			doc.setFontSize(14)
			doc.text('Subject', 20, 360)
			doc.setFontSize(12)
			doc.text(`${dataDetailContract?.contract?.subject}`, 20, 390)
			doc.setFontSize(14)
			doc.text('Description', 20, 430)
			doc.setFontSize(12)
			doc.text(
				convert(
					dataDetailContract?.contract?.description
						? dataDetailContract?.contract?.description
						: '',
					{
						wordwrap: 130,
					}
				),
				20,
				450
			)
			doc.setFontSize(14)
			doc.text(
				`Contract Value: ${dataDetailContract?.contract?.contract_value} ${dataDetailContract?.contract?.currency}`,
				20,
				490
			)
			doc.text('Signature', 20, 530)
			dataDetailContract?.contract?.sign?.url &&
				doc.addImage((await parser64IMGSign()) as string, 'png', 0, 550, 300, 150)
			doc.setFontSize(12)
			doc.text(
				`(${dataDetailContract?.contract?.sign?.first_name} ${dataDetailContract?.contract?.sign?.last_name})`,
				20,
				720
			)

			doc.save('demo.pdf')
		}
	}

	const parser64IMGSign = async () => {
		if (dataDetailContract?.contract?.sign?.url) {
			const url = await getDataBlob(dataDetailContract?.contract?.sign?.url)
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
			<Head title={'Public contract'}/>
			<Box bgColor={'#f2f4f7'} minHeight={'100vh'} p={10}>
				<Container maxW="container.xl" bg="white" color="#262626" borderRadius={5} p={5}>
					<VStack spacing={4} align="start">
						<HStack justify="space-between" wrap={'wrap'} w={'full'}>
							<Image
								boxSize={'50px'}
								src="https://bit.ly/dan-abramov"
								alt="Dan Abramov"
								borderRadius={5}
							/>
							<Text fontSize={20} fontWeight={'bold'}>
								CONTRACT
							</Text>
						</HStack>
						<Grid templateColumns="repeat(2, 1fr)" gap={6} w={'full'}>
							<GridItem w="100%" colSpan={[2, 1]}>
								<Text>HUPROM</Text>
								<Text>xx Nguyen Xi Street - Gia Lai - Viet Nam</Text>
								<Text>+84 833876372</Text>
							</GridItem>

							<GridItem w="100%" colSpan={[2, 1]}>
								<VStack align={'end'}>
									<TableContainer
										border={'1px'}
										borderRadius={5}
										borderColor={'gray.300'}
									>
										<Table variant="simple">
											<Thead>
												<Tr>
													<Th>Main Contract</Th>
													<Th>Value</Th>
												</Tr>
											</Thead>
											<Tbody>
												<Tr>
													<Td>Contract Number</Td>
													<Td>#{dataDetailContract?.contract?.id}</Td>
												</Tr>
												<Tr>
													<Td>Start Date</Td>
													<Td>
														{dataDetailContract?.contract?.start_date}
													</Td>
												</Tr>
												<Tr>
													<Td>End Date</Td>
													<Td>
														{dataDetailContract?.contract?.end_date}
													</Td>
												</Tr>
											</Tbody>
										</Table>
									</TableContainer>
								</VStack>
							</GridItem>

							<GridItem w="100%" colSpan={2}>
								<VStack align={'start'}>
									<Text color={'gray.400'}>Client</Text>
									<Box>
										<Text>{dataDetailContract?.contract?.client.name}</Text>
										<Text>
											{dataDetailContract?.contract?.client.company_name}
										</Text>
										<Text>
											{dataDetailContract?.contract?.client.company_address}
										</Text>
									</Box>
								</VStack>
							</GridItem>

							<GridItem w="100%" colSpan={2}>
								<VStack align={'start'}>
									<Text fontWeight={'semibold'}>Subject</Text>
									<Text>{dataDetailContract?.contract?.subject}</Text>
								</VStack>
							</GridItem>

							<GridItem w="100%" colSpan={2}>
								<VStack align={'start'}>
									<Text fontWeight={'semibold'}>Description</Text>
									<div
										dangerouslySetInnerHTML={{
											__html: dataDetailContract?.contract?.description
												? dataDetailContract?.contract.description
												: '',
										}}
									/>
								</VStack>
							</GridItem>
						</Grid>

						<Divider />

						<VStack width={'full'} align={'start'}>
							{dataDetailContract?.contract?.sign && (
								<>
									<Text>Signature</Text>
									<Image
										src={dataDetailContract.contract.sign.url}
										alt="Avatar"
									/>
									<Text fontSize={13}>
										(
										{dataDetailContract.contract.sign.first_name +
											dataDetailContract.contract.sign.last_name}
										)
									</Text>
								</>
							)}
						</VStack>

						<VStack spacing={4} width={'full'}>
							<VStack align={'end'} w={'full'}>
								<Text fontSize={20} fontWeight={'bold'}>
									Contract Value:{' '}
									{`${dataDetailContract?.contract?.contract_value} ${dataDetailContract?.contract?.currency}`}
								</Text>
							</VStack>

							<HStack justify={'end'} w={'full'}>
								<Link href={'/contracts'} passHref>
									<Button colorScheme="red" variant="ghost">
										<a>Cancel</a>
									</Button>
								</Link>

								<Menu placement="top-end">
									<MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
										Actions
									</MenuButton>
									<MenuList>
										{!dataDetailContract?.contract?.sign && (
											<MenuItem
												onClick={onOpenSignature}
												icon={<AiOutlineCheck fontSize={15} />}
											>
												Sign
											</MenuItem>
										)}
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
					</VStack>
				</Container>

				{/* Modal signature */}
				<Modal
					size="3xl"
					isOpen={isOpenSignature}
					onOpen={onOpenSignature}
					onClose={onCloseSignature}
					title="Contract Sign"
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
		`${process.env.NEXT_PUBLIC_API_URL}/api/contracts/public/${context.query.token}`,
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
