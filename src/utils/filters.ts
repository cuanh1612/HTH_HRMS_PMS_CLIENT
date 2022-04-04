import { Row } from 'react-table'

const getData = (columns: string[], row: Row)=> {
	let data = Object(row.original)
	columns.map(item=> {
		data = data[item]
	})
	return data
}

export const textFilter = (columns: string[]) => {
	return (rows: Row[], id: string, filterValue: string) => {
		if (!filterValue) {
			return rows
		}
		
		return rows.filter((row) => {
			const data = getData(columns, row)
			console.log(data)
			return String(data)
				.toUpperCase()
				.includes(String(filterValue).toUpperCase())
		})
	}
}

export const selectFilter = (columns: string[]) => {
	return (rows: Row[], id: string, filterValue: string) => {
		if (!filterValue) {
			return rows
		}
		return rows.filter((row) => {
			const data = getData(columns, row)
			return data == filterValue
		})
	}
}

export const arrayFilter = (columns: string[]) => {
	return (rows: Row[], id: string, filterValue: Array<any>) => {
		if (!filterValue) {
			return rows
		}
		return rows.filter((row) => {
			const data = getData(columns, row)
			return filterValue.includes(data)
		})
	}
}
