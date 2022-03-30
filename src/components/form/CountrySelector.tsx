import { Select, Text } from '@chakra-ui/react'
import React, { useMemo, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import countryList from 'react-select-country-list'

export interface ICoutrySelectorProps {
	name: string
	form: UseFormReturn<any, any>
}

export default function CoutrySelector({ name, form }: ICoutrySelectorProps) {
	const options = useMemo(() => countryList().getData(), [])

	//Initial value
	const [value, setValue] = useState<string>(form.getValues(name) ? form.getValues(name) : '')

	//Handle change value
	const onChangeCountry: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
		//set value state
		setValue(e.currentTarget.value)

		//set value form
		form.setValue(name, e.currentTarget.value)
	}

	return (
		<>
			<Text mb={2}>Country</Text>
			<Select
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
