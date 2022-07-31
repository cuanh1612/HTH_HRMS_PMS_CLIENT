import { Box, HStack, Input, Text, useColorMode, VStack } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { TiDeleteOutline } from 'react-icons/ti'

export interface IInputMutipleProps {
	label: string
	name: string
	form: UseFormReturn<any, any>
}

export const InputMutiple = ({ label, name, form }: IInputMutipleProps)=> {
	const {colorMode} = useColorMode()
	const [valueMultiple, setValueMultiple] = useState<string[]>(form.getValues(name))

	//handle press enter
	const onAddValue: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
		if (e.ctrlKey && e.keyCode === 13) {
			const oldValues = form.getValues(name)

			//Set value state
			setValueMultiple(
				oldValues && Array.isArray(oldValues)
					? [...oldValues, e.currentTarget.value]
					: [e.currentTarget.value]
			)

			//Set value form
			form.setValue(
				name,
				oldValues && Array.isArray(oldValues)
					? [...oldValues, e.currentTarget.value]
					: [e.currentTarget.value]
			)

			//Clear data input
			e.currentTarget.value = ''
		}
	}

	//Handle delete value
	const onDelete = (index: number) => {
		let oldValues = form.getValues(name)
		if (oldValues && Array(oldValues)) {
			oldValues.splice(index, 1)
		} else {
			oldValues = []
		}

		//Set value form
		form.setValue(name, oldValues)

		//Set value state
		setValueMultiple(oldValues)
	}

	//Set value when change
	useEffect(() => {
		setValueMultiple(form.getValues(name) ? form.getValues(name) : [])
	}, [form.getValues(name)])

	return (
		<VStack alignItems={'start'}>
			<Text>{label}</Text>
			<Input 	bg={colorMode == 'dark' ? '#3a4453' : undefined} placeholder="Enter skill and press 'Ctrl + Enter'" onKeyDown={onAddValue} />
			{valueMultiple && valueMultiple.length > 0 && (
				<Box display={'flex'} flexWrap={'wrap'}>
					{valueMultiple.map((value, index) => (
						<HStack
							key={value}
							padding={1}
							bgColor={'gray.200'}
							borderRadius={5}
							mb={3}
							mr={3}
						>
							<Text>{value}</Text>
							<TiDeleteOutline cursor={'pointer'} onClick={() => onDelete(index)} />
						</HStack>
					))}
				</Box>
			)}
		</VStack>
	)
}
