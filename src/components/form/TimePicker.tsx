import {
	HStack,
	IconButton,
	VStack,
	Input,
	Box,
	FormControl,
	FormLabel,
	InputGroup,
	InputLeftElement,
	useColorModeValue,
	FormHelperText,
	useDisclosure,
	Collapse,
	Text,
	useColorMode,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { Controller, UseFormReturn } from 'react-hook-form'
import { BiTimeFive } from 'react-icons/bi'
import { MdOutlineExpandLess, MdOutlineExpandMore } from 'react-icons/md'
import { IInput } from 'type/element/commom'
import { setTime as setTimeInit } from 'utils/time'

export const TimePicker = ({
	name,
	label,
	form,
	required = false,
	timeInit,
}: IInput & { form: UseFormReturn<any, any>; timeInit?: string }) => {
	const errorColor = useColorModeValue('red.500', 'red.300')
	const {colorMode} = useColorMode()
	const [timeInitCurrent, setTimeInitCurrent] = useState<string>()
	const [hours, setHours] = useState({
		value: 0,
		min: 0,
		max: 12,
	})
	const [minutes, setMinutes] = useState({
		value: 0,
		min: 0,
		max: 59,
	})

	// create time
	const [time, setTime] = useState<string>()

	// morning or evening
	const [MorE, setMorE] = useState('AM')

	const toggleMorE = () => {
		if (MorE == 'AM') return setMorE('PM')
		return setMorE('AM')
	}

	useEffect(() => {
		{
			const result = `${hours.value >= 10 ? hours.value : '0' + hours.value}:${
				minutes.value >= 10 ? minutes.value : '0' + minutes.value
			} ${MorE}`
			setTime(result)
			if (hours && minutes) {
				let timeChange = new Date(
					new Date().setHours(hours.value, minutes.value, 0, 0)
				).toLocaleTimeString()
				timeChange = timeChange.split(' ')[1] ? timeChange : timeChange + ' AM'
				timeChange = timeChange.replace('AM', MorE)
				timeChange = timeChange.replace('PM', MorE)

				form.setValue(name, timeChange)
			}
		}
	}, [hours, minutes, MorE])

	useEffect(() => {
		const checkTimeInit = timeInit?.split(' ').find((e) => {
			return e == ('AM' || 'PM')
		})
		if (!checkTimeInit) {
			setTimeInitCurrent(timeInit)
		}
	}, [timeInit])

	useEffect(() => {
		if (timeInitCurrent) {
			const infoTimeInit = setTimeInit(timeInitCurrent)
			setHours((state) => ({
				...state,
				value: infoTimeInit.hours,
			}))

			setMinutes((state) => ({
				...state,
				value: infoTimeInit.minutes,
			}))

			setMorE(infoTimeInit.AMOrPM)
		}
	}, [timeInitCurrent])

	const { onToggle, isOpen } = useDisclosure()

	const getVlFutureHorM = (status: number, time: any) => {
		if (status == 1) {
			if (time.value < time.max) {
				return time.value + 1
			}
		} else {
			if (time.value > time.min) {
				return time.value - 1
			}
		}
	}

	const setHoursHandle = (value?: number) => {
		if (value != null) {
			setHours((state) => ({
				...state,
				value,
			}))
		}
	}

	const setMinutesHandle = (value?: number) => {
		if (value != null) {
			setMinutes((state) => ({
				...state,
				value,
			}))
		}
	}

	return (
		<Controller
			control={form?.control}
			name={name}
			render={() => (
				<FormControl>
					{label && (
						<FormLabel color={'gray.400'} fontWeight={'normal'} htmlFor={name}>
							{label}{' '}
							{required && (
								<Text ml={'1'} as="span" color={colorMode == 'dark' ? 'red.300': 'red.500'}>
									*
								</Text>
							)}
						</FormLabel>
					)}

					<InputGroup onClick={onToggle}>
						<InputLeftElement
							pointerEvents="none"
							color="gray.300"
							fontSize="1.2em"
							children={<BiTimeFive fontSize={'20px'} color="gray" opacity={0.6} />}
						/>
						<Input id={name} value={time} />
					</InputGroup>
					<Collapse in={isOpen} animateOpacity={false}>
						<HStack
							top={'20'}
							pos={'absolute'}
							paddingInline={5}
							zIndex={5}
							borderRadius={6}
							bg={'white'}
							border={'1px solid'}
							borderColor={'gray.200'}
							overflow={'hidden'}
							paddingBlock={3}
							alignItems={'center'}
							justifyContent={'center'}
							spacing={5}
						>
							<VStack>
								<IconButton
									onClick={() => {
										const value = getVlFutureHorM(1, hours)
										setHoursHandle(value)
									}}
									disabled={hours.value == hours.max}
									aria-label="tang"
									icon={<MdOutlineExpandLess />}
								/>
								<Input
									value={hours.value}
									maxW={'40px'}
									p={0}
									textAlign={'center'}
								/>
								<IconButton
									disabled={hours.value == hours.min}
									onClick={() => {
										const value = getVlFutureHorM(-1, hours)
										setHoursHandle(value)
									}}
									aria-label="tang"
									icon={<MdOutlineExpandMore />}
								/>
							</VStack>
							<Box>:</Box>
							<VStack>
								<IconButton
									aria-label="tang"
									onClick={() => {
										const value = getVlFutureHorM(1, minutes)
										setMinutesHandle(value)
									}}
									disabled={minutes.value == minutes.max}
									icon={<MdOutlineExpandLess />}
								/>
								<Input
									value={minutes.value}
									maxW={'40px'}
									p={0}
									textAlign={'center'}
								/>
								<IconButton
									disabled={minutes.value == minutes.min}
									onClick={() => {
										const value = getVlFutureHorM(-1, minutes)
										setMinutesHandle(value)
									}}
									aria-label="tang"
									icon={<MdOutlineExpandMore />}
								/>
							</VStack>
							<VStack>
								<IconButton
									onClick={toggleMorE}
									aria-label="tang"
									icon={<MdOutlineExpandLess />}
								/>
								<Input value={MorE} maxW={'40px'} p={0} textAlign={'center'} />
								<IconButton
									onClick={toggleMorE}
									aria-label="tang"
									icon={<MdOutlineExpandMore />}
								/>
							</VStack>
						</HStack>
					</Collapse>

					{form?.formState.errors[name] && (
						<FormHelperText color={errorColor}>
							{form?.formState.errors[name].message}
						</FormHelperText>
					)}
				</FormControl>
			)}
		/>
	)
}
