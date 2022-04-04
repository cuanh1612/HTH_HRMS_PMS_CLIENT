import { Box, Button, Divider, Grid, GridItem, Text } from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import CoutrySelector from 'components/form/CountrySelector'
import { Input } from 'components/form/Input'
import { Select } from 'components/form/Select'
import { Textarea } from 'components/form/Textarea'
import { AuthContext } from 'contexts/AuthContext'
import { useRouter } from 'next/router'
import { allClientCategoriesQuery } from 'queries/clientCategory'
import { allClientSubCategoriesQuery } from 'queries/clientSubCategory'
import { useContext, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { AiOutlineCheck, AiOutlineMail, AiOutlinePhone } from 'react-icons/ai'
import { SiCurl } from 'react-icons/si'
import { GiMatterStates } from 'react-icons/gi'
import { MdDriveFileRenameOutline, MdOutlineDriveFileRenameOutline, MdPassword } from 'react-icons/md'
import { createClientForm, createLeaveForm } from 'type/form/auth'
import { dataGender, dataSalutation } from 'utils/basicData'
import { CreateClientValidate } from 'utils/validate'
import { FaCity } from 'react-icons/fa'

export interface IAddClientProps {
	onCloseDrawer?: () => void
}

export default function AddClient(props: IAddClientProps) {
	const { isAuthenticated, handleLoading, setToast } = useContext(AuthContext)
	const router = useRouter()

	//Query ---------------------------------------------------------------------
	const { data: dataCategories } = allClientCategoriesQuery()
	const { data: dataSubCategories } = allClientSubCategoriesQuery()

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
		},
		resolver: yupResolver(CreateClientValidate),
	})

	const { handleSubmit } = formSetting

	const onSubmit = (values: createClientForm) => {
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

	return (
		<>
			<Box pos="relative" p={6} as={'form'} h="auto" onSubmit={handleSubmit(onSubmit)}>
				<Grid templateColumns="repeat(2, 1fr)" gap={6}>
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
						<CoutrySelector name="country" form={formSetting} />
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
							required = {false}
							form={formSetting}
							placeholder={'Select Gender'}
							options={dataGender}
						/>
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
							icon={<MdOutlineDriveFileRenameOutline fontSize={'20px'} color="gray" opacity={0.6} />}
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
							icon={<MdOutlineDriveFileRenameOutline fontSize={'20px'} color="gray" opacity={0.6} />}
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
							icon={<MdOutlineDriveFileRenameOutline fontSize={'20px'} color="gray" opacity={0.6} />}
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
				{/* {statusLeave === 'running' && <Loading />} */}
			</Box>
		</>
	)
}
