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
	useColorMode,
	VStack,
} from '@chakra-ui/react'
import { Head } from 'components/common'

import { ContractLayout } from 'components/layouts/Contract'
import { AuthContext } from 'contexts/AuthContext'
import { convert } from 'html-to-text'
import jsPDF from 'jspdf'
import { GetStaticPaths, GetStaticProps } from 'next'

import { useRouter } from 'next/router'
import { detailContractQuery } from 'queries'
import { companyInfoQuery } from 'queries/companyInfo'
import { useContext, useEffect } from 'react'
import { AiOutlineDownload } from 'react-icons/ai'
import { SWRConfig } from 'swr'
import { NextLayout } from 'type/element/layout'
import { getDataBlob } from 'utils/uploadFile'

const DetailContract: NextLayout = () => {
	const { isAuthenticated, handleLoading, setToast, setContractUrls } = useContext(AuthContext)
	const router = useRouter()
	const {colorMode} = useColorMode()
	const { contractId } = router.query

	//Query ------------------------------------------------------------
	const { data: dataDetailContract } = detailContractQuery(isAuthenticated, Number(contractId))
	const { data: dataCompanyInfo } = companyInfoQuery()

	//UseEffect --------------------------------------------------------
	//Handle loading page
	useEffect(() => {
		handleLoading(false)
	}, [isAuthenticated])

	// set contract urls
	useEffect(() => {
		if (contractId) {
			setContractUrls(contractId as string)
		}
	}, [contractId])

	//Setting react convert to pdf -------------------------------------
	const generatePDF = async () => {
		if (!dataDetailContract?.contract) {
			setToast({
				msg: 'Not found contract to download PDF',
				type: 'error',
			})
		} else {
			var doc = new jsPDF('p', 'pt')

			doc.text(`Contract #${contractId}`, 20, 20)
			doc.setFontSize(12)
			doc.text(
				dataCompanyInfo?.companyInfo.name ? dataCompanyInfo.companyInfo.name : 'HUPROM',
				20,
				60
			)
			doc.text(
				dataCompanyInfo?.companyInfo.website
					? dataCompanyInfo.companyInfo.website
					: 'huprom.com',
				20,
				80
			)
			doc.text(
				dataCompanyInfo?.companyInfo.phone
					? dataCompanyInfo.companyInfo.phone
					: '+84 833876372',
				20,
				100
			)
			doc.text(
				dataCompanyInfo?.companyInfo.email
					? dataCompanyInfo.companyInfo.email
					: 'huynqdev1612@gmail.com',
				20,
				120
			)
			doc.setFontSize(14)
			doc.text('Main Contract', 20, 160)
			doc.setFontSize(12)
			doc.text(`Contract Number: #${contractId}`, 20, 190)
			doc.text(`Start Date: ${dataDetailContract?.contract?.start_date}`, 20, 210)
			doc.text(`End Date: ${dataDetailContract?.contract?.end_date}`, 20, 230)
			doc.setFontSize(14)
			doc.text('Client', 20, 270)
			doc.setFontSize(12)
			doc.text(`${dataDetailContract?.contract?.client.name}`, 20, 300)
			doc.text(`${dataDetailContract?.contract?.client.company_name}`, 20, 320)
			doc.text(`${dataDetailContract?.contract?.client.company_address}`, 20, 340)
			doc.setFontSize(14)
			doc.text('Subject', 20, 380)
			doc.setFontSize(12)
			doc.text(`${dataDetailContract?.contract?.subject}`, 20, 410)
			doc.setFontSize(14)
			doc.text('Description', 20, 450)
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
				470
			)
			doc.setFontSize(14)
			doc.text(
				`Contract Value: ${dataDetailContract?.contract?.contract_value} ${dataDetailContract?.contract?.currency}`,
				20,
				510
			)

			if (dataDetailContract?.contract?.sign) {
				doc.text('Signature', 20, 550)
				dataDetailContract?.contract?.sign?.url &&
					doc.addImage((await parser64IMGSign()) as string, 'png', 0, 570, 300, 150)
				doc.setFontSize(12)
				doc.text(
					`(${dataDetailContract?.contract?.sign?.first_name} ${dataDetailContract?.contract?.sign?.last_name})`,
					20,
					740
				)
			}

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
				fallback: {},
			}}
		>
			<Head title={`Contract number #${contractId}`}/>
			<Box bg={colorMode == 'light'? '#fafafa': '#1e2636'} p={10}>
				<Container maxW="container.xl" bg="white" color="#262626" borderRadius={5} p={5}>
					<VStack spacing={4} align="start">
						<HStack justify="space-between" wrap={'wrap'} w={'full'}>
							<Image
								boxSize={'50px'}
								src={dataCompanyInfo?.companyInfo.logo_url || '/assets/logo1.svg'}
								alt="Avatar"
								borderRadius={5}
							/>
							<Text fontSize={20} fontWeight={'bold'}>
								CONTRACT
							</Text>
						</HStack>
						<Grid templateColumns="repeat(2, 1fr)" gap={6} w={'full'}>
							<GridItem w="100%" colSpan={[2, 1]}>
								<Text>
									{dataCompanyInfo?.companyInfo.name
										? dataCompanyInfo.companyInfo.name
										: 'HUPROM'}
								</Text>
								<Text>
									{dataCompanyInfo?.companyInfo.website
										? dataCompanyInfo.companyInfo.website
										: 'huprom.com'}
								</Text>
								<Text>
									{dataCompanyInfo?.companyInfo.phone
										? dataCompanyInfo.companyInfo.phone
										: '+84 833876372'}
								</Text>
								<Text>
									{dataCompanyInfo?.companyInfo.email
										? dataCompanyInfo.companyInfo.email
										: 'huynqdev1612@gmail.com'}
								</Text>
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
								<Menu placement="top-end">
									<MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
										Actions
									</MenuButton>
									<MenuList>
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
			</Box>
		</SWRConfig>
	)
}

export const getStaticProps: GetStaticProps = async () => {
	return {
		props: {},
		// Next.js will attempt to re-generate the page:
		// - When a request comes in
		// - At most once every 10 seconds
		revalidate: 10, // In seconds
	}
}

export const getStaticPaths: GetStaticPaths = async () => {
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contracts`)
		.then((result) => result.json())
		.catch(() => undefined)

	if (!res || !res.contracts) {
		return { paths: [], fallback: false }
	}

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

DetailContract.getLayout = ContractLayout

export default DetailContract
