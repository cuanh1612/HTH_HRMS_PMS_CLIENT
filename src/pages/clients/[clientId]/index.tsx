import {
	Avatar,
	Box,
	Container,
	Grid,
	GridItem,
	HStack,
	Image,
	Text,
	VStack,
} from '@chakra-ui/react'
import { AuthContext } from 'contexts/AuthContext'
import { useRouter } from 'next/router'
import {
	allProjectsByCurrentUserQuery,
	clientTotalEarningQuery,
	clientTotalProejctsQuery,
	detailClientQuery,
} from 'queries'
import { useContext, useEffect } from 'react'
import { AiOutlineProject } from 'react-icons/ai'
import { FaRegMoneyBillAlt } from 'react-icons/fa'

export default function DetailClient() {
	const { isAuthenticated, handleLoading } = useContext(AuthContext)
	const router = useRouter()
	const { clientId } = router.query

	//Query -------------------------------------------------------------------
	const { data: dataDetailClient } = detailClientQuery(isAuthenticated, clientId as string)
	const { data: dataTotalProjects } = clientTotalProejctsQuery(
		isAuthenticated,
		clientId as string
	)
	const { data: dataTotalEarnings } = clientTotalEarningQuery(isAuthenticated, clientId as string)
	const { data: dataAllProjects } = allProjectsByCurrentUserQuery(isAuthenticated)

	//Funcion -----------------------------------------------------------------

	//User effect --------------------------------------------------------------

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
			<Container maxW="full" bg="#f2f4f7" h={"full"} minH={"100vh"}>
				<VStack spacing={6} py={6} px={4}>
					<Grid templateColumns="repeat(3, 1fr)" gap={6} w={'full'}>
						<GridItem
							colSpan={[3,3,1]}
							bg="white"
							p={'20px'}
							boxShadow={'0 0 4px 0 #e8eef3'}
							borderRadius={5}
						>
							<HStack h={'full'} w={'full'}>
								<Avatar
									borderRadius={5}
									name={dataDetailClient?.client?.name}
									src={dataDetailClient?.client?.avatar?.url}
								/>
								<VStack align={'start'} height={'full'}>
									<Text fontWeight={'semibold'}>
										{dataDetailClient?.client?.name}
									</Text>
									<Text color={'gray.400'}>
										{dataDetailClient?.client?.company_name}
									</Text>
								</VStack>
							</HStack>
						</GridItem>

						<GridItem
							colSpan={[3,3,1]}
							bg="white"
							p={'20px'}
							boxShadow={'0 0 4px 0 #e8eef3'}
							borderRadius={5}
						>
							<HStack h={'full'} w={'full'} justifyContent={'space-between'}>
								<VStack h={'full'} align={'start'}>
									<Text fontWeight={'semibold'}>Total Projects</Text>
									<Text fontWeight={'semibold'} color={'#1d82f5'}>
										{dataTotalProjects?.totalProjects || "0"}
									</Text>
								</VStack>

								<VStack h={'full'} justify={'center'} color={'gray.400'}>
									<AiOutlineProject fontSize={24} />
								</VStack>
							</HStack>
						</GridItem>

						<GridItem
							colSpan={[3,3,1]}
							bg="white"
							p={'20px'}
							boxShadow={'0 0 4px 0 #e8eef3'}
							borderRadius={5}
						>
							<HStack h={'full'} w={'full'} justifyContent={'space-between'}>
								<VStack h={'full'} align={'start'}>
									<Text fontWeight={'semibold'}>Total Earnings</Text>
									<Text fontWeight={'semibold'} color={'#1d82f5'}>
										{dataTotalEarnings?.totalEarnings || "0"}
									</Text>
								</VStack>

								<VStack h={'full'} justify={'center'} color={'gray.400'}>
									<FaRegMoneyBillAlt fontSize={24} />
								</VStack>
							</HStack>
						</GridItem>
					</Grid>

					<Grid templateColumns="repeat(2, 1fr)" gap={6} w={'full'}>
						<GridItem
							colSpan={[2,2,1]}
							bg="white"
							p={'20px'}
							boxShadow={'0 0 4px 0 #e8eef3'}
							borderRadius={5}
						>
							<Grid templateColumns="repeat(3, 1fr)" gap={6} w={'full'}>
								<GridItem colSpan={[3,1]}>
									<Text color={"gray.400"}>Full Name</Text>
								</GridItem>
								<GridItem colSpan={[3,2]}>
									<Text>{dataDetailClient?.client?.name}</Text>
								</GridItem>
								<GridItem colSpan={[3,1]}>
									<Text color={"gray.400"}>Email</Text>
								</GridItem>
								<GridItem colSpan={[3,2]}>
									<Text>{dataDetailClient?.client?.email}</Text>
								</GridItem>
								<GridItem colSpan={[3,1]}>
									<Text color={"gray.400"}>Company Name</Text>
								</GridItem>
								<GridItem colSpan={[3,2]}>
									<Text>{dataDetailClient?.client?.company_name || "--"}</Text>
								</GridItem>
								<GridItem colSpan={[3,1]}>
									<Text color={"gray.400"}>Mobile</Text>
								</GridItem>
								<GridItem colSpan={[3,2]}>
									<Text>{dataDetailClient?.client?.mobile || "--"}</Text>
								</GridItem>
								<GridItem colSpan={[3,1]}>
									<Text color={"gray.400"}>Office Phone Number</Text>
								</GridItem>
								<GridItem colSpan={[3,2]}>
									<Text>{dataDetailClient?.client?.office_phone_number || "--"}</Text>
								</GridItem>
								<GridItem colSpan={[3,1]}>
									<Text color={"gray.400"}>Office Website</Text>
								</GridItem>
								<GridItem colSpan={[3,2]}>
									<Text>{dataDetailClient?.client?.official_website || "--"}</Text>
								</GridItem>
								<GridItem colSpan={[3,1]}>
									<Text color={"gray.400"}>GST/VAT Number</Text>
								</GridItem>
								<GridItem colSpan={[3,2]}>
									<Text>{dataDetailClient?.client?.gst_vat_number || "--"}</Text>
								</GridItem>
								<GridItem colSpan={[3,1]}>
									<Text color={"gray.400"}>Adress</Text>
								</GridItem>
								<GridItem colSpan={[3,2]}>
									<Text>{dataDetailClient?.client?.company_address || "--"}</Text>
								</GridItem>
								<GridItem colSpan={[3,1]}>
									<Text color={"gray.400"}>State</Text>
								</GridItem>
								<GridItem colSpan={[3,2]}>
									<Text>{dataDetailClient?.client?.state || "--"}</Text>
								</GridItem>
								<GridItem colSpan={[3,1]}>
									<Text color={"gray.400"}>City</Text>
								</GridItem>
								<GridItem colSpan={[3,2]}>
									<Text>{dataDetailClient?.client?.city || "--"}</Text>
								</GridItem>
								<GridItem colSpan={[3,1]}>
									<Text color={"gray.400"}>Postal Code</Text>
								</GridItem>
								<GridItem colSpan={[3,2]}>
									<Text>{dataDetailClient?.client?.postal_code || "--"}</Text>
								</GridItem>
								<GridItem colSpan={[3,1]}>
									<Text color={"gray.400"}>Note</Text>
								</GridItem>
								<GridItem colSpan={[3,2]}>
									<Text>{dataDetailClient?.client?.note || "--"}</Text>
								</GridItem>
							</Grid>
						</GridItem>

						<GridItem
							colSpan={[2,2,1]}
							bg="white"
							p={'20px'}
							boxShadow={'0 0 4px 0 #e8eef3'}
							borderRadius={5}
						>
							
						</GridItem>
					</Grid>
				</VStack>
			</Container>
		</>
	)
}
