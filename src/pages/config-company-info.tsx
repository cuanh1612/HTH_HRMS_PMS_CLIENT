import { Box, Grid, GridItem, Text, VStack } from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { Loading } from 'components/common'
import { Input, UploadAvatar } from 'components/form'
import { AuthContext } from 'contexts/AuthContext'
import { updateCompanyInfoMutation } from 'mutations/companyInfo'
import { useRouter } from 'next/router'
import { companyInfoQuery } from 'queries/companyInfo'
import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { AiOutlineMail, AiOutlinePhone } from 'react-icons/ai'
import { MdDriveFileRenameOutline } from 'react-icons/md'
import { NextLayout } from 'type/element/layout'
import { ICloudinaryImg, IImg } from 'type/fileType'
import { updateCompanyInfoForm } from 'type/form/basicFormType'
import { uploadFile } from 'utils/uploadFile'
import { UpdateCompanyInfoValidate } from 'utils/validate'
//CSS
import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.bubble.css'
import 'react-quill/dist/quill.snow.css'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

const ConfigCompany: NextLayout = () => {
	const { isAuthenticated, handleLoading, setToast, currentUser } = useContext(AuthContext)
	const router = useRouter()

	//State ----------------------------------------------------------------------
	const [infoImg, setInfoImg] = useState<IImg>() // state data image upload
	const [loadingImg, setLoadingImg] = useState<boolean>(false) // state loading when image upload
	const [note, setNote] = useState<string>('')

	//Query ----------------------------------------------------------------------
	const { data: dataCompanyInfo, mutate: refetchCompanyInfo } = companyInfoQuery()

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
			terms_and_condition_recruit: '',
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
				upload_preset: 'avatar-web',
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

		if (note) {
			values.terms_and_condition_recruit = note
		}

		mutateUpCompanyInfo(values)
	}

	//Handle change content editor
	const handleChangeNote = (value: any) => {
		setNote(value)
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

			setNote(
				dataCompanyInfo?.companyInfo?.terms_and_condition_recruit
					? dataCompanyInfo?.companyInfo.terms_and_condition_recruit
					: ''
			)
		}
	}, [dataCompanyInfo])

	return (
		<Box id={'formSetConfig'} pb={8} as={'form'} onSubmit={handleSubmit(onSubmit)}>
			<Box w="full" borderRadius={5}>
				<Box p={5}>
					<Grid templateColumns="repeat(2, 1fr)" gap={6}>
						<GridItem w="100%" colSpan={2}>
							<UploadAvatar
								setInfoImg={(data?: IImg) => {
									setInfoImg(data)
								}}
								oldImg={
									dataCompanyInfo?.companyInfo.logo_url || '/assets/logo1.svg'
								}
							/>
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
				</Box>
				{(statusUpCompanyInfo === 'running' || loadingImg) && <Loading />}
			</Box>
		</Box>
	)
}

export default ConfigCompany
