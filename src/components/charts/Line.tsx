import { useColorMode } from '@chakra-ui/react'
import dynamic from 'next/dynamic'
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface IChart {
    labels: string[],
    colors?: string[],
    data: number[]
    height: number
    title: string
}

export const Line = ({title, data, labels, colors, height}: IChart) => {
	const {colorMode} = useColorMode()
	return (
		<Chart
			width={'100%'}
			height={height}
			series={[
				{
					name: title,
					data,
				},
			]}
			options={{
				chart: {
					type: 'line',
					toolbar: {
						show: false,
					},
				},
				colors,
				dataLabels: {
					enabled: true,
				},
				stroke: {
					curve: 'smooth',
				},
				grid: {
					yaxis: {
						lines: {
							show: false,
						},
					},
				},
				markers: {
					size: 1,
				},
				xaxis: {
					categories: labels,
				},
				yaxis: {
					labels: {
						style: {
							fontSize: '12px',
							colors: colorMode == 'dark' ? ['white'] : ['black'],
						},
					},
				},
				legend: {
					labels: {
						colors: colorMode == 'dark' ? ['white'] : ['black'],
					},
					show: false,
				},
			}}
		/>
	)
}
