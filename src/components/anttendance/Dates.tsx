import { Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'

interface IDates {
	countDate?: number
}

export default function Dates({ countDate }: IDates) {
	const [dates, setDates] = useState<number[]>([])
	useEffect(() => {
		if (countDate) {
			const data = []
			for (let index = 1; index <= countDate; index++) {
				data.push(index)
			}
			setDates(data)
		}
	}, [countDate])
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
