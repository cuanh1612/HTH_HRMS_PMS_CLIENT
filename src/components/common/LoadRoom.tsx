import { Grid, GridItem, Skeleton } from '@chakra-ui/react'
import React from 'react'

export const LoadRoom = () => {
	return (
		<Grid
			w={'full'}
			templateColumns={['repeat(1, 1fr)', 'repeat(2, 1fr)', null, null, 'repeat(3, 1fr)']}
			gap={6}
		>
			<GridItem borderRadius={10} overflow={'hidden'} height={'250px'}>
				<Skeleton height="100%" w={'full'} />
			</GridItem>
			<GridItem borderRadius={10} overflow={'hidden'} height={'250px'}>
				<Skeleton height="100%" w={'full'} />
			</GridItem>
			<GridItem borderRadius={10} overflow={'hidden'} height={'250px'}>
				<Skeleton height="100%" w={'full'} />
			</GridItem>
		</Grid>
	)
}
