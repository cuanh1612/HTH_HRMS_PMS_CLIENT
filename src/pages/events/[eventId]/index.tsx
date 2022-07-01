import {
	Avatar,
	Box,
	Button,
	Grid,
	GridItem,
	Tooltip,
	Wrap,
	WrapItem,
} from '@chakra-ui/react'
import { AuthContext } from 'contexts/AuthContext'
import { useRouter } from 'next/router'
import { detailEventQuery } from 'queries'
import { useContext, useEffect } from 'react'
import 'react-quill/dist/quill.bubble.css'
import 'react-quill/dist/quill.snow.css'

export interface IDetailEventProps {
	EventIdProp: string | number | null
	onOpenDl?: any
	onOpenUpdate?: any
}

export default function DetailEvent({ EventIdProp, onOpenDl, onOpenUpdate }: IDetailEventProps) {
	const { isAuthenticated, handleLoading, currentUser } = useContext(AuthContext)
	const router = useRouter()
	const { eventId: eventIdRouter } = router.query

	//Query -------------------------------------------------------------
	const { data: detailEvent } = detailEventQuery(
		isAuthenticated,
		EventIdProp || (eventIdRouter as string)
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
						Event Name:
					</GridItem>
					<GridItem w="100%" colSpan={[2, 1]}>
						{detailEvent?.event?.name}
					</GridItem>
					<GridItem w="100%" colSpan={[2, 1]} color={'gray.400'}>
						Attendees:
					</GridItem>
					<GridItem w="100%" colSpan={[2, 1]}>
						<Wrap>
							{detailEvent?.event?.employees &&
								detailEvent.event.employees.map((employee) => (
									<WrapItem key={employee.id}>
										<Tooltip label={employee.email}>
											<Avatar
												name={employee.name}
												src={employee.avatar?.url}
												size={'xs'}
											/>
										</Tooltip>
									</WrapItem>
								))}
						</Wrap>
					</GridItem>
					<GridItem w="100%" colSpan={[2, 1]} color={'gray.400'}>
						Description:
					</GridItem>
					<GridItem w="100%" colSpan={[2, 1]}>
						<div
							dangerouslySetInnerHTML={{
								__html: detailEvent?.event?.description
									? detailEvent?.event.description
									: '',
							}}
						/>
					</GridItem>
					<GridItem w="100%" colSpan={[2, 1]} color={'gray.400'}>
						Start On:
					</GridItem>
					<GridItem w="100%" colSpan={[2, 1]}>
						{`${detailEvent?.event?.starts_on_date} ${detailEvent?.event?.starts_on_time}`}
					</GridItem>
					<GridItem w="100%" colSpan={[2, 1]} color={'gray.400'}>
						End On:
					</GridItem>
					<GridItem w="100%" colSpan={[2, 1]}>
						{`${detailEvent?.event?.ends_on_date} ${detailEvent?.event?.ends_on_time}`}
					</GridItem>
				</Grid>
				{currentUser?.role === 'Admin' && onOpenDl && (
					<Button onClick={onOpenDl}>delete</Button>
				)}

				{currentUser?.role === 'Admin' && onOpenUpdate && (
					<Button onClick={onOpenUpdate}>update</Button>
				)}
			</Box>
		</>
	)
}
