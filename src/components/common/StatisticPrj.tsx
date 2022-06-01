import { Text, VStack } from '@chakra-ui/react'
import * as React from 'react'

interface IStatisticPrj {
	decorate: string
	title: string
	isMoney?: boolean
	content: string | number
}

export const StatisticPrj = ({ decorate, title, isMoney = false, content }: IStatisticPrj) => {
	return (
		<VStack
			boxShadow={'5px 5px 10px 0px #00000047'}
			alignItems={'start'}
			justifyContent={'center'}
			bg={'hu-Green.dark'}
			borderRadius={'10px'}
			overflow={'hidden'}
			pos={'relative'}
			height="120px"
			paddingInline={'20px'}
		>
			<Text
				fontSize={'170px'}
				w={'min-content'}
				transformOrigin={'center'}
				opacity={'0.5'}
				pos={'absolute'}
				right={'-80px'}
				top={'-80px'}
				transform={'rotate(45deg)'}
			>
				{decorate}
			</Text>
			<Text fontSize={'16px'} color={'white'} opacity={'0.7'}>
				{title}
			</Text>
			<Text fontSize={'30px'} fontWeight={'bold'} color={'white'}>
				{isMoney
					? Intl.NumberFormat('en-US', {
							style: 'currency',
							currency: 'USD',
							useGrouping: false,
					  }).format(Number(content))
					: content}
			</Text>
		</VStack>
	)
}
