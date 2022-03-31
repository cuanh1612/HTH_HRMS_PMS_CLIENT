import { ClientLayout } from 'components/layouts'
import Table from 'components/Table'
import { AuthContext } from 'contexts/AuthContext'
import { useCallback, useContext, useEffect, useState } from 'react'
import { NextLayout } from 'type/element/layout'
import { IFilter, TColumn } from 'type/tableTypes'
import { arrayFilter, textFilter } from 'utils/filters'

const table: NextLayout = ()=> {
	const { handleLoading, isAuthenticated } = useContext(AuthContext)
	useEffect(() => {
		if (isAuthenticated) {
			handleLoading(false)
		}
	}, [isAuthenticated])

	// data------------------------------------
	const [data, setData] = useState([
		{
			col1: '2',
			col2: '1111',
			col3: '2',
		},
		{
			col1: '4',
			col2: '1111',
			col3: '3',
		},
	])

	// header ----------------------------------------
	const columns: TColumn[] = [
		{
			Header: 'Table 1',

			columns: [
				{
					Header: 'Username',
					accessor: 'col1',
					disableSortBy: true,
					filter: textFilter('col1'),
					minWidth: 100,
				},
				{
					Header: 'Password',
					accessor: 'col2',
				},
				{
					Header: 'Username',
					accessor: 'col3',
					filter: arrayFilter('col3'),
				},
				{
					Header: 'Password',
					accessor: 'col4',
				},
			],
		},
	]

	// set filter
	const [filter, setFilter] = useState<IFilter>({
		columnId: '',
		filterValue: '',
	})

	// get data select
	const [dataSelect, setDataSelect] = useState<Array<string>>([])

	const setSelect = useCallback((data: Array<string>) => setDataSelect(data), [])

	return (
		<>
			<Table
				filter={filter}
				data={data}
				isSelect
				columns={columns}
				selectByColumn={'col1'}
				setSelect={setSelect}
			/>
		</>
	)
}

table.getLayout = ClientLayout

export default table
