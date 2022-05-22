import {
	FormControl,
	FormLabel,
	InputGroup,
	InputLeftElement,
	Input as CInput,
	FormHelperText,
	useColorModeValue,
	useColorMode,
	Text,
} from '@chakra-ui/react'
import { Controller, UseFormReturn } from 'react-hook-form'
import { IInput } from 'type/element/commom'

export const Input = ({
	name,
	label,
	icon,
	form,
	placeholder,
	required = false,
	type = 'text',
	autoComplete
}: IInput & { form: UseFormReturn<any, any> }) => {
	const errorColor = useColorModeValue('red.400', 'pink.400')
	const { colorMode } = useColorMode()

	return (
		<Controller
			control={form?.control}
			name={name}
			render={({ field }) => (
				<FormControl color={'gray.400'}>
					{label && (
						<FormLabel fontWeight={'normal'} htmlFor={name}>
							{label} { required && <Text as='span' color={'red'}>*</Text>}
						</FormLabel>
					)}
					<InputGroup>
						{icon && <InputLeftElement pointerEvents="none" children={icon} />}
						<CInput
							background={'#ffffff10'}
							color={colorMode == 'light' ? undefined : 'white'}
							placeholder={placeholder}
							id={name}
							type={type}
							autoComplete={autoComplete ? autoComplete : undefined}
							{...field}
						/>
					</InputGroup>

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
