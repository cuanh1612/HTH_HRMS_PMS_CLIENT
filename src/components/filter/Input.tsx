import {
	FormControl,
	FormLabel,
	InputGroup,
	InputLeftElement,
	Input as CInput,
    useColorMode,
} from '@chakra-ui/react'
import { IInput } from 'type/element/commom'

export const Input = ({
	label,
	icon,
	placeholder,
	required = false,
	type = 'text',
	handleSearch,
	columnId
}: Partial<IInput>) => {
    const {colorMode} = useColorMode()

		return (
			<FormControl isRequired={required}>
				<FormLabel color={'gray.400'} fontWeight={'normal'}>
					{label}
				</FormLabel>
				<InputGroup>
					<InputLeftElement pointerEvents="none" children={icon} />
					<CInput
						background={'#ffffff10'}
                        color={colorMode == 'light' ? undefined: 'white'}
						placeholder={placeholder}
						type={type}
						onChange={(event)=> {
							handleSearch({
								columnId,
								filterValue: event.target.value,
							})
						}}
					/>
				</InputGroup>
			</FormControl>
		)
	


}
