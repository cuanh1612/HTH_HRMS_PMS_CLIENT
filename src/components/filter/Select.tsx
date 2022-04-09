import {
	FormControl,
	FormLabel,
	HStack,
	Select as SelectChakra,
} from '@chakra-ui/react'
import { ISelect } from 'type/element/commom'

export const Select = ({
	label,
	required = false,
	placeholder,
	options = [],
	disabled = false,
	handleSearch,
	columnId,
}: Partial<ISelect>) => {
	return (
		<FormControl isRequired={required}>
			<FormLabel color={'gray.400'} fontWeight={'normal'}>
				{label}
			</FormLabel>
			<HStack>
				<SelectChakra
					disabled={disabled}
					background={'#ffffff10'}
					placeholder={placeholder}
					onChange={(event) => {
						handleSearch({
							columnId,
							filterValue: event.target.value,
						})
					}}
				>
					{options &&
						options.map((option) => (
							<option value={option.value} key={option.value}>
									{option.label}
							</option>
						))}
				</SelectChakra>
			</HStack>
		</FormControl>
	)
}
