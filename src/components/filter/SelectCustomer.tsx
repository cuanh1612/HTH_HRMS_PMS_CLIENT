import { FormControl, FormLabel, useColorMode } from '@chakra-ui/react'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import { ISelect } from 'type/element/commom'

const animatedComponents = makeAnimated()

export const SelectCustom = ({
	name,
	label,
	required = false,
	options,
    handleSearch
}: ISelect & { handleSearch: any })=> {
	const {colorMode} = useColorMode()

	return (
		<>
			<FormControl isRequired={required}>
				<FormLabel color={'gray.400'} fontWeight={'normal'} htmlFor={name}>
					{label}
				</FormLabel>

				<Select
					className={colorMode == 'dark' ? 'select-dark': 'select-light'}
					options={options}
					closeMenuOnSelect={false}
					components={animatedComponents}
					onChange={(value) => {
						handleSearch(value)
					}}
				/>
			</FormControl>
		</>
	)
}
