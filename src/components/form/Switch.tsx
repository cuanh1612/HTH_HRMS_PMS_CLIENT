import { Box, FormHelperText, Switch as CSwitch, useColorModeValue } from '@chakra-ui/react'
import { FormControl, FormLabel } from '@chakra-ui/react'
import { Controller, UseFormReturn } from 'react-hook-form'
import { IInput } from 'type/element/commom'

export const Switch = ({
	name,
	label,
	form,
	required = false,
}: IInput & { form: UseFormReturn<any, any> }) => {
	const errorColor = useColorModeValue('red.400', 'pink.400')

	return (
		<Controller
			control={form?.control}
			name={name}
			render={({ field }) => (
				<FormControl w={'max-content'} color={'gray.400'} isRequired={required}>
					{label && (
						<FormLabel fontWeight={'normal'} htmlFor={name}>
							{label}
						</FormLabel>
					)}
					<Box h={10}>
						<CSwitch defaultChecked={form.getValues()[name]} id={name} {...field} />
					</Box>
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
