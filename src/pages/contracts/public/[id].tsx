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
	useDisclosure,
	VStack,
} from '@chakra-ui/react'
import { AuthContext } from 'contexts/AuthContext'
import Link from 'next/link'
import { useContext, useEffect } from 'react'
import { AiOutlineCheck, AiOutlineDownload } from 'react-icons/ai'

export interface IPublickContractProps {}

export default function PublickContract({}: IPublickContractProps) {
	const { isAuthenticated, handleLoading } = useContext(AuthContext)

	//Set up option action
	const { isOpen: isOpenAction, onOpen: onOpenAction, onClose: onCloseAction } = useDisclosure()

	//Handle loading page
	useEffect(() => {
		handleLoading(false)
	}, [isAuthenticated])

	return (
		<Box bgColor={'#f2f4f7'} h={'100vh'} p={10}>
			<Container maxW="container.xl" bg="white" color="#262626" borderRadius={5} p={5}>
				<VStack spacing={4} align="start">
					<HStack justify="space-between" wrap={'wrap'} w={'full'}>
						<Image
							boxSize={'50px'}
							src="https://bit.ly/dan-abramov"
							alt="Dan Abramov"
							borderRadius={5}
						/>
						<Text fontSize={20} fontWeight={'bold'}>
							CONTRACT
						</Text>
					</HStack>
					<Grid templateColumns="repeat(2, 1fr)" gap={6} w={'full'}>
						<GridItem w="100%" colSpan={[2, 1]}>
							<Text>HUPROM</Text>
							<Text>Company address</Text>
							<Text>+84 833876372</Text>
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
												<Td>#20</Td>
											</Tr>
											<Tr>
												<Td>Start Date</Td>
												<Td>22-03-2022</Td>
											</Tr>
											<Tr>
												<Td>End Date</Td>
												<Td>22-03-2022</Td>
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
									<Text>Andrew Koelpin</Text>
									<Text>Beer-Towne</Text>
									<Text>8973 Elwyn Parkway Apt. 059</Text>
									<Text>Stokesmouth, LA 58356</Text>
								</Box>
							</VStack>
						</GridItem>

						<GridItem w="100%" colSpan={2}>
							<VStack align={'start'}>
								<Text fontWeight={'semibold'}>Subject</Text>
								<Text>Bill! the master.</Text>
							</VStack>
						</GridItem>

						<GridItem w="100%" colSpan={2}>
							<VStack align={'start'}>
								<Text fontWeight={'semibold'}>Description</Text>
								<Text>
									Alice coming. 'There's PLENTY of room!' said Alice sharply, for
									she felt sure it would be worth the trouble of getting her hands
									on her spectacles, and began staring at the bottom of a good
									deal worse off than before, as the other.' As soon as it
									happens; and if it makes rather a complaining ton.
								</Text>
							</VStack>
						</GridItem>
					</Grid>

					<Divider />

					<VStack align={'end'} w={'full'}>
						<Text fontSize={20} fontWeight={'bold'}>
							Contract Value: $296.00
						</Text>
					</VStack>

					<HStack justify={'end'} w={'full'}>
						<Link href={'/contracts'} passHref>
							<Button colorScheme="red" variant="ghost">
								<a>Cancel</a>
							</Button>
						</Link>

						<Menu placement="top-end">
							<MenuButton
								isActive={isOpenAction}
								as={Button}
								rightIcon={<ChevronDownIcon />}
							>
								Actions
							</MenuButton>
							<MenuList>
								<MenuItem icon={<AiOutlineCheck fontSize={15} />}>Sign</MenuItem>
								<MenuItem icon={<AiOutlineDownload fontSize={15} />}>
									Download
								</MenuItem>
							</MenuList>
						</Menu>
					</HStack>
				</VStack>
			</Container>
		</Box>
	)
}
