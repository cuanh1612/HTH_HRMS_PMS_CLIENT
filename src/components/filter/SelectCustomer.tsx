import { FormControl, FormLabel, Text, useColorMode } from '@chakra-ui/react'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import { ISelect } from 'type/element/commom'

const animatedComponents = makeAnimated()

export const SelectCustom = ({
	label,
	required = false,
	options,
    handleSearch,
	placeholder
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
					styles={{
						placeholder: (provided)=> ({
							...provided,
							color: "#68707b",
							fontSize: '16px'
						}),
						menu: (provided) => ({
							...provided,
							background: colorMode == 'dark' ? '#2d3748' : 'white',
							border: `1px solid ${colorMode == 'dark' ? '#5a626f' : '#e2e8f0'}`,
							borderRadius: '10px',
						}),
						menuPortal: (provided) => ({
							...provided,
							background: 'red',
						}),
						input: (provided) => {
							return {
								...provided,
								background: colorMode == 'dark' ? '#3a4453' : 'white',
								color: colorMode != 'dark' ? 'black!important': 'white!important',
								gridArea: '1'
							}
						},
						control: (provided) => ({
							...provided,
							background: colorMode == 'dark' ? '#3a4453' : 'white',
							border: `1px solid ${colorMode == 'dark' ? '#5a626f' : '#e2e8f0'}`,
							borderRadius: '6px',
							height: '40px',
						}),
						option: (provided, state) => ({
							...provided,
							background:
								colorMode == 'dark'
									? state.isFocused
										? '#3a4458'
										: state.isSelected
										? '#3a4472'
										: 'transparent'
									: state.isFocused
									? '#e2e8f0'
									: state.isSelected
									? '#bcc4cf40'
									: 'transparent',
							color: colorMode == 'dark' ? 'white' : 'black',
						}),
					}}
					placeholder={placeholder}
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
