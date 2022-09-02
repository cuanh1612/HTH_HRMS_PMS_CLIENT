import {
	Button,
	FormControl,
	FormHelperText,
	FormLabel,
	HStack,
	Text,
	useColorMode,
	useColorModeValue,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import { IOption } from 'type/basicTypes'
import { ISelect } from 'type/element/commom'

const animatedComponents = makeAnimated()

export const SelectMany = ({
	name,
	label,
	form,
	required = false,
	options,
	selectedOptions,
	isModal,
	placeholder,
	onOpenModal,
}: ISelect & { form: UseFormReturn<any, any> }) => {
	const errorColor = useColorModeValue('red.500', 'red.300')
	const { colorMode } = useColorMode()

	const [selectedOptionsState, setSelectedOptionsState] = useState<IOption[]>([])

	//set state when have selected option prop
	useEffect(() => {
		if (selectedOptions) {
			setSelectedOptionsState(selectedOptions)
		}
	}, [selectedOptions])

	//handle change select
	const onChangeSelect = (options: IOption[]) => {
		const newOptionSelects: any[] = []

		for (let index = 0; index < options.length; index++) {
			const option = options[index]
			newOptionSelects.push(option.value)
		}

		//Set state
		setSelectedOptionsState(options)

		//Set value form select many
		form.setValue(name, newOptionSelects)
	}

	//Set again sate when have data selected options select
	useEffect(() => {
		if (selectedOptions) {
			setSelectedOptionsState(selectedOptions)
		}
	}, [selectedOptions])

	return (
		<>
			<FormControl>
				{label && (
					<FormLabel color={'gray.400'} fontWeight={'normal'} htmlFor={name}>
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

				<HStack w={'full'} position={'relative'}>
					<Select
						styles={{
							placeholder: (provided) => ({
								...provided,
								color: '#68707b',
								fontSize: '16px',
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
									color: 'black!important',
									gridArea: '1',
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
							multiValue: (provided) => ({
								...provided,
								background: colorMode == 'dark' ? '#2d3748' : provided.background,
								color: 'white',
							}),
							multiValueLabel: (provided) => ({
								...provided,
								color: colorMode == 'dark' ? 'white' : provided.color,
							}),
							multiValueRemove: (provided) => ({
								...provided,
								color: colorMode == 'dark' ? 'white' : 'gray',
							}),
						}}
						placeholder={placeholder}
						options={options}
						value={selectedOptionsState}
						closeMenuOnSelect={false}
						components={animatedComponents}
						isMulti
						onChange={(value) => {
							onChangeSelect(value as IOption[])
						}}
					/>
					{isModal && onOpenModal && <Button onClick={onOpenModal}>Add</Button>}
				</HStack>

				{form?.formState?.errors[name] && (
					<FormHelperText color={errorColor}>
						{form.formState.errors[name].message}
					</FormHelperText>
				)}
			</FormControl>
		</>
	)
}
