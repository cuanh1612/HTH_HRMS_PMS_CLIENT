import dynamic from 'next/dynamic'
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface IChart {
    colors?: string[],
    data: {
        name: string
        data: number[]
    }[]
    height: number
    labels: number[]
}

export const Area = ({height, data, colors, labels}: IChart) => {
	return (
		
		<Chart
			width={'100%'}
			height={height}
			type={'area'}
			options={{
				colors,
				dataLabels: {
					enabled: false,
				},
				stroke: {
					curve: 'smooth',
				},
				xaxis: {
					type: 'category',
					categories: labels,
				},
				grid: {
					yaxis: {
						lines: {
							show: false,
						},
					},
				},
			}}
			series={data}
		/>
	)
}
