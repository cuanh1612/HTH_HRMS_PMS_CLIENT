import dynamic from 'next/dynamic'
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface IChart {
    labels: string[],
    colors: string[],
    data: number[]
    height: number
}

export const Bar = ({labels, colors, data, height}: IChart) => {
	return (
		<Chart
			options={{
				dataLabels: {
					enabled: true,
					formatter: function (val) {
						return Intl.NumberFormat('en-US', {
							style: 'currency',
							currency: 'USD',
							useGrouping: false,
						}).format(Number(val))
					},
					offsetY: -20,
					style: {
						fontSize: '12px',
						colors: colors,
					},
				},
				colors: ['#00A991', '#FFAAA7'],
				stroke: {
					show: true,
					curve: 'smooth',
					lineCap: 'butt',
					width: 0,
					dashArray: 0,
				},
				xaxis: {
					categories: labels,
					labels: {
						show: false,
					},
				},
                grid: {
                    yaxis: {
                        lines: {
                            show: false
                        }
                    }
                },
				yaxis: {
					labels: {
						style: {
							fontSize: '12px',
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
						distributed: true,
					},
				},
			}}
			series={[
				{
					data
				},
			]}
			type="bar"
			width="100%"
			height={height}
		/>
	)
}
