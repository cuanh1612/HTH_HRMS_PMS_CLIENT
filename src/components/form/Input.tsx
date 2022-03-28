import {
	FormControl,
	FormLabel,
	InputGroup,
	InputLeftElement,
	Input as CInput,
	FormHelperText,
    useColorModeValue
} from '@chakra-ui/react'
import { Controller, UseFormReturn } from 'react-hook-form'
import { IInput } from 'type/element/commom'

export const Input = ({ name, label, icon, form, placeholder, required= false, type= 'text' }: IInput & { form: UseFormReturn<any, any> }) => {
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
					<InputGroup>
						<InputLeftElement pointerEvents="none" children={icon} />
						<CInput
							background={'#ffffff10'}
							placeholder={placeholder}
							id={name}
							type={type}
							{...field}
						/>
					</InputGroup>

					{errors[name] && (
						<FormHelperText color={errorColor}>{errors[name].message}</FormHelperText>
					)}
				</FormControl>
			)}
		/>
	)
}
