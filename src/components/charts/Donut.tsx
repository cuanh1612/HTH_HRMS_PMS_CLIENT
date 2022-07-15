import { useColorMode } from '@chakra-ui/react'
import dynamic from 'next/dynamic'
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface IDonut {
	labels: string[]
	colors: string[]
	data: number[]
	height: number
}

export const Donut = ({ labels, colors, data, height }: IDonut) => {
	const { colorMode } = useColorMode()
	return (
		<Chart
			options={{
				labels,
				stroke: {
					show: false,
				},
				colors,
				legend: {
					position: 'bottom',
					fontSize: '12px',
					labels: {
						colors: colorMode == 'dark' ? ['white'] : ['black'],
					},
				},
				chart: {
					zoom: {
						enabled: true,
					},
				},
			}}
			series={data}
			type="donut"
			width="100%"
			height={height}
		/>
	)
}
