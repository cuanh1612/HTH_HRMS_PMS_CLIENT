import { Box, HStack, Text, Image as CImage, VStack, Button } from '@chakra-ui/react'
import { AuthContext } from 'contexts/AuthContext'
import Link from 'next/link'
import React, { useContext, useEffect } from 'react'
import { AiOutlinePhone } from 'react-icons/ai'
import { CgMail } from 'react-icons/cg'
import { GrFacebookOption } from 'react-icons/gr'
import { RiSuitcaseLine } from 'react-icons/ri'
import copy from 'copy-to-clipboard'
import { NextLayout } from 'type/element/layout'
import { RecruitLayout } from 'components/layouts'
import { companyInfoQuery } from 'queries/companyInfo'
import { Head } from 'components/common'

const index: NextLayout = () => {
	const { handleLoading, setToast } = useContext(AuthContext)

	const {data} = companyInfoQuery()

	useEffect(() => {
		handleLoading(false)
	}, [])
	return (
		<>
			<Head title='Recruit'/>
			<Box pos={'relative'} w={'full'}>
				<Box w={'full'} maxW={'60%'} pos={'relative'} overflow={'hidden'}>
					<CImage borderRadius={'20px'} src={'./assets/work.jpg'} />
					<Box
						w={'100%'}
						borderRadius={'20px'}
						h={'100%'}
						opacity={0.8}
						pos={'absolute'}
						backdropBlur={'100px'}
						bg={'white'}
						top={'0'}
						left={'0'}
					></Box>
				</Box>
				<VStack
					spacing={4}
					alignItems={'start'}
					justifyContent={'center'}
					h={'100%'}
					top={0}
					right={0}
					w={'600px'}
					pos={'absolute'}
				>
					<Text fontSize={'40px'} fontWeight={'bold'}>
						{data?.companyInfo.name || 'HUPROM'}
					</Text>
					<Link passHref href={process.env.NEXT_PUBLIC_UI_URL || ''}>
						<Text textDecoration={'underline'} cursor={'pointer'} color={'green'}>
							{process.env.NEXT_PUBLIC_UI_URL}
						</Text>
					</Link>
					<Text>
						Lorem Ipsum is simply dummy text of the printing and typesetting industry.
						Lorem Ipsum has been the industry's standard dummy text ever since the
						1500s, when an unknown printer took a galley of type and scrambled it to
						make a type specimen book.
					</Text>
					<Link passHref href={'/job-opening'}>
						<Button colorScheme={'green'} leftIcon={<RiSuitcaseLine fontSize={20} />}>
							Jobs
						</Button>
					</Link>
				</VStack>
			</Box>
			<HStack
				spacing={10}
				h={'500px'}
				mt={10}
				w={'full'}
				overflow={'hidden'}
				borderRadius={'20px'}
			>
				<VStack spacing={8} alignItems={'flex-end'} width={'400px'} minW={'400px'}>
					<Box dir="rtl">
						<Text fontSize={'20px'} fontWeight={'semibold'}>
							Info to contact
						</Text>
						<Text fontSize={'14px'} color={'gray'}>
							You can contact with us to support
						</Text>
					</Box>
					<VStack alignItems={'flex-end'} spacing={3}>
						<HStack
							onClick={() => {
								copy(`facebook`)
								setToast({
									type: 'success',
									msg: 'Copy link successfully',
								})
							}}
							cursor={'pointer'}
							color={'hu-Green.normal'}
							borderRadius={5}
							p={2}
							bg={'hu-Green.lightH'}
						>
							<Text>Facebook</Text>
							<GrFacebookOption fontSize={'20px'} />
						</HStack>
						<HStack
							onClick={() => {
								copy(`facebook`)
								setToast({
									type: 'success',
									msg: 'Copy link successfully',
								})
							}}
							cursor={'pointer'}
							color={'hu-Pink.normal'}
							borderRadius={5}
							p={2}
							bg={'hu-Pink.lightH'}
						>
							<Text>Gmail</Text>
							<CgMail fontSize={'20px'} />
						</HStack>
						<HStack
							onClick={() => {
								copy(`facebook`)
								setToast({
									type: 'success',
									msg: 'Copy link successfully',
								})
							}}
							cursor={'pointer'}
							color={'hu-Lam.dark'}
							borderRadius={5}
							p={2}
							bg={'hu-Lam.lightH'}
						>
							<Text>Number phone</Text>
							<AiOutlinePhone fontSize={'20px'} />
						</HStack>
					</VStack>
				</VStack>
				<iframe
					src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.1138412620576!2d106.64809991541557!3d10.802592161662606!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317529487905cfb3%3A0xef1bef10a73cd18!2zMTk2LzMxIMSQLiBD4buZbmcgSMOyYSwgUGjGsOG7nW5nIDEyLCBUw6JuIELDrG5oLCBUaMOgbmggcGjhu5EgSOG7kyBDaMOtIE1pbmgsIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1657182199216!5m2!1svi!2s"
					width="100%"
					height="100%"
					style={{
						border: 'none',
						borderRadius: '20px',
					}}
					allowFullScreen={true}
					loading="lazy"
					referrerPolicy="no-referrer-when-downgrade"
				></iframe>
			</HStack>
		</>
	)
}

index.getLayout = RecruitLayout
export default index
