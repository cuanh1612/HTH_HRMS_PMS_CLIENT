import { FormControl, FormHelperText, FormLabel, useColorModeValue } from '@chakra-ui/react'
import { useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import { IOption } from 'type/basicTypes'
import { ISelect } from 'type/element/commom'

const animatedComponents = makeAnimated()

export default function SelectCustom({
	name,
	label,
	form,
	required = false,
	options,
}: ISelect & { form: UseFormReturn<any, any> }) {
	const errorColor = useColorModeValue('red.400', 'pink.400')

	//Sate
	const [optionSelect, setOptionSelect] = useState<string>('')

	//handle change select
	const onChangeSelect = (options: IOption) => {
		//Set state
		setOptionSelect(options.value)

		//Set value form select
		form.setValue(name, options.value)
	}

	return (
		<>
			<FormControl isRequired={required}>
				<FormLabel color={'gray.400'} fontWeight={'normal'} htmlFor={name}>
					{label}
				</FormLabel>

				<Select
					options={options}
					closeMenuOnSelect={false}
					components={animatedComponents}
					onChange={(value) => {
						onChangeSelect(value as IOption)
					}}
				/>

				{form?.formState?.errors[name] && (
					<FormHelperText color={errorColor}>
						{form.formState.errors[name].message}
					</FormHelperText>
				)}
			</FormControl>
		</>
	)
}
