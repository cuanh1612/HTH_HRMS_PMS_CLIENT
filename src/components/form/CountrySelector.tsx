import { Select, Text, useColorMode } from '@chakra-ui/react'
import React, { useEffect, useMemo, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import countryList from 'react-select-country-list'

export interface ICoutrySelectorProps {
	name: string
	form: UseFormReturn<any, any>
}

export const CountrySelector = ({ name, form }: ICoutrySelectorProps)=> {
	const options = useMemo(() => countryList().getData(), [])
	const {colorMode} = useColorMode()

	//Initial value
	const [value, setValue] = useState<string>(form.getValues(name) ? form.getValues(name) : '')

	//Handle change value
	const onChangeCountry: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
		//set value state
		setValue(e.currentTarget.value)

		//set value form
		form.setValue(name, e.currentTarget.value)
	}

	//Set value when change
	useEffect(() => {
		setValue(form.getValues(name) ? form.getValues(name) : '')
	}, [form.getValues(name)])

	return (
		<>
			<Text mb={2} color={"gray.400"}>Country</Text>
			<Select
				bg={colorMode == 'dark' ? '#3a4453': undefined}
				name={name}
				placeholder="Select option"
				onChange={onChangeCountry}
				value={value}
			>
				{options.map((optionCountry) => (
					<option key={optionCountry.value} value={optionCountry.value}>
						{optionCountry.label}
					</option>
				))}
			</Select>
		</>
	)
}
