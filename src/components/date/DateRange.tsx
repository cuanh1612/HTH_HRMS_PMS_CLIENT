import { ChevronDownIcon } from '@chakra-ui/icons'
import {
	Box,
	Button,
	HStack,
	MenuButton,
	MenuItem,
	MenuList,
	Menu,
	useBreakpoint,
	useDisclosure,
	FormControl,
	FormLabel,
	VStack,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { DayPicker } from 'react-day-picker'
import { IInput } from 'type/element/commom'

export default function DateRange({ required = false, label, handleSelect }: Partial<IInput>) {
	const [selected, setSelected] = useState<any>()
	const breakpoint = useBreakpoint()
	const { isOpen, onClose, onOpen } = useDisclosure()

	useEffect(()=> {
		handleSelect(selected)
	}, [selected])

	return (
		<VStack spacing={'0px'} w='full'>
			<FormControl isRequired={required}>
				<FormLabel color={'gray.400'} fontWeight={'normal'}>
					{label}
				</FormLabel>
			</FormControl>
			<Menu placement='bottom-end' isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
				<MenuButton
					fontWeight={'normal'}
					textAlign={'start'}
					width={'100%'}
					as={Button}
					rightIcon={<ChevronDownIcon />}
				>
					{selected?.from ? new Date(selected.from).toLocaleDateString('en-GB') : 'Start'}{' '}
					🠖 {selected?.to ? new Date(selected.to).toLocaleDateString('en-GB') : 'End'}
				</MenuButton>
				<MenuList>
					<HStack alignItems={'start'} w={'full'}>
						<Box pt={'4'} flex={'1'}>
							<MenuItem
								onClick={() => {
									setSelected({
										from: new Date(),
										to: new Date()
									})
								}}
							>
								Today
							</MenuItem>
							<MenuItem
								onClick={() => {
									const date = new Date()
									setSelected({
										from: date.setMonth(date.getMonth() - 1),
										to: new Date(),
									})
								}}
							>
								Last 30 Days
							</MenuItem>
							<MenuItem
								onClick={() => {
									var date = new Date()
									var firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
									var lastDay = new Date(
										date.getFullYear(),
										date.getMonth() + 1,
										0
									)
									setSelected({
										from: firstDay,
										to: lastDay,
									})
								}}
							>
								This Month
							</MenuItem>
							<MenuItem
								onClick={() => {
									var date = new Date()
									setSelected({
										from: date.setMonth(date.getMonth() - 3),
										to: new Date(),
									})
								}}
							>
								Last 90 Days
							</MenuItem>
							<MenuItem
								onClick={() => {
									var date = new Date()
									setSelected({
										from: date.setMonth(date.getMonth() - 6),
										to: new Date(),
									})
								}}
							>
								Last 6 Months
							</MenuItem>
							<MenuItem
								onClick={() => {
									var date = new Date()
									setSelected({
										from: date.setFullYear(date.getFullYear() - 1),
										to: new Date(),
									})
								}}
							>
								Last 1 Year
							</MenuItem>
						</Box>
						<Box
							display={['none', 'block']}
							borderLeft={'1px solid'}
							borderColor={'gray.200'}
						>
							<DayPicker
								numberOfMonths={breakpoint != ('md' && 'sm') ? 2 : 1}
								mode="range"
								selected={selected}
								onSelect={setSelected}
							/>
							<HStack pr={4} pb={3} justifyContent={'flex-end'}>
								<Button
									onClick={onClose}
									disabled={selected?.from && selected?.to ? false : true}
								>
									Ok
								</Button>
							</HStack>
						</Box>
					</HStack>
				</MenuList>
			</Menu>
		</VStack>
	)
}
