import { ClientLayout } from 'components/layouts'
import { AuthContext } from 'contexts/AuthContext'
import { useContext, useEffect, useState } from 'react'
import { NextLayout } from 'type/element/layout'
import { Listbox } from '@headlessui/react'
import { Avatar, HStack, Text, VStack } from '@chakra-ui/react'

const table: NextLayout = () => {
	const { handleLoading, isAuthenticated } = useContext(AuthContext)

	const people = [
		{ id: 1, name: 'Durward Reynolds', unavailable: false },
		{ id: 2, name: 'Kenton Towne', unavailable: false },
		{ id: 3, name: 'Therese Wunsch', unavailable: false },
		{ id: 4, name: 'Benedict Kessler', unavailable: false },
		{ id: 5, name: 'Katelyn Rohan', unavailable: false },
	]

	useEffect(() => {
		if (isAuthenticated) {
			handleLoading(false)
		}
	}, [isAuthenticated])

	const [selectedPerson, setSelectedPerson] = useState(people[0])

	return (
		<Listbox value={selectedPerson} onChange={setSelectedPerson}>
			<Listbox.Button className={'listBt'}>
				<HStack
					background={'#ffffff10'}
					w={'full'}
					borderWidth={1}
					spacing={4}
					borderColor={'gray.400'}
					h={'40px'}
					borderRadius={'5px'}
					padding={'0px 32px 1px 16px'}
				>
					<Avatar name={'ffdd'} size={'xs'} />
					<Text isTruncated>{selectedPerson.name}</Text>
				</HStack>
			</Listbox.Button>
			<Listbox.Options className={'listOps'}>
				<VStack
					listStyleType={'none'}
					alignItems={'start'}
					borderWidth={2}
					borderRadius={15}
					paddingBlock={4}
				>
					{people.map((person) => (
						<Listbox.Option
							className={({ active }) => (!active ? 'listOp' : 'listOpActive')}
							key={person.id}
							value={person}
						>
							{({ selected }) => (
								<HStack
									w={'full'}
									spacing={4}
									h={'40px'}
									borderRadius={'5px'}
									padding={'0px 32px 1px 16px'}
									cursor={'pointer'}
									background={selected ? '#2091fe' : undefined}
								>
									<Avatar name={'ffdd'} size={'xs'} />
									<Text>{person.name}</Text>
								</HStack>
							)}
						</Listbox.Option>
					))}
				</VStack>
			</Listbox.Options>
		</Listbox>
	)
}

table.getLayout = ClientLayout

export default table
