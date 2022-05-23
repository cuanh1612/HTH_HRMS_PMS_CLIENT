import {
	FormControl, FormHelperText, FormLabel, NumberDecrementStepper, NumberIncrementStepper, NumberInput,
	NumberInputField,
	NumberInputStepper, useColorModeValue
} from '@chakra-ui/react'
import { Controller, UseFormReturn } from 'react-hook-form'
import { IInputNumber } from 'type/element/commom'

export const InputNumber = ({
	name,
	label,
	form,
	required = false,
    min,
}: IInputNumber & { form: UseFormReturn<any, any> }) => {
	const errorColor = useColorModeValue('red.400', 'pink.400')

	const {
		control,
		formState: { errors },
	} = form

	return (
		<Controller
			control={control}
			name={name}
			render={({ field }) => (
				<FormControl isRequired={required}>
					<FormLabel fontWeight={'normal'} htmlFor={name}>
						{label}
					</FormLabel>
					<NumberInput background={'#ffffff10'} precision={2} id={name} {...field} min={min}>
						<NumberInputField />
						<NumberInputStepper>
							<NumberIncrementStepper />
							<NumberDecrementStepper />
						</NumberInputStepper>
					</NumberInput>

					{errors[name] && (
						<FormHelperText color={errorColor}>{errors[name].message}</FormHelperText>
					)}
				</FormControl>
			)}
		/>
	)
}
