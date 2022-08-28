import { FormControl, FormLabel, Text, useColorMode } from '@chakra-ui/react'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import { ISelect } from 'type/element/commom'

const animatedComponents = makeAnimated()

export const SelectCustom = ({
	label,
	required = false,
	options,
    handleSearch
}: ISelect & { handleSearch: any })=> {
	const {colorMode} = useColorMode()

	return (
		<>
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
