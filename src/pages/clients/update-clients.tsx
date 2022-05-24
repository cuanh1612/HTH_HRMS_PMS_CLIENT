import {
	Box,
	Button,
	Checkbox,
	Divider,
	Grid,
	GridItem,
	Text,
	useDisclosure,
	VStack,
} from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { CoutrySelector, Input, Select, Textarea, UploadAvatar } from 'components/form'
import {Loading} from 'components/common'
import Modal from 'components/modal/Modal'
import { AuthContext } from 'contexts/AuthContext'
import { updateClientMutation } from 'mutations'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { detailClientQuery, allClientCategoriesQuery, allClientSubCategoriesQuery } from 'queries'
import { ChangeEvent, useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { AiOutlineCheck, AiOutlineMail, AiOutlinePhone } from 'react-icons/ai'
import { FaCity } from 'react-icons/fa'
import { GiMatterStates } from 'react-icons/gi'
import {
	MdDriveFileRenameOutline,
	MdOutlineDriveFileRenameOutline,
	MdPassword,
} from 'react-icons/md'
import { SiCurl } from 'react-icons/si'
import { IOption } from 'type/basicTypes'
import { ICloudinaryImg, IImg } from 'type/fileType'
import { updateClientForm } from 'type/form/basicFormType'
import { dataGender, dataSalutation } from 'utils/basicData'
import { uploadFile } from 'utils/uploadFile'
import { UpdateClientValidate } from 'utils/validate'
import ClientCategory from '../client-categories'
import ClientSubCategory from '../client-sub-categories'
//CSS
import 'react-quill/dist/quill.bubble.css'
import 'react-quill/dist/quill.snow.css'
import { mutate } from 'swr'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

export interface IAddClientProps {
	onCloseDrawer?: () => void
	clientUpdateId: number | null
}

export default function UpdateClient({ onCloseDrawer, clientUpdateId }: IAddClientProps) {
	console.log(clientUpdateId)
	const { isAuthenticated, handleLoading, setToast } = useContext(AuthContext)
	const router = useRouter()

	//State -------------------------------------------------------------------
	const [optionCategories, setOptionCategories] = useState<IOption[]>([])
	const [optionSubCategories, setOptionSubCategories] = useState<IOption[]>([])
	const [advancedInfo, setAdvancedInfo] = useState({
		can_login: false,
		can_receive_email: false,
	})
	const [infoImg, setInfoImg] = useState<IImg>() // state data image upload
	const [loadingImg, setLoadingImg] = useState<boolean>(false) // state loading when image upload
	const [note, setNote] = useState('')

	//Setup modal -------------------------------------------------------------
	const {
		isOpen: isOpenCategory,
		onOpen: onOpenCategory,
		onClose: onCloseCategory,
	} = useDisclosure()

	const {
		isOpen: isOpenSubCategory,
		onOpen: onOpenSubCategory,
		onClose: onCloseSubCategory,
	} = useDisclosure()

	//Query -------------------------------------------------------------------
	const { data: dataCategories } = allClientCategoriesQuery()
	const { data: dataSubCategories } = allClientSubCategoriesQuery()
	const { data: dataDetailClient } = detailClientQuery(isAuthenticated, clientUpdateId)

	//mutation ----------------------------------------------------------------
	const [mutateUpClient, { status: statusUpClient, data: dataUpClient }] =
		updateClientMutation(setToast)

	//Funcion -----------------------------------------------------------------
	//Handle change content editor
	const handleChangeNote = (value: any) => {
		setNote(value)
	}

	const handleUploadAvatar = async () => {
		if (infoImg) {
			setLoadingImg(true)

			const dataUploadAvatar: Array<ICloudinaryImg> = await uploadFile({
				files: infoImg.files,
				tags: ['avatar'],
				raw: false,
				upload_preset: 'huprom-avatar',
				options: infoImg.options,
			})

			setLoadingImg(false)

			return dataUploadAvatar[0]
		}

		return null
	}

	// setForm and submit form create new leave -------------------------------
	const formSetting = useForm<updateClientForm>({
		defaultValues: {
			salutation: '',
			name: '',
			email: '',
			password: '',
			mobile: '',
			country: '',
			gender: '',
			company_name: '',
			official_website: '',
			gst_vat_number: '',
			office_phone_number: '',
			city: '',
			state: '',
			postal_code: '',
			company_address: '',
			shipping_address: '',
			client_category: '',
			client_sub_category: '',
		},
		resolver: yupResolver(UpdateClientValidate),
	})

	const { handleSubmit } = formSetting

	//Handle update client
	const onSubmit = async (values: updateClientForm) => {
		//Check client update id
		if (!clientUpdateId) {
			setToast({
				type: 'error',
				msg: 'Not found client to update',
			})
		} else {
			values.can_login = advancedInfo.can_login
			values.can_receive_email = advancedInfo.can_receive_email
			values.note = note

			//Upload avatar
			const dataUploadAvattar: ICloudinaryImg | null = await handleUploadAvatar()

			//Check upload avatar success
			if (dataUploadAvattar) {
				values.avatar = {
					name: dataUploadAvattar.name,
					url: dataUploadAvattar.url,
					public_id: dataUploadAvattar.public_id,
				}
			}

			//update client
			mutateUpClient({
				clientId: clientUpdateId,
				inputeUpdate: values,
			})
		}
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

	//Setting form when have data detail client
	useEffect(() => {
		if (dataDetailClient?.client) {
			//Set data advanced
			setAdvancedInfo({
				can_login: dataDetailClient.client.can_login,
				can_receive_email: dataDetailClient.client.can_receive_email,
			})

			//Set data note
			setNote(dataDetailClient.client.note ? dataDetailClient.client.note : '')

			//Set data form
			formSetting.reset({
				salutation: dataDetailClient.client.salutation || '',
				name: dataDetailClient.client.name || '',
				email: dataDetailClient.client.email || '',
				password: '',
				mobile: dataDetailClient.client.mobile || '',
				country: dataDetailClient.client.country || '',
				gender: dataDetailClient.client.gender || '',
				company_name: dataDetailClient.client.company_name || '',
				official_website: dataDetailClient.client.official_website || '',
				gst_vat_number: dataDetailClient.client.gst_vat_number || '',
				office_phone_number: dataDetailClient.client.office_phone_number || '',
				city: dataDetailClient.client.city || '',
				state: dataDetailClient.client.state || '',
				postal_code: dataDetailClient.client.postal_code || '',
				company_address: dataDetailClient.client.company_address || '',
				shipping_address: dataDetailClient.client.shipping_address || '',
				client_category: dataDetailClient.client.client_category?.id.toString() || '',
				client_sub_category:
					dataDetailClient.client.client_sub_category?.id.toString() || '',
			})

			//Set option sub category
			if (
				dataDetailClient.client.client_category &&
				dataDetailClient.client.client_sub_category
			) {
				let newOptionSubCategories: IOption[] = []

				//Check if client category is exist
				if (dataSubCategories?.clientSubCategories) {
					dataSubCategories.clientSubCategories.map((subCategory) => {
						if (
							subCategory.client_category.id.toString() ===
							dataDetailClient.client?.client_category?.id.toString()
						) {
							const newOption: IOption = {
								value: subCategory.id.toString(),
								label: subCategory.name,
							}
							newOptionSubCategories.push(newOption)
						}
					})
				}

				setOptionSubCategories(newOptionSubCategories)
			}
			console.log(dataDetailClient.client)
		}
	}, [dataDetailClient])

	//Set option client catetgory
	useEffect(() => {
		if (dataCategories?.clientCategories) {
			const newOptionCategories: IOption[] = dataCategories.clientCategories.map(
				(category) => {
					return {
						value: category.id.toString(),
						label: category.name,
					}
				}
			)

			setOptionCategories(newOptionCategories)
		}
	}, [dataCategories])

	//Note when request success
	useEffect(() => {
		if (statusUpClient === 'success') {
			mutate('clients')
			//Inform notice success
			if (dataUpClient) {
				setToast({
					type: 'success',
					msg: dataUpClient?.message,
				})
			}

			//Close drawer when using drawer
			if (onCloseDrawer) {
				onCloseDrawer()
			}
		}
	}, [statusUpClient])

	//Set data option sub category when parent client category change
	useEffect(() => {
		const subscription = formSetting.watch((value, { name }) => {
			//If client category change
			if (name === 'client_category') {
				//Set data option sub category
				if (dataSubCategories?.clientSubCategories) {
					let newOptionSubCategories: IOption[] = []

					//Check if client category is exist
					if (value.client_category) {
						dataSubCategories.clientSubCategories.map((subCategory) => {
							if (
								subCategory.client_category.id.toString() === value.client_category
							) {
								const newOption: IOption = {
									value: subCategory.id.toString(),
									label: subCategory.name,
								}
								newOptionSubCategories.push(newOption)
							}
						})
					}

					formSetting.setValue('client_sub_category', '')
					setOptionSubCategories(newOptionSubCategories)
				}
			}
		})

		return () => subscription.unsubscribe()
	}, [formSetting.watch, dataDetailClient])

	return (
		<>
			<Box pos="relative" p={6} as={'form'} h="auto" onSubmit={handleSubmit(onSubmit)}>
				<Grid templateColumns="repeat(2, 1fr)" gap={6}>
					<GridItem w="100%" colSpan={2}>
						<UploadAvatar
							setInfoImg={(data?: IImg) => {
								setInfoImg(data)
							}}
							oldImg={dataDetailClient?.client?.avatar?.url}
						/>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<Select
							name="salutation"
							label="Salutation"
							required={false}
							form={formSetting}
							placeholder={'Select Salutation'}
							options={dataSalutation}
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
							placeholder="Enter employee name"
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
							placeholder="Enter employee email"
							type="email"
							required
						/>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<Input
							name="password"
							label="Password"
							icon={<MdPassword fontSize={'20px'} color="gray" opacity={0.6} />}
							form={formSetting}
							placeholder="Enter employee password"
							type="password"
						/>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<Input
							name="mobile"
							label="Mobile"
							icon={<AiOutlinePhone fontSize={'20px'} color="gray" opacity={0.6} />}
							form={formSetting}
							placeholder="Enter mobile"
							type="tel"
							required
						/>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<Select
							name="gender"
							label="Gender"
							required={false}
							form={formSetting}
							placeholder={'Select Gender'}
							options={dataGender}
						/>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<Select
							name="client_category"
							label="Client Category"
							required={false}
							form={formSetting}
							placeholder={'Select client category'}
							options={optionCategories}
							isModal={true}
							onOpenModal={onOpenCategory}
						/>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<Select
							name="client_sub_category"
							label="Client Sub Category"
							required={false}
							form={formSetting}
							placeholder={'Select client sub category'}
							options={optionSubCategories}
							isModal={true}
							onOpenModal={onOpenSubCategory}
						/>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<VStack alignItems={'start'}>
							<Checkbox
								colorScheme={'teal'}
								isChecked={advancedInfo.can_login}
								onChange={(e: ChangeEvent<HTMLInputElement>) =>
									setAdvancedInfo({
										...advancedInfo,
										can_login: e.currentTarget.checked,
									})
								}
							>
								Can login to app
							</Checkbox>
						</VStack>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<VStack alignItems={'start'}>
							<Checkbox
								colorScheme={'teal'}
								isChecked={advancedInfo.can_receive_email}
								onChange={(e: ChangeEvent<HTMLInputElement>) => {
									setAdvancedInfo({
										...advancedInfo,
										can_receive_email: e.currentTarget.checked,
									})
								}}
							>
								Can receive email notifications
							</Checkbox>
						</VStack>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<CoutrySelector name="country" form={formSetting} />
					</GridItem>
				</Grid>

				<Divider marginY={6} />
				<Text fontSize={20} fontWeight={'semibold'}>
					Company Details
				</Text>

				<Grid templateColumns="repeat(2, 1fr)" gap={6} mt={6}>
					<GridItem w="100%" colSpan={[2, 1]}>
						<Input
							name="company_name"
							label="Company Name"
							icon={
								<MdOutlineDriveFileRenameOutline
									fontSize={'20px'}
									color="gray"
									opacity={0.6}
								/>
							}
							form={formSetting}
							placeholder="e.g. ABC Copany"
							type="text"
						/>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<Input
							name="official_website"
							label="Official Website"
							icon={<SiCurl fontSize={'20px'} color="gray" opacity={0.6} />}
							form={formSetting}
							placeholder="e.g. https://www.spacex.com"
							type="text"
						/>
					</GridItem>

					<GridItem w="100%" colSpan={[2, 1]}>
						<Input
							name="gst_vat_number"
							label="GST/VAT Number"
							icon={
								<MdOutlineDriveFileRenameOutline
									fontSize={'20px'}
									color="gray"
									opacity={0.6}
								/>
							}
							form={formSetting}
							placeholder="e.g. 18AABCU960XXXXX"
							type="text"
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
							required
						/>
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

					<GridItem w="100%" colSpan={2}>
						<Textarea
							name="company_address"
							label="Company Address"
							placeholder="Enter company address"
							form={formSetting}
						/>
					</GridItem>

					<GridItem w="100%" colSpan={2}>
						<Textarea
							name="shipping_address"
							label="Shipping Address"
							placeholder="Enter shipping address"
							form={formSetting}
						/>
					</GridItem>

					<GridItem w="100%" colSpan={2}>
						<VStack align={'start'}>
							<Text>Note</Text>
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
								value={note}
								onChange={handleChangeNote}
							/>
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
				{(statusUpClient === 'running' || loadingImg) && <Loading />}
			</Box>

			{/* Modal client category and client sub category */}
			<Modal
				size="3xl"
				isOpen={isOpenCategory}
				onOpen={onOpenCategory}
				onClose={onCloseCategory}
				title="Client Category"
			>
				<Text>
					<ClientCategory />
				</Text>
			</Modal>

			<Modal
				size="3xl"
				isOpen={isOpenSubCategory}
				onOpen={onOpenSubCategory}
				onClose={onCloseSubCategory}
				title="Client Sub Category"
			>
				<Text>
					<ClientSubCategory />
				</Text>
			</Modal>
		</>
	)
}
