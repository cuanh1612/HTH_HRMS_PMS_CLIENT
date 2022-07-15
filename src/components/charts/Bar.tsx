import { useColorMode } from '@chakra-ui/react'
import dynamic from 'next/dynamic'
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface IChart {
	labels: string[]
	colors?: string[]
	data: number[]
	height: number
	distributed?: boolean
	isMoney?: boolean
	isShowLabel?: boolean
}

export const Bar = ({
	labels,
	colors,
	data,
	height,
	distributed = true,
	isMoney = false,
	isShowLabel = false,
}: IChart) => {
	const { colorMode } = useColorMode()
	return (
		<Chart
			options={{
				dataLabels: {
					enabled: true,
					formatter: (val): any => {
						return isMoney
							? Intl.NumberFormat('en-US', {
									style: 'currency',
									currency: 'USD',
									useGrouping: false,
							  }).format(Number(val))
							: val
					},
					offsetY: -20,
					style: {
						fontSize: '12px',
						colors: colors,
					},
				},
				colors,
				stroke: {
					show: true,
					curve: 'smooth',
					lineCap: 'butt',
					width: 0,
					dashArray: 0,
				},
				legend: {
					show: !isShowLabel,
					labels: {
						colors: colorMode == 'dark' ? ['white'] : ['black'],
					},
				},
				xaxis: {
					categories: labels,
					labels: {
						show: isShowLabel,
					},
				},
				grid: {
					yaxis: {
						lines: {
							show: false,
						},
					},
				},
				yaxis: {
					labels: {
						style: {
							fontSize: '12px',
							colors: colorMode == 'dark' ? ['white'] : ['black'],
						},
					},
				},

				tooltip: {
					y: {
						formatter: function (val) {
							return Intl.NumberFormat('en-US', {
								style: 'currency',
								currency: 'USD',
								useGrouping: false,
							}).format(Number(val))
						},
					},
				},
				plotOptions: {
					bar: {
						horizontal: false,
						borderRadius: 10,
						dataLabels: {
							position: 'top', // top, center, bottom,
						},
						distributed,
					},
				},
			}}
			series={[
				{
					name: '',
					data,
				},
			]}
			type="bar"
			width="100%"
			height={height}
		/>
	)
}
