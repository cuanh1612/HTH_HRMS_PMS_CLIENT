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
import CoutrySelector from 'components/form/CountrySelector'
import { Input } from 'components/form/Input'
import { Select } from 'components/form/Select'
import { Textarea } from 'components/form/Textarea'
import UploadAvatar from 'components/form/UploadAvatar'
import Loading from 'components/Loading'
import Modal from 'components/Modal'
import { AuthContext } from 'contexts/AuthContext'
import { createClientMutation } from 'mutations/client'
import { useRouter } from 'next/router'
import { allClientCategoriesQuery } from 'queries/clientCategory'
import { allClientSubCategoriesQuery } from 'queries/clientSubCategory'
import { useContext, useEffect, useState } from 'react'
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
import { mutate } from 'swr'
import { IOption } from 'type/basicTypes'
import { ICloudinaryImg, IImg } from 'type/fileType'
import { createClientForm } from 'type/form/auth'
import { dataGender, dataSalutation } from 'utils/basicData'
import { uploadFile } from 'utils/uploadFile'
import { CreateClientValidate } from 'utils/validate'
import ClientCategory from '../client-categories'
import ClientSubCategory from '../client-sub-categories'

export interface IAddClientProps {
	onCloseDrawer?: () => void
}

export default function AddClient({ onCloseDrawer }: IAddClientProps) {
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

	//mutation ----------------------------------------------------------------
	const [mutateCreClient, { status: statusCreClient, data: dataCreClient }] =
		createClientMutation(setToast)

	//Funcion -----------------------------------------------------------------
	const handleUploadAvatar = async () => {
		if (infoImg) {
			setLoadingImg(true)

			const dataUploadAvatar: Array<ICloudinaryImg> = await uploadFile(
				infoImg.files,
				['avatar'],
				true,
				undefined,
				infoImg.options
			)

			setLoadingImg(false)

			return dataUploadAvatar[0]
		}

		return null
	}

	// setForm and submit form create new leave -------------------------------
	const formSetting = useForm<createClientForm>({
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
		resolver: yupResolver(CreateClientValidate),
	})

	const { handleSubmit } = formSetting

	//Handle crete client
	const onSubmit = async (values: createClientForm) => {
		values.can_login = advancedInfo.can_login
		values.can_receive_email = advancedInfo.can_receive_email

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

		//create new client
		mutateCreClient(values)
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
		if (statusCreClient === 'success') {
			mutate('clients')
			//Inform notice success
			if (dataCreClient) {
				setToast({
					type: 'success',
					msg: dataCreClient?.message,
				})
			}

			//Close drawer when using drawer
			if (onCloseDrawer) {
				onCloseDrawer()
			}

			//Reset data form
			formSetting.reset({
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
			})
		}
	}, [statusCreClient])

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

					setOptionSubCategories(newOptionSubCategories)
				}
			}
		})

		return () => subscription.unsubscribe()
	}, [formSetting.watch, dataSubCategories])

	return (
		<>
			<Box pos="relative" p={6} as={'form'} h="auto" onSubmit={handleSubmit(onSubmit)}>
				<Grid templateColumns="repeat(2, 1fr)" gap={6}>
					<GridItem w="100%" colSpan={2}>
						<UploadAvatar
							setInfoImg={(data?: IImg) => {
								setInfoImg(data)
							}}
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
							required
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
							required={true}
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
								onChange={(e) =>
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
								onChange={(e) => {
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
				{(statusCreClient === 'running' || loadingImg) && <Loading />}
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
