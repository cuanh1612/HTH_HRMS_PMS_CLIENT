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

export const SelectCustom = ({
	name,
	label,
	form,
	required = false,
	options,
	selectedOption,
	onChangeValue,
	isModal,
	onOpenModal,
	disabled,
}: ISelect & { form: UseFormReturn<any, any> }) => {
	const errorColor = useColorModeValue('red.400', 'pink.400')
	const {colorMode} = useColorMode()

	//Sate
	const [optionSelect, setOptionSelect] = useState<IOption | undefined>(undefined)

	//set state when have selected option prop
	useEffect(() => {
		if (selectedOption) {
			setOptionSelect(selectedOption)
		}
	}, [selectedOption])

	//handle change select
	const onChangeSelect = (options: IOption) => {
		//Set state
		setOptionSelect(options)

		//Set value form select
		form.setValue(name, options.value)

		//Handle when change value
		if (onChangeValue) {
			onChangeValue(options.value as string | number)
		}
	}

	//Change value selected when form data change
	useEffect(() => {
		if (form.getValues(name)) {
			const selectedOption = options.filter(
				(option) => option.value === form.getValues(name)
			)[0]
			setOptionSelect(selectedOption)
		}
	}, [form.getValues(name)])

	return (
		<>
			<FormControl>
				{label && (
					<FormLabel color={'gray.400'} fontWeight={'normal'} htmlFor={name}>
						{label}{' '}
						{required && (
							<Text as="span" color={colorMode == 'dark' ? 'red.400' : 'red'}>
								*
							</Text>
						)}
					</FormLabel>
				)}

				<HStack w={'full'} position={'relative'}>
					<Select
						value={optionSelect ? optionSelect : selectedOption}
						options={options}
						closeMenuOnSelect={false}
						components={animatedComponents}
						onChange={(value) => {
							onChangeSelect(value as IOption)
						}}
						isDisabled={disabled}
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
