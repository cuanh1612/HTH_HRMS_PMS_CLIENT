import { Box, Button, Divider, Grid, GridItem, Text, useDisclosure, VStack } from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import {Loading} from 'components/common'
import { AuthContext } from 'contexts/AuthContext'
import { updateContractMutation } from 'mutations'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { AiOutlineCheck, AiOutlinePhone } from 'react-icons/ai'
import { MdOutlineDriveFileRenameOutline, MdSubject } from 'react-icons/md'
import { updateContractForm } from 'type/form/basicFormType'
import { dataCurrency } from 'utils/basicData'
import { UpdateContractValidate } from 'utils/validate'
//CSS
import { InputNumber, CoutrySelector, Textarea, UploadAvatar, Input, Select } from 'components/form'
import Modal from 'components/modal/Modal'
import {
	allClientsQuery,
	allContractsQuery,
	detailContractQuery,
	allContractTypesQuery,
} from 'queries'
import { BsCalendarDate } from 'react-icons/bs'
import { FaCity } from 'react-icons/fa'
import { GiMatterStates } from 'react-icons/gi'
import 'react-quill/dist/quill.bubble.css'
import 'react-quill/dist/quill.snow.css'
import { IOption } from 'type/basicTypes'
import { ICloudinaryImg, IImg } from 'type/fileType'
import { uploadFile } from 'utils/uploadFile'
import ContractTypes from '../contract-types'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

export interface IUpdateContractProps {
	onCloseDrawer?: () => void
	contractIdUpdate: number | null
}

