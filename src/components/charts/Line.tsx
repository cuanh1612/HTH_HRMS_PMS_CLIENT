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
				legend: {
					show: false,
				},
			}}
		/>
	)
}
