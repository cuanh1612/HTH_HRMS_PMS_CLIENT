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
	Text,
	VStack
} from '@chakra-ui/react'
import { ClientLayout } from 'components/layouts'

import { AuthContext } from 'contexts/AuthContext'
import jsPDF from 'jspdf'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { companyInfoQuery } from 'queries/companyInfo'
import { detailJobOfferQuery } from 'queries/jobOfferLetter'
import { useContext, useEffect } from 'react'
import { AiOutlineDownload } from 'react-icons/ai'
import { SWRConfig } from 'swr'
import { NextLayout } from 'type/element/layout'
import { getDataBlob } from 'utils/uploadFile'

export interface IDetailJobOfferLettersProps {
	onCloseDrawer?: () => void
	jobOfferLetterId: number | null
}

const DetailJobOfferLetter: NextLayout | any = ({
	jobOfferLetterId: jobOfferLetterIdProp,
}: IDetailJobOfferLettersProps) => {
	const { isAuthenticated, handleLoading, setToast } = useContext(AuthContext)
	const router = useRouter()
	const { jobOfferLetterId: jobOfferLetterIdRouter } = router.query

	//Query ------------------------------------------------------------
	const { data: dataDetailJobOfferLetter } = detailJobOfferQuery(
		isAuthenticated,
		jobOfferLetterIdProp || (jobOfferLetterIdRouter as string)
	)
	const { data: dataCompanyInfo } = companyInfoQuery()

	//UseEffect --------------------------------------------------------
	//Handle loading page
	useEffect(() => {
		handleLoading(false)
	}, [isAuthenticated])

	// set contract urls
	// useEffect(() => {
	// 	if (contractId) {
	// 		setContractUrls(contractId as string)
	// 	}
	// }, [contractId])

	//Setting react convert to pdf -------------------------------------
	const generatePDF = async () => {
		if (!dataDetailJobOfferLetter?.jobOfferLetter) {
			setToast({
				msg: 'Not found job offer letter to download PDF',
				type: 'error',
			})
		} else {
			var doc =  new jsPDF('p', 'pt')

			doc.text(`Offer Letters #${jobOfferLetterIdProp || jobOfferLetterIdRouter}`, 20, 20)
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
			doc.text('Candidate Detail', 20, 160)
			doc.setFontSize(12)
			doc.text(
				`Candidate Name: #${
					dataDetailJobOfferLetter?.jobOfferLetter?.job_application.name || '--'
				}`,
				20,
				190
			)
			doc.text(
				`Candidate Email: ${
					dataDetailJobOfferLetter?.jobOfferLetter?.job_application.email || '--'
				}`,
				20,
				210
			)

			doc.setFontSize(14)
			doc.text('Job Detail', 20, 250)
			doc.setFontSize(12)
			doc.text(
				`Job title: ${dataDetailJobOfferLetter?.jobOfferLetter?.job.title || '--'}`,
				20,
				280
			)
			doc.text(
				`Work Experience: ${
					dataDetailJobOfferLetter?.jobOfferLetter?.job.work_experience.name || '--'
				}`,
				20,
				300
			)

			doc.setFontSize(14)
			doc.text('Job Offer Detail', 20, 340)
			doc.setFontSize(12)
			doc.text(
				`Salary Offered: ${
					dataDetailJobOfferLetter?.jobOfferLetter?.salary
						? `$ ${dataDetailJobOfferLetter?.jobOfferLetter?.salary}`
						: '--'
				}`,
				20,
				370
			)
			doc.text(
				`Joining Date: ${
					dataDetailJobOfferLetter?.jobOfferLetter?.expected_joining_date || '--'
				}`,
				20,
				390
			)
			doc.text(
				`Last Date Of Acceptance: ${
					dataDetailJobOfferLetter?.jobOfferLetter?.exprise_on || '--'
				}`,
				20,
				410
			)

			if (dataDetailJobOfferLetter?.jobOfferLetter?.sign) {
				doc.setFontSize(14)
				doc.text('Signature', 20, 450)
				dataDetailJobOfferLetter?.jobOfferLetter?.sign?.url &&
					doc.addImage((await parser64IMGSign()) as string, 'png', 0, 470, 300, 150)
				doc.setFontSize(12)
				doc.text(
					`(${dataDetailJobOfferLetter?.jobOfferLetter?.sign?.first_name} ${dataDetailJobOfferLetter?.jobOfferLetter?.sign?.last_name})`,
					20,
					640
				)
			}

			doc.save('demo.pdf')
		}
	}

	const parser64IMGSign = async () => {
		if (dataDetailJobOfferLetter?.jobApplication?.sign?.url) {
			const url = await getDataBlob(dataDetailJobOfferLetter?.jobApplication?.sign?.url)
			return url
		}
	}

	return (
		<SWRConfig
			value={{
				fallback: {},
			}}
		>
			<Head>
				<title>
					Huprom - Detail offer {jobOfferLetterIdProp || jobOfferLetterIdRouter}
				</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
			<Box bgColor={'#f2f4f7'} p={10}>
				<Container maxW="container.xl" bg="white" color="#262626" borderRadius={5} p={5}>
					<VStack spacing={4} align="start">
						<HStack justify="space-between" wrap={'wrap'} w={'full'}>
							<Image
								boxSize={'50px'}
								src="https://bit.ly/dan-abramov"
								alt="Dan Abramov"
								borderRadius={5}
							/>
							<VStack align={'end'}>
								<Text fontSize={20} fontWeight={'bold'}>
									JOB OFFER LETTER
								</Text>
								<Box
									px={2}
									borderRadius={5}
									bgColor={
										dataDetailJobOfferLetter?.jobOfferLetter?.status ===
										'Pending'
											? 'yellow'
											: dataDetailJobOfferLetter?.jobOfferLetter?.status ===
											  'Draft'
											? 'tomato'
											: dataDetailJobOfferLetter?.jobOfferLetter?.status ===
											  'Withdraw'
											? 'lightblue'
											: 'white'
									}
								>
									<Text fontSize={20} fontWeight={'semibold'}>
										{dataDetailJobOfferLetter?.jobOfferLetter?.status}
									</Text>
								</Box>
							</VStack>
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

							<GridItem w="100%" colSpan={2}>
								<VStack align={'start'}>
									<Text fontSize={20} fontWeight={'semibold'}>
										Candidate Details
									</Text>
									<Grid templateColumns="repeat(4, 1fr)" gap={6} w={'full'}>
										<GridItem w="100%" colSpan={[4, 1]}>
											<Text color={'gray.400'}>Candidate Name:</Text>
										</GridItem>
										<GridItem w="100%" colSpan={[4, 3]}>
											<Text>
												{dataDetailJobOfferLetter?.jobOfferLetter
													?.job_application.name || '--'}
											</Text>
										</GridItem>
										<GridItem w="100%" colSpan={[4, 1]}>
											<Text color={'gray.400'}>Candidate Email:</Text>
										</GridItem>
										<GridItem w="100%" colSpan={[4, 3]}>
											<Text>
												{dataDetailJobOfferLetter?.jobOfferLetter
													?.job_application.email || '--'}
											</Text>
										</GridItem>
									</Grid>
								</VStack>
							</GridItem>

							<GridItem w="100%" colSpan={2}>
								<VStack align={'start'}>
									<Text fontSize={20} fontWeight={'semibold'}>
										Job Details
									</Text>
									<Grid templateColumns="repeat(4, 1fr)" gap={6} w={'full'}>
										<GridItem w="100%" colSpan={[4, 1]}>
											<Text color={'gray.400'}>Job ttle:</Text>
										</GridItem>
										<GridItem w="100%" colSpan={[4, 3]}>
											<Text>
												{dataDetailJobOfferLetter?.jobOfferLetter?.job
													.title || '--'}
											</Text>
										</GridItem>
										<GridItem w="100%" colSpan={[4, 1]}>
											<Text color={'gray.400'}>Work Experience:</Text>
										</GridItem>
										<GridItem w="100%" colSpan={[4, 3]}>
											<Text>
												{dataDetailJobOfferLetter?.jobOfferLetter?.job
													?.work_experience?.name || '--'}
											</Text>
										</GridItem>
									</Grid>
								</VStack>
							</GridItem>

							<GridItem w="100%" colSpan={2}>
								<VStack align={'start'}>
									<Text fontSize={20} fontWeight={'semibold'}>
										Offer Details
									</Text>
									<Grid templateColumns="repeat(4, 1fr)" gap={6} w={'full'}>
										<GridItem w="100%" colSpan={[4, 1]}>
											<Text color={'gray.400'}>Salary Offered:</Text>
										</GridItem>
										<GridItem w="100%" colSpan={[4, 3]}>
											<Text>
												{dataDetailJobOfferLetter?.jobOfferLetter?.salary
													? `$ ${dataDetailJobOfferLetter?.jobOfferLetter?.salary}`
													: '--'}
											</Text>
										</GridItem>
										<GridItem w="100%" colSpan={[4, 1]}>
											<Text color={'gray.400'}>Joining Date:</Text>
										</GridItem>
										<GridItem w="100%" colSpan={[4, 3]}>
											<Text>
												{dataDetailJobOfferLetter?.jobOfferLetter
													?.expected_joining_date || '--'}
											</Text>
										</GridItem>
										<GridItem w="100%" colSpan={[4, 1]}>
											<Text color={'gray.400'}>Last Date Of Acceptance:</Text>
										</GridItem>
										<GridItem w="100%" colSpan={[4, 3]}>
											<Text>
												{dataDetailJobOfferLetter?.jobOfferLetter
													?.exprise_on || '--'}
											</Text>
										</GridItem>
									</Grid>
								</VStack>
							</GridItem>
						</Grid>

						<Divider />

						<VStack width={'full'} align={'start'}>
							{dataDetailJobOfferLetter?.jobOfferLetter?.sign && (
								<>
									<Text>Signature</Text>
									<Image
										src={dataDetailJobOfferLetter?.jobOfferLetter?.sign.url}
										alt={`${dataDetailJobOfferLetter?.jobOfferLetter?.sign.first_name} ${dataDetailJobOfferLetter?.jobOfferLetter?.sign.last_name}`}
									/>
									<Text fontSize={13}>
										(
										{dataDetailJobOfferLetter?.jobOfferLetter?.sign.first_name +
											dataDetailJobOfferLetter?.jobOfferLetter?.sign
												.last_name}
										)
									</Text>
								</>
							)}
						</VStack>

						<VStack spacing={4} width={'full'}>
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

DetailJobOfferLetter.getLayout = ClientLayout
export default DetailJobOfferLetter
