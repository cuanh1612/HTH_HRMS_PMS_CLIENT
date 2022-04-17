import {
	Button,
	FormControl,
	FormHelperText,
	FormLabel,
	HStack,
	Select as SelectChakra,
	useColorModeValue
} from '@chakra-ui/react'
import { Controller, UseFormReturn } from 'react-hook-form'
import { ISelect } from 'type/element/commom'

export const Select = ({
	name,
	label,
	form,
	required = false,
	placeholder,
	options = [],
	isModal = false,
	onOpenModal,
	disabled = false,
}: ISelect & { form: UseFormReturn<any, any> }) => {
	const errorColor = useColorModeValue('red.400', 'pink.400')

	return (
		<Controller
			control={form?.control}
			name={name}
			render={({ field }) => (
				<FormControl isRequired={required}>
					<FormLabel color={'gray.400'} fontWeight={'normal'} htmlFor={name}>
						{label}
					</FormLabel>
					<HStack>
						<SelectChakra
							disabled={disabled}
							background={'#ffffff10'}
							{...field}
							id={name}
							placeholder={placeholder}
						>
							{options.map((option) => (
								<option value={option.value} key={option.value}>
									{option.label}
								</option>
							))}
						</SelectChakra>
						{isModal && onOpenModal && <Button onClick={onOpenModal}>Add</Button>}
					</HStack>

					{form?.formState?.errors[name] && (
						<FormHelperText color={errorColor}>
							{form.formState.errors[name].message}
						</FormHelperText>
					)}
				</FormControl>
			)}
		/>
	)
}
