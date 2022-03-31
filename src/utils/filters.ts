import { Row } from 'react-table'

export const textFilter = (column: string) => {
	return (rows: Row[], id: string, filterValue: string) => {
		if (!filterValue) {
			return rows
		}
		return rows.filter((row) => {
			return String(row.values[column])
				.toUpperCase()
				.includes(String(filterValue).toUpperCase())
		})
	}
}

export const arrayFilter = (column: string) => {
	return (rows: Row[], id: string, filterValue: Array<any>) => {
		if (!filterValue) {
			return rows
		}
		return rows.filter((row) => {
			return filterValue.includes(row.values[column])
		})
	}
}
