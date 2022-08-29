import {
	FormControl,
	FormLabel,
	HStack,
	Select as SelectChakra,
	Text,
	useColorMode,
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
	const {colorMode} = useColorMode()
	return (
		<FormControl isRequired={required}>
			{label && (
				<FormLabel color={'gray.400'} fontWeight={'normal'}>
					{label}{' '}
					{required && (
						<Text
							ml={'1'}
							as="span"
							color={colorMode == 'dark' ? 'red.300' : 'red.500'}
						>
							*
						</Text>
					)}
				</FormLabel>
			)}
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
