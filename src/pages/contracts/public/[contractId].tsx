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
	VStack,
} from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { Input } from 'components/form/Input'
import Modal from 'components/Modal'
import { AuthContext } from 'contexts/AuthContext'
import { GetStaticPaths, GetStaticProps } from 'next'
import Link from 'next/link'
import { useContext, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { AiOutlineCheck, AiOutlineDownload, AiOutlineMail } from 'react-icons/ai'
import { MdOutlineDriveFileRenameOutline } from 'react-icons/md'
import SignaturePad from 'react-signature-canvas'
import { createSignatureForm } from 'type/form/basicFormType'
import { contractMutaionResponse } from 'type/mutationResponses'
import { CreateSignatureValidate } from 'utils/validate'
import { convert } from 'html-to-text'
import { createSignMutation } from 'mutations/sign'
import { signBase64Empaty } from 'utils/basicData'

export interface IPublickContractProps {
	detailContract: contractMutaionResponse
}

export default function PublickContract({ detailContract }: IPublickContractProps) {
	const { isAuthenticated, handleLoading, setToast } = useContext(AuthContext)

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
		createSignMutation(setToast)

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
		const signBase64 = signPad.current.toDataURL()
		if (signBase64 === signBase64Empaty) {
			setToast({
				type: 'warning',
				msg: 'Please sign contract',
			})
		} else {
			console.log(values)
		}
	}

	//Function ---------------------------------------------------------
	const onClearSign = () => {
		signPad.current.clear()
	}

	const onSaveSign = () => {
		const data = signPad.current.toDataURL()
		console.log(data)
	}

	//Useeffect --------------------------------------------------------
	//Handle loading page
	useEffect(() => {
		handleLoading(false)
	}, [isAuthenticated])

	return (
		<Box bgColor={'#f2f4f7'} h={'100vh'} p={10}>
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
							<Text>Company address</Text>
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
												<Td>#{detailContract.contract?.id}</Td>
											</Tr>
											<Tr>
												<Td>Start Date</Td>
												<Td>{detailContract.contract?.start_date}</Td>
											</Tr>
											<Tr>
												<Td>End Date</Td>
												<Td>{detailContract.contract?.end_date}</Td>
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
									<Text>{detailContract.contract?.client.name}</Text>
									<Text>{detailContract.contract?.client.company_name}</Text>
									<Text>{detailContract.contract?.client.company_address}</Text>
								</Box>
							</VStack>
						</GridItem>

						<GridItem w="100%" colSpan={2}>
							<VStack align={'start'}>
								<Text fontWeight={'semibold'}>Subject</Text>
								<Text>{detailContract.contract?.subject}</Text>
							</VStack>
						</GridItem>

						<GridItem w="100%" colSpan={2}>
							<VStack align={'start'}>
								<Text fontWeight={'semibold'}>Description</Text>
								<Box>
									{detailContract.contract?.description
										? convert(detailContract.contract.description, {
												wordwrap: 130,
										  })
										: ''}
								</Box>
							</VStack>
						</GridItem>
					</Grid>

					<Divider />

					<VStack align={'end'} w={'full'}>
						<Text fontSize={20} fontWeight={'bold'}>
							Contract Value:{' '}
							{`${detailContract.contract?.contract_value} ${detailContract.contract?.currency}`}
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
								<MenuItem
									onClick={onOpenSignature}
									icon={<AiOutlineCheck fontSize={15} />}
								>
									Sign
								</MenuItem>
								<MenuItem icon={<AiOutlineDownload fontSize={15} />}>
									Download
								</MenuItem>
							</MenuList>
						</Menu>
					</HStack>
				</VStack>
			</Container>

			{/* Modal signature */}
			<Modal
				size="3xl"
				isOpen={isOpenSignature}
				onOpen={onOpenSignature}
				onClose={onCloseSignature}
				title="Contract Type"
			>
				<Divider />
				<Box pos="relative" p={6} as={'form'} h="auto" onSubmit={handleSubmit(onSubmit)}>
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
									<AiOutlineMail fontSize={'20px'} color="gray" opacity={0.6} />
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
						<Button onClick={onSaveSign}>Clear</Button>
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

					{/* {(statusCreContract === 'running' || loadingImg) && <Loading />} */}
				</Box>
				<Divider />
			</Modal>
		</Box>
	)
}

export const getStaticProps: GetStaticProps = async (contexts) => {
	//Get detail contract
	const detailContract: contractMutaionResponse = await fetch(
		`http://localhost:4000/api/contracts/${contexts.params?.contractId}`
	).then((e) => e.json())

	return {
		props: {
			detailContract,
		},
		// Next.js will attempt to re-generate the page:
		// - When a request comes in
		// - At most once every 10 seconds
		revalidate: 10, // In seconds
	}
}

export const getStaticPaths: GetStaticPaths = async () => {
	const res = await fetch('http://localhost:4000/api/contracts').then((result) => result.json())
	const contracts = res.contracts

	// Get the paths we want to pre-render based on leave
	const paths = contracts.map((contract: any) => ({
		params: { contractId: String(contract.id) },
	}))

	// We'll pre-render only these paths at build time.
	// { fallback: blocking } will server-render pages
	// on-demand if the path doesn't exist.
	return { paths, fallback: false }
}
