import { Box, FormHelperText, Switch as CSwitch, Text, useColorMode, useColorModeValue } from '@chakra-ui/react'
import { FormControl, FormLabel } from '@chakra-ui/react'
import { Controller, UseFormReturn } from 'react-hook-form'
import { IInput } from 'type/element/commom'

export const Switch = ({
	name,
	label,
	form,
	required = false,
}: IInput & { form: UseFormReturn<any, any> }) => {
	const {colorMode} = useColorMode()
	const errorColor = useColorModeValue('red.500', 'red.300')

	return (
		<Controller
			control={form?.control}
			name={name}
			render={({ field }) => (
				<FormControl w={'max-content'} color={'gray.400'} isRequired={required}>
					<FormLabel color={'gray.400'} fontWeight={'normal'} htmlFor={name}>
						{label}{' '}
						{required && (
							<Text ml={'1'} as="span" color={colorMode == 'dark' ? 'red.300': 'red.500'}>
								*
							</Text>
						)}
					</FormLabel>
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
