import { Box, Grid, GridItem } from '@chakra-ui/react'
import { AuthContext } from 'contexts/AuthContext'
import { useRouter } from 'next/router'
import { detailNoticeBoardQuery } from 'queries'
import { useContext, useEffect } from 'react'
import 'react-quill/dist/quill.bubble.css'
import 'react-quill/dist/quill.snow.css'

export interface IDetailNoticeBoardProps {
	NoticeBoardIdProp?: string | number | null
}

export default function DetailNoticeBoard({ NoticeBoardIdProp }: IDetailNoticeBoardProps) {
	const { isAuthenticated, handleLoading } = useContext(AuthContext)
	const router = useRouter()
	const { noticeBoardId: noticeBoardIdRouter } = router.query

	//Query -------------------------------------------------------------
	const { data: detailNoticeBoard } = detailNoticeBoardQuery(
		isAuthenticated,
		NoticeBoardIdProp || (noticeBoardIdRouter as string)
	)

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
			<Box pos="relative" p={6}>
				<Grid templateColumns="repeat(2, 1fr)" gap={6} mt={2}>
					<GridItem w="100%" colSpan={[2, 1]} color={'gray.400'}>
						Notice Board Id:
					</GridItem>
					<GridItem w="100%" colSpan={[2, 1]}>
						{detailNoticeBoard?.noticeBoard?.id || '--'}
					</GridItem>
					<GridItem w="100%" colSpan={[2, 1]} color={'gray.400'}>
						Notice To:
					</GridItem>
					<GridItem w="100%" colSpan={[2, 1]}>
						{detailNoticeBoard?.noticeBoard?.notice_to || '--'}
					</GridItem>
					<GridItem w="100%" colSpan={[2, 1]} color={'gray.400'}>
						Heading:
					</GridItem>
					<GridItem w="100%" colSpan={[2, 1]}>
						{detailNoticeBoard?.noticeBoard?.heading || '--'}
					</GridItem>
					<GridItem w="100%" colSpan={[2, 1]} color={'gray.400'}>
						Detail:
					</GridItem>
					<GridItem w="100%" colSpan={[2, 1]}>
						<div
							dangerouslySetInnerHTML={{
								__html: detailNoticeBoard?.noticeBoard?.details
									? detailNoticeBoard.noticeBoard.details
									: '',
							}}
						/>
					</GridItem>
				</Grid>
			</Box>
		</>
	)
}
