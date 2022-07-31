import { Box, Button, Grid, GridItem, HStack, Input, Text, VStack } from '@chakra-ui/react'
import { ClientLayout } from 'components/layouts'
import { AuthContext } from 'contexts/AuthContext'
import { updateCompanyInfoMutation } from 'mutations/companyInfo'
import { useRouter } from 'next/router'
import { companyInfoQuery } from 'queries/companyInfo'
import { useContext, useEffect, useState } from 'react'
import { AiOutlineCheck } from 'react-icons/ai'
import { NextLayout } from 'type/element/layout'

const ConfigCompany: NextLayout = () => {
	const { isAuthenticated, handleLoading, setToast, currentUser } = useContext(AuthContext)
	const router = useRouter()

	//State ----------------------------------------------------------------------
	const [name, setName] = useState<string>('')
	const [email, setEmail] = useState<string>('')
	const [phone, setPhone] = useState<string>('')
	const [website, setWebsite] = useState<string>('')

	//Query ----------------------------------------------------------------------
	const { data: dataCompanyInfo, mutate: refetchCompanyInfo } = companyInfoQuery()

	//mutation -------------------------------------------------------------------
	const [mutateUpCompanyInfo, { status: statusUpCompanyInfo, data: dataUpCompanyInfo }] =
		updateCompanyInfoMutation(setToast)

	//Usereffect -----------------------------------------------------------------
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
			setName(dataCompanyInfo.companyInfo.name)
			setEmail(dataCompanyInfo.companyInfo.email)
			setPhone(dataCompanyInfo.companyInfo.phone)
			setWebsite(dataCompanyInfo.companyInfo.website)
		}
	}, [dataCompanyInfo])

	//Function --------------------------------------------
	//Handle update
	const handleUpdateInfo = () => {
		mutateUpCompanyInfo({
			email,
			name,
			phone,
			website,
		})
	}

	//Cancle update or reset data
	const onCancleUpdate = () => {
		if (dataCompanyInfo?.companyInfo) {
			setName(dataCompanyInfo.companyInfo.name)
			setEmail(dataCompanyInfo.companyInfo.email)
			setPhone(dataCompanyInfo.companyInfo.phone)
			setWebsite(dataCompanyInfo.companyInfo.website)
		}
	}

	return (
		<Box pb={8}>
			<Box w="full" bgColor={'white'} borderRadius={5}>
				<Box p={5}>
					<Grid templateColumns="repeat(2, 1fr)" gap={6}>
						<GridItem w="100%" colSpan={[2, 1]}>
							<VStack spacing={2} align={'start'}>
								<Text color={'gray.400'}>
									Company Name <span style={{ color: 'red' }}>*</span>
								</Text>
								<Input
									required
									type={'text'}
									disabled={currentUser?.role === 'Admin' ? false : true}
									value={name}
									onChange={(e: any) => {
										setName(e.target.value)
									}}
								/>
							</VStack>
						</GridItem>

						<GridItem w="100%" colSpan={[2, 1]}>
							<VStack spacing={2} align={'start'}>
								<Text color={'gray.400'}>
									Company Email <span style={{ color: 'red' }}>*</span>
								</Text>
								<Input
									required
									type={'email'}
									disabled={currentUser?.role === 'Admin' ? false : true}
									value={email}
									onChange={(e: any) => {
										setEmail(e.target.value)
									}}
								/>
							</VStack>
						</GridItem>

						<GridItem w="100%" colSpan={[2, 1]}>
							<VStack spacing={2} align={'start'}>
								<Text color={'gray.400'}>
									Company Phone <span style={{ color: 'red' }}>*</span>
								</Text>
								<Input
									required
									type={'tel'}
									disabled={currentUser?.role === 'Admin' ? false : true}
									value={phone}
									onChange={(e: any) => {
										setPhone(e.target.value)
									}}
								/>
							</VStack>
						</GridItem>

						<GridItem w="100%" colSpan={[2, 1]}>
							<VStack spacing={2} align={'start'}>
								<Text color={'gray.400'}>
									Company Website <span style={{ color: 'red' }}>*</span>
								</Text>
								<Input
									required
									type={'text'}
									disabled={currentUser?.role === 'Admin' ? false : true}
									value={website}
									onChange={(e: any) => {
										setWebsite(e.target.value)
									}}
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
									onClick={handleUpdateInfo}
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
									onClick={onCancleUpdate}
								>
									Cancel
								</Button>
							</HStack>
						</Box>
					</>
				)}
			</Box>
		</Box>
	)
}

ConfigCompany.getLayout = ClientLayout
export default ConfigCompany
