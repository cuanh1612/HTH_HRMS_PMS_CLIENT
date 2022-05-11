import { FormControl, FormHelperText, FormLabel, HStack, useColorModeValue } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { Controller, UseFormReturn } from 'react-hook-form'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import { IOption } from 'type/basicTypes'
import { ISelect } from 'type/element/commom'

const animatedComponents = makeAnimated()

export default function SelectMany({
	name,
	label,
	form,
	required = false,
	options,
}: ISelect & { form: UseFormReturn<any, any> }) {
	const errorColor = useColorModeValue('red.400', 'pink.400')

	//Sate
	const [optionSelects, setOptionSelects] = useState<string[]>([])

	//handle change select
	const onChangeSelect = (options: IOption[]) => {
		let newOptionSelects: string[] = []

		for (let index = 0; index < options.length; index++) {
			const option = options[index]
			newOptionSelects.push(option.value)
		}

		//Set state
		setOptionSelects(newOptionSelects)

		//Set value form select many
		form.setValue(name, newOptionSelects)
	}

	//Set value when change
	useEffect(() => {
		setOptionSelects(form.getValues(name) ? form.getValues(name) : [])
	}, [form.getValues(name)])

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
					isMulti
					onChange={(value) => {
						onChangeSelect(value as IOption[])
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
