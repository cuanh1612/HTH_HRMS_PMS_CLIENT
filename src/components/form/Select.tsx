import {
	Box,
	Button,
	FormControl,
	FormHelperText,
	FormLabel,
	HStack,
	Select as SelectChakra,
	useColorModeValue,
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
									{option.lable}
								</option>
							))}
						</SelectChakra>
						{isModal && onOpenModal && <Button onClick={onOpenModal}>Add</Button>}
					</HStack>

					{errors[name] && (
						<FormHelperText color={errorColor}>{errors[name].message}</FormHelperText>
					)}
				</FormControl>
			)}
		/>
	)
}
