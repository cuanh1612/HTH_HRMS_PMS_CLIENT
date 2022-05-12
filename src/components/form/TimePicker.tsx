import {
	HStack,
	IconButton,
	VStack,
	useNumberInput,
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
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { Controller, UseFormReturn } from 'react-hook-form'
import { BiTimeFive } from 'react-icons/bi'
import { MdOutlineExpandLess, MdOutlineExpandMore } from 'react-icons/md'
import { ITime } from 'type/basicTypes'
import { IInput } from 'type/element/commom'
import { setTime as setTimeInit } from 'utils/time'

const TimePicker = ({
	name,
	label,
	form,
	required = false,
	timeInit,
}: IInput & { form: UseFormReturn<any, any>; timeInit?: string }) => {
	const errorColor = useColorModeValue('red.400', 'pink.400')

	const [isSetInit, setIsSetInit] = useState(false)

	// create time
	const [time, setTime] = useState<string>()

	// morning or evening
	const [MorE, setMorE] = useState('AM')

	const toggleMorE = () => {
		if (MorE == 'AM') return setMorE('PM')
		return setMorE('AM')
	}

	const hours = useNumberInput({
		step: 1,
		defaultValue: timeInit ? setTimeInit(timeInit).hours : 0,
		max: 12,
		min: 0,
	})

	const incHours = hours.getIncrementButtonProps()
	const decHours = hours.getDecrementButtonProps()
	const inputHours = hours.getInputProps()

	const minutes = useNumberInput({
		step: 1,
		defaultValue: timeInit ? setTimeInit(timeInit).minutes : 0,
		max: 59,
		min: 0,
	})
	const incMinutes = minutes.getIncrementButtonProps()
	const decMinutes = minutes.getDecrementButtonProps()
	const inputMinutes = minutes.getInputProps()

	useEffect(() => {
		const result = `${hours.valueAsNumber >= 10 ? hours.value : '0' + hours.value}:${
			minutes.valueAsNumber >= 10 ? minutes.value : '0' + minutes.value
		} ${MorE}`
		isSetInit && timeInit ? setTime(setTimeInit(timeInit).time) : setTime(result)
		if (hours && minutes) {
			let timeChange = new Date(
				new Date().setHours(hours.valueAsNumber, minutes.valueAsNumber, 0, 0)
			).toLocaleTimeString()
			timeChange = timeChange.split(' ')[1] ? timeChange : timeChange + ' AM'
			timeChange = timeChange.replace('AM', MorE)
			timeChange = timeChange.replace('PM', MorE)

			form.setValue(name, isSetInit && timeInit ? setTimeInit(timeInit).time : timeChange)
		}
		if (isSetInit && timeInit) {
			setMorE(setTimeInit(timeInit).AMOrPM)
		}
	}, [hours, minutes, MorE, form.getValues()[name]])

	const { onToggle, onOpen, isOpen, onClose } = useDisclosure()

	return (
		<Controller
			control={form?.control}
			name={name}
			render={({ field }) => (
				<FormControl onMouseMove={onOpen} onMouseLeave={onClose} isRequired={required}>
					<FormLabel fontWeight={'normal'} htmlFor={name} color={'gray.400'}>
						{label}
					</FormLabel>

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
							zIndex={10}
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
									{...incHours}
									aria-label="tang"
									icon={<MdOutlineExpandLess />}
								/>
								<Input {...inputHours} maxW={'40px'} p={0} textAlign={'center'} />
								<IconButton
									{...decHours}
									aria-label="tang"
									icon={<MdOutlineExpandMore />}
								/>
							</VStack>
							<Box>:</Box>
							<VStack>
								<IconButton
									{...incMinutes}
									aria-label="tang"
									icon={<MdOutlineExpandLess />}
								/>
								<Input {...inputMinutes} maxW={'40px'} p={0} textAlign={'center'} />
								<IconButton
									{...decMinutes}
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

export default TimePicker
