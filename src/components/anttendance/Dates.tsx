import { Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'

interface IDates {
	count?: number
}

export default function Dates({ count }: IDates) {
	const [dates, setDates] = useState<number[]>([])
	useEffect(() => {
		if (count) {
			const data = []
			for (let index = 1; index <= count; index++) {
				data.push(index)
			}
			setDates(data)
		}
	}, [count])
	return (
		<>
			{dates.map((date) => (
				<Text key={date} h={'30px'} minW={'30px'} textAlign={'center'}>
					{date}
				</Text>
			))}
		</>
	)
}
