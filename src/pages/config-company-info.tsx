import { Box, Button, Grid, GridItem, HStack, Text, VStack } from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { Loading } from 'components/common'
import { Input, UploadAvatar } from 'components/form'
import { ClientLayout } from 'components/layouts'
import { AuthContext } from 'contexts/AuthContext'
import { updateCompanyInfoMutation } from 'mutations/companyInfo'
import { useRouter } from 'next/router'
import { companyInfoQuery } from 'queries/companyInfo'
import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { AiOutlineCheck, AiOutlineMail, AiOutlinePhone } from 'react-icons/ai'
import { MdDriveFileRenameOutline } from 'react-icons/md'
import { NextLayout } from 'type/element/layout'
import { ICloudinaryImg, IImg } from 'type/fileType'
import { updateCompanyInfoForm } from 'type/form/basicFormType'
import { uploadFile } from 'utils/uploadFile'
import { UpdateCompanyInfoValidate } from 'utils/validate'

const ConfigCompany: NextLayout = () => {
	const { isAuthenticated, handleLoading, setToast, currentUser } = useContext(AuthContext)
	const router = useRouter()

	//State ----------------------------------------------------------------------
	const [infoImg, setInfoImg] = useState<IImg>() // state data image upload
	const [loadingImg, setLoadingImg] = useState<boolean>(false) // state loading when image upload

	//Query ----------------------------------------------------------------------
	const { data: dataCompanyInfo, mutate: refetchCompanyInfo } = companyInfoQuery()
	console.log(dataCompanyInfo);
	

	//mutation -------------------------------------------------------------------
	const [mutateUpCompanyInfo, { status: statusUpCompanyInfo, data: dataUpCompanyInfo }] =
		updateCompanyInfoMutation(setToast)

	// setForm and submit form update company info --------------------------------
	const formSetting = useForm<updateCompanyInfoForm>({
		defaultValues: {
			name: '',
			email: '',
			phone: '',
			website: '',
			logo_name: '',
			logo_public_id: '',
			logo_url: '',
		},
		resolver: yupResolver(UpdateCompanyInfoValidate),
	})

	const { handleSubmit } = formSetting

	//function-------------------------------------------------------------------
	const handleUploadAvatar = async () => {
		if (infoImg) {
			setLoadingImg(true)
			const dataUploadAvatar: Array<ICloudinaryImg> = await uploadFile({
				files: infoImg.files,
				raw: false,
				tags: ['avatar'],
				options: infoImg.options,
				upload_preset: 'huprom-avatar',
			})

			setLoadingImg(false)
			return dataUploadAvatar[0]
		}

		return null
	}

	const onSubmit = async (values: updateCompanyInfoForm) => {
		//Upload logo
		const dataLogo: ICloudinaryImg | null = await handleUploadAvatar()

		// //Set data logo if upload logo success
		if (dataLogo) {
			values.logo_name = dataLogo.name
			values.logo_public_id = dataLogo.public_id
			values.logo_url = dataLogo.url
		}

		mutateUpCompanyInfo(values)
	}

	//UserEffect -----------------------------------------------------------------
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

	//notice when update success
	useEffect(() => {
		if (statusUpCompanyInfo === 'success' && dataUpCompanyInfo?.message) {
			setToast({
				type: statusUpCompanyInfo,
				msg: dataUpCompanyInfo.message,
			})

			refetchCompanyInfo()
		}
	}, [statusUpCompanyInfo])

	//Set data form when have data company info
	useEffect(() => {
		if (dataCompanyInfo?.companyInfo) {
			formSetting.reset({
				name: dataCompanyInfo.companyInfo.name,
				phone: dataCompanyInfo.companyInfo.phone,
				email: dataCompanyInfo.companyInfo.email,
				website: dataCompanyInfo.companyInfo.website,
			})
		}
	}, [dataCompanyInfo])

	//Function --------------------------------------------
	//Cancel update or reset data
	const onCancelUpdate = () => {
		if (dataCompanyInfo?.companyInfo) {
			formSetting.reset({
				name: dataCompanyInfo.companyInfo.name,
				phone: dataCompanyInfo.companyInfo.phone,
				email: dataCompanyInfo.companyInfo.email,
				website: dataCompanyInfo.companyInfo.website,
			})
		}
	}

	return (
		<Box pb={8} as={'form'} onSubmit={handleSubmit(onSubmit)}>
			<Box w="full" bgColor={'white'} borderRadius={5}>
				<Box p={5}>
					<Grid templateColumns="repeat(2, 1fr)" gap={6}>
						<GridItem w="100%" colSpan={2}>
							<VStack align={'start'} spacing={2}>
								<Text color={'gray.400'}>Company Logo</Text>
								<UploadAvatar
									setInfoImg={(data?: IImg) => {
										setInfoImg(data)
									}}
									oldImg={
										dataCompanyInfo?.companyInfo.logo_url || '/assets/logo1.svg'
									}
								/>
							</VStack>
						</GridItem>

						<GridItem w="100%" colSpan={[2]}>
							<VStack spacing={2} align={'start'}>
								<Input
									name="name"
									label="Company Name"
									icon={
										<MdDriveFileRenameOutline
											fontSize={'20px'}
											color="gray"
											opacity={0.6}
										/>
									}
									form={formSetting}
									placeholder="Enter Company Name"
									type="text"
									required
									disabled={currentUser?.role === 'Admin' ? false : true}
								/>
							</VStack>
						</GridItem>

						<GridItem w="100%" colSpan={[2]}>
							<VStack spacing={2} align={'start'}>
								<Input
									name="email"
									label="Company Email"
									icon={
										<AiOutlineMail
											fontSize={'20px'}
											color="gray"
											opacity={0.6}
										/>
									}
									form={formSetting}
									placeholder="Enter Company Email"
									type="email"
									required
									disabled={currentUser?.role === 'Admin' ? false : true}
								/>
							</VStack>
						</GridItem>

						<GridItem w="100%" colSpan={[2]}>
							<VStack spacing={2} align={'start'}>
								<Input
									name="phone"
									label="Company Phone"
									icon={
										<AiOutlinePhone
											fontSize={'20px'}
											color="gray"
											opacity={0.6}
										/>
									}
									form={formSetting}
									placeholder="Enter Company Phone"
									type="tel"
									required
									disabled={currentUser?.role === 'Admin' ? false : true}
								/>
							</VStack>
						</GridItem>

						<GridItem w="100%" colSpan={[2]}>
							<VStack spacing={2} align={'start'}>
								<Input
									name="website"
									label="Company Website"
									icon={
										<MdDriveFileRenameOutline
											fontSize={'20px'}
											color="gray"
											opacity={0.6}
										/>
									}
									form={formSetting}
									placeholder="Enter Company Website"
									type="url"
									required
									disabled={currentUser?.role === 'Admin' ? false : true}
								/>
							</VStack>
						</GridItem>
					</Grid>
				</Box>
				{currentUser?.role === 'Admin' && (
					<>
						<Box p={5}>
							<HStack>
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
									disabled={statusUpCompanyInfo === 'running'}
								>
									Save
								</Button>

								<Button
									color={'gray.400'}
									transform="auto"
									_hover={{ bg: 'black', scale: 1.05, color: 'white' }}
									_active={{
										scale: 1,
									}}
									onClick={onCancelUpdate}
								>
									Cancel
								</Button>
							</HStack>
						</Box>
					</>
				)}
				{(statusUpCompanyInfo === 'running'|| loadingImg) && <Loading />}
			</Box>
		</Box>
	)
}

ConfigCompany.getLayout = ClientLayout
export default ConfigCompany
