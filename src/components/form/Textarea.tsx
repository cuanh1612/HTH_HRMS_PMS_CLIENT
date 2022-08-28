import {
	FormControl,
	FormHelperText,
	FormLabel,
	Text,
	Textarea as TextareaChakra,
	useColorMode,
	useColorModeValue,
} from '@chakra-ui/react'
import { Controller, UseFormReturn } from 'react-hook-form'
import { ITextarea } from 'type/element/commom'

export const Textarea = ({
	name,
	label,
	form,
	placeholder,
	required = false,
	defaultValue,
}: ITextarea & { form: UseFormReturn<any, any> }) => {
	const { colorMode } = useColorMode()
	const errorColor = useColorModeValue('red.500', 'red.300')

	const {
		control,
		formState: { errors },
	} = form

	return (
		<Controller
			control={control}
			name={name}
			render={({ field }) => (
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
					<TextareaChakra
						defaultValue={defaultValue ? defaultValue : undefined}
						placeholder={placeholder}
						id={name}
						{...field}
						bg={colorMode == 'dark' ? '#3a4453' : undefined}
					/>

					{errors[name] && (
						<FormHelperText color={errorColor}>{errors[name].message}</FormHelperText>
					)}
				</FormControl>
			)}
		/>
	)
}
