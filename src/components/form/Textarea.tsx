import {
    FormControl, FormHelperText, FormLabel, Textarea as TextareaChakra, useColorModeValue
} from '@chakra-ui/react'
import { Controller, UseFormReturn } from 'react-hook-form'
import { ITextarea } from 'type/element/commom'

export const Textarea = ({
	name,
	label,
	form,
	placeholder,
	required = false,
}: ITextarea & { form: UseFormReturn<any, any> }) => {
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
					<FormLabel fontWeight={'normal'} htmlFor={name} color={"gray.400"}>
						{label}
					</FormLabel>
					<TextareaChakra
						placeholder={placeholder}
						id={name}
						{...field}
						background={'#ffffff10'}
					/>

					{errors[name] && (
						<FormHelperText color={errorColor}>{errors[name].message}</FormHelperText>
					)}
				</FormControl>
			)}
		/>
	)
}