export default function UpdateContract({ onCloseDrawer, contractIdUpdate }: IUpdateContractProps) {
	const { isAuthenticated, handleLoading, setToast } = useContext(AuthContext)
	const router = useRouter()

	//State ----------------------------------------------------------------------
	const [description, setDescription] = useState<string>('')
	const [optionClients, setOptionClients] = useState<IOption[]>([])
	const [optionContractTypes, setOptionContractTypes] = useState<IOption[]>([])
	const [infoImg, setInfoImg] = useState<IImg>() // state data image upload
	const [loadingImg, setLoadingImg] = useState<boolean>(false) // state loading when image upload

	//Modal ----------------------------------------------------------------------
	const {
		isOpen: isOpenContractType,
		onOpen: onOpenContractType,
		onClose: onCloseContractType,
	} = useDisclosure()

	//Setup modal ----------------------------------------------------------------

	//Query ----------------------------------------------------------------------
	const { data: dataClients } = allClientsQuery(isAuthenticated)
	const { data: dataContractTypes } = allContractTypesQuery()
	const { data: dataDetailContract } = detailContractQuery(isAuthenticated, contractIdUpdate)
	// refetch when add contract success
	const { mutate: refetchAllContracts } = allContractsQuery(isAuthenticated)

	//mutation -------------------------------------------------------------------
	const [mutateUpContract, { status: statusUpContract, data: dataUpContract }] =
		updateContractMutation(setToast)

	// setForm and submit form update contract -----------------------------------
	const formSetting = useForm<updateContractForm>({
		defaultValues: {
			subject: '',
			start_date: undefined,
			end_date: undefined,
			contract_value: 1,
			currency: '',
			client: '',
			cell: '',
			office_phone_number: '',
			city: '',
			state: '',
			country: '',
			postal_code: '',
			alternate_address: '',
			notes: '',
			contract_type: '',
		},
		resolver: yupResolver(UpdateContractValidate),
	})

	const { handleSubmit } = formSetting

	const onSubmit = async (values: updateContractForm) => {
		if (!contractIdUpdate) {
			setToast({
				type: 'error',
				msg: 'Not found contract to update',
			})
		} else {
			//Upload logo
			const dataUploadLogo: ICloudinaryImg | null = await handleUploadImg()

			//Check upload logo success
			if (dataUploadLogo) {
				values.company_logo = {
					name: dataUploadLogo.name,
					url: dataUploadLogo.url,
					public_id: dataUploadLogo.public_id,
				}
			}

			values.description = description
			mutateUpContract({
				inputUpdate: values,
				contractId: contractIdUpdate,
			})
		}
	}

	//Funtion -------------------------------------------------------------------
	const onChangeDescription = (value: string) => {
		setDescription(value)
	}

	const handleUploadImg = async () => {
		if (infoImg) {
			setLoadingImg(true)

			const dataUploadIgm: Array<ICloudinaryImg> = await uploadFile({
				files: infoImg.files,
				tags: ['avatar'],
				raw: false,
				upload_preset: 'huprom-avatar',
				options: infoImg.options,
			})

			setLoadingImg(false)

			return dataUploadIgm[0]
		}

		return null
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

	//Note when request success
	useEffect(() => {
		if (statusUpContract === 'success') {
			//Close drawer when using drawer
			if (onCloseDrawer) {
				onCloseDrawer()
			}

			setToast({
				type: statusUpContract,
				msg: dataUpContract?.message as string,
			})
			refetchAllContracts()
		}
	}, [statusUpContract])

	useEffect(() => {
		if (dataClients?.clients) {
			const newOptionClients: IOption[] = dataClients.clients.map((client) => {
				return {
					value: client.id.toString(),
					label: client.email,
				}
			})

			setOptionClients(newOptionClients)
		}
	}, [dataClients])

	//Set option
	useEffect(() => {
		if (dataContractTypes?.contractTypes) {
			const newOptionContractTypes: IOption[] = dataContractTypes.contractTypes.map(
				(contractType) => {
					return {
						value: contractType.id.toString(),
						label: contractType.name,
					}
				}
			)

			setOptionContractTypes(newOptionContractTypes)
		}
	}, [dataContractTypes])

	//Setting form when have data detail contract
	useEffect(() => {
		if (dataDetailContract?.contract) {
			//set content qill
			setDescription(dataDetailContract.contract.description || '')

			//Set data form
			formSetting.reset({
				subject: dataDetailContract.contract.subject || '',
				start_date: dataDetailContract.contract.start_date || undefined,
				end_date: dataDetailContract.contract.end_date || undefined,
				contract_value: dataDetailContract.contract.contract_value || 1,
				currency: dataDetailContract.contract.currency || '',
				client: dataDetailContract.contract.client.id.toString() || '',
				cell: dataDetailContract.contract.cell || '',
				office_phone_number: dataDetailContract.contract.office_phone_number || '',
				city: dataDetailContract.contract.city || '',
				state: dataDetailContract.contract.state || '',
				country: dataDetailContract.contract.country || '',
				postal_code: dataDetailContract.contract.postal_code || '',
				alternate_address: dataDetailContract.contract.alternate_address || '',
				notes: dataDetailContract.contract.notes || '',
				contract_type: dataDetailContract.contract.contract_type?.id.toString() || '',
			})
		}
	}, [dataDetailContract])

	return (
		<>
			<Box pos="relative" p={6} as={'form'} h="auto" onSubmit={handleSubmit(onSubmit)}>
				<Grid templateColumns="repeat(2, 1fr)" gap={6}>
					<GridItem w="100%" colSpan={2}>
						<Input
							name="subject"
							label="Subject"
							icon={<MdSubject fontSize={'20px'} color="gray" opacity={0.6} />}
							form={formSetting}
							placeholder="Enter Project Subject"
							type="text"
							required
						/>
					</GridItem>

					<GridItem w="100%" colSpan={2}>
						<VStack align={'start'}>
							<Text fontWeight={'normal'} color={'gray.400'}>
								Description
							</Text>
							<ReactQuill
								placeholder="Enter you text"
								modules={{
									toolbar: [
										['bold', 'italic', 'underline', 'strike'], // toggled buttons
										['blockquote', 'code-block'],

										[{ header: 1 }, { header: 2 }], // custom button values
										[{ list: 'ordered' }, { list: 'bullet' }],
										[{ script: 'sub' }, { script: 'super' }], // superscript/subscript
										[{ indent: '-1' }, { indent: '+1' }], // outdent/indent
										[{ direction: 'rtl' }], // text direction

										[{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
										[{ header: [1, 2, 3, 4, 5, 6, false] }],

										[{ color: [] }, { background: [] }], // dropdown with defaults from theme
										[{ font: [] }],
										[{ align: [] }],

										['clean'], // remove formatting button
									],
								}}
								value={description}
								onChange={onChangeDescription}
							/>
						</VStack>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<Input
							name="start_date"
							label="Start Date"
							icon={<BsCalendarDate fontSize={'20px'} color="gray" opacity={0.6} />}
							form={formSetting}
							placeholder="Select start Date"
							type="date"
							required
						/>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<Input
							name="end_date"
							label="End Date"
							icon={<BsCalendarDate fontSize={'20px'} color="gray" opacity={0.6} />}
							form={formSetting}
							placeholder="Select start Date"
							type="date"
						/>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<Select
							name="contract_type"
							label="Contract Type"
							required
							form={formSetting}
							placeholder={'Select Contract Type'}
							options={optionContractTypes}
							isModal={true}
							onOpenModal={onOpenContractType}
						/>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<InputNumber
							name="contract_value"
							label="Contract Value"
							form={formSetting}
							required
							min={1}
						/>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<Select
							name="currency"
							label="Currency"
							required
							form={formSetting}
							placeholder={'Select Currency'}
							options={dataCurrency}
						/>
					</GridItem>
				</Grid>

				<Divider marginY={6} />
				<Text fontSize={20} fontWeight={'semibold'}>
					Client Details
				</Text>

				<Grid templateColumns="repeat(2, 1fr)" gap={6} mt={6}>
					<GridItem w="100%" colSpan={[2, 1]}>
						<Select
							name="client"
							label="Choose Client"
							required
							form={formSetting}
							placeholder={'Select Contract Client'}
							options={optionClients}
						/>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<Input
							name="cell"
							label="Cell"
							icon={<AiOutlinePhone fontSize={'20px'} color="gray" opacity={0.6} />}
							form={formSetting}
							placeholder=""
							type="tel"
						/>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<Input
							name="office_phone_number"
							label="Office Phone Number"
							icon={<AiOutlinePhone fontSize={'20px'} color="gray" opacity={0.6} />}
							form={formSetting}
							placeholder="e.g. +19876543"
							type="tel"
						/>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<Input
							name="city"
							label="City"
							icon={<FaCity fontSize={'20px'} color="gray" opacity={0.6} />}
							form={formSetting}
							placeholder="Enter city"
							type="text"
						/>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<Input
							name="state"
							label="State"
							icon={<GiMatterStates fontSize={'20px'} color="gray" opacity={0.6} />}
							form={formSetting}
							placeholder="Enter state"
							type="text"
						/>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<CoutrySelector name="country" form={formSetting} />
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<Input
							name="postal_code"
							label="Postal code"
							icon={
								<MdOutlineDriveFileRenameOutline
									fontSize={'20px'}
									color="gray"
									opacity={0.6}
								/>
							}
							form={formSetting}
							placeholder="e.g. 90250"
							type="text"
						/>
					</GridItem>
				</Grid>

				<Grid templateColumns="repeat(2, 1fr)" gap={6} mt={6}>
					<GridItem w="100%" colSpan={[2, 1]}>
						<Textarea
							name="alternate_address"
							label="Alternate Address"
							placeholder="Enter alternate Addreess"
							form={formSetting}
						/>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<Textarea name="notes" label="Notes" placeholder="" form={formSetting} />
					</GridItem>

					<GridItem w="100%" colSpan={2}>
						<VStack align={'start'}>
							<Text fontWeight={'normal'} color={'gray.400'}>
								Company Logo
							</Text>
							<VStack
								w={'full'}
								border={'1px'}
								borderColor="gray.200"
								borderRadius={5}
								paddingY={2}
							>
								<UploadAvatar
									setInfoImg={(data?: IImg) => {
										setInfoImg(data)
									}}
									oldImg={dataDetailContract?.contract?.company_logo?.url}
								/>
							</VStack>
						</VStack>
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

				{(statusUpContract === 'running' || loadingImg) && <Loading />}
			</Box>

			{/* Modal contract type */}
			<Modal
				size="3xl"
				isOpen={isOpenContractType}
				onOpen={onOpenContractType}
				onClose={onCloseContractType}
				title="Contract Type"
			>
				<Text>
					<ContractTypes />
				</Text>
			</Modal>
		</>
	)
}
