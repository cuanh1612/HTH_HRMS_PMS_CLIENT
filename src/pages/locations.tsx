import {
	Box,
	Button,
	Divider,
	Editable,
	EditableInput,
	EditablePreview,
	HStack,
	Input,
	Table,
	TableContainer,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
	VStack,
} from '@chakra-ui/react'
import { ButtonIcon, Loading } from 'components/common'
import { AuthContext } from 'contexts/AuthContext'
import {
	createLocationsMutation,
	deleteLocationsMutation,
	updateLocationsMutation,
} from 'mutations/location'
import { useRouter } from 'next/router'
import { allLocationsQuery } from 'queries/location'
import { ChangeEvent, ChangeEventHandler, useContext, useEffect, useState } from 'react'
import { AiOutlineCheck } from 'react-icons/ai'
import { MdDeleteOutline } from 'react-icons/md'

export default function Locations() {
	const { isAuthenticated, handleLoading, setToast } = useContext(AuthContext)
	const router = useRouter()

	//State -------------------------------------------------------------
	const [name, setName] = useState('')

	//Mutation ----------------------------------------------------------
	const [mutateCreLocation, { status: statusCreLocation, data: dataCreLocation }] =
		createLocationsMutation(setToast)
	const [mutateDeleLocation, { status: statusDeleLocation, data: dataDeleLocation }] =
		deleteLocationsMutation(setToast)
	const [mutateUpLocation, { status: statusUpLocation, data: dataUpLocation }] =
		updateLocationsMutation(setToast)

	//Query -------------------------------------------------------------
	const { data: dataLocations, mutate: refetchLocations } = allLocationsQuery()

	//UseEffect ---------------------------------------------------------
	//Handle check logged in
	useEffect(() => {
		if (isAuthenticated) {
			handleLoading(false)
		} else {
			if (isAuthenticated === false) {
				router.push('/login')
			}
		}
	}, [isAuthenticated])

	//Notice when create success
	useEffect(() => {
		switch (statusCreLocation) {
			case 'success':
				refetchLocations()
				if (dataCreLocation) {
					setToast({
						type: statusCreLocation,
						msg: dataCreLocation?.message,
					})
				}
				break

			default:
				break
		}
	}, [statusCreLocation])

	//Refetch data skill and notice when delete success
	useEffect(() => {
		switch (statusDeleLocation) {
			case 'success':
				refetchLocations()
				if (dataDeleLocation) {
					setToast({
						type: statusDeleLocation,
						msg: dataDeleLocation?.message,
					})
				}
				break

			default:
				break
		}
	}, [statusDeleLocation])

	//Refetch data skill and notice when update success
	useEffect(() => {
		switch (statusUpLocation) {
			case 'success':
				refetchLocations()
				if (dataUpLocation) {
					setToast({
						type: statusUpLocation,
						msg: dataUpLocation?.message,
					})
				}
				break

			default:
				break
		}
	}, [statusUpLocation])

	// Function ----------------------------------------------------------
	const onChangeName: ChangeEventHandler<HTMLInputElement> = (e) => {
		setName(e.target.value)
	}

	//Handle submit form
	const onSubmit = () => {
		if (!name) {
			setToast({
				type: 'warning',
				msg: 'Please enter full field',
			})
		} else {
			mutateCreLocation({
				locations: [name],
			})
			setName('')
		}
	}

	//Handle delete location
	const onDelete = (skillId: number) => {
		mutateDeleLocation(skillId)
	}

	//Handle update location
	const onUpdate = (locationId: number, oldName: string, newName: string) => {
		if (oldName !== newName) {
			mutateUpLocation({
				name: newName,
				locationId,
			})
		}
	}

	return (
		<Box>
			<VStack align={'start'}>
				<Box maxHeight={'400px'} overflow="auto" w={'full'}>
					<TableContainer w="full" paddingInline={6} pos={'relative'}>
						<Table variant="simple">
							<Thead pos={'sticky'} top={'0px'}>
								<Tr>
									<Th w={'50px'}>#</Th>
									<Th>Location (click to edit)</Th>
									<Th isNumeric>Action</Th>
								</Tr>
							</Thead>
							<Tbody>
								{dataLocations?.locations &&
									dataLocations.locations.map((location) => (
										<Tr key={location.id}>
											<Td>{location.id}</Td>
											<Td>
												<Editable defaultValue={location.name}>
													<EditablePreview />
													<EditableInput
														paddingLeft={2}
														onBlur={(
															e: ChangeEvent<HTMLInputElement>
														) => {
															onUpdate(
																location.id,
																location.name,
																e.target.value
															)
														}}
													/>
												</Editable>
											</Td>
											<Td isNumeric>
												<ButtonIcon
													ariaLabel="button-delete"
													handle={() => onDelete(location.id)}
													icon={<MdDeleteOutline />}
												/>
											</Td>
										</Tr>
									))}
							</Tbody>
						</Table>
						{(statusDeleLocation === 'running' || statusUpLocation === 'running') && (
							<Loading />
						)}
					</TableContainer>
				</Box>

				<Divider />

				<Box paddingInline={6} w="full">
					<VStack align={'start'}>
						<Text>Name Location</Text>
						<HStack w={'full'}>
							<Input
								type={'text'}
								placeholder="Enter name location"
								required
								value={name}
								onChange={onChangeName}
							/>
							<Button
								transform="auto"
								_hover={{ bg: 'hu-Green.normalH', scale: 1.05, color: 'white' }}
								_active={{
									bg: 'hu-Green.normalA',
									scale: 1,
									color: 'white',
								}}
								leftIcon={<AiOutlineCheck />}
								mt={6}
								type="submit"
								onClick={onSubmit}
								isLoading={statusCreLocation === 'running' ? true : false}
							>
								Save
							</Button>
						</HStack>
					</VStack>
				</Box>
			</VStack>
		</Box>
	)
}
