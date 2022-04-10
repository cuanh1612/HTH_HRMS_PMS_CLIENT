import { Row } from 'react-table'

const getData = (columns: string[], row: Row) => {
	let data = Object(row.original)
	columns.map((item) => {
		if (data[item]) {
			data = data[item]
		}
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
			return String(data).toUpperCase().includes(String(filterValue).toUpperCase())
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

export const dateFilter = (columns: string[]) => {
	return (
		rows: Row[],
		id: string,
		filterValue: {
			from: Date
			to: Date
		}
	) => {
		if (!filterValue) {
			return rows
		}
		const from = filterValue.from
		const to = filterValue.to
		return rows.filter((row) => {
			const data = getData(columns, row)
			const currentDate = new Date(data)

			if (!filterValue.from && !filterValue.to) return true
			if (filterValue.from && filterValue.to) {
				if (from <= currentDate && currentDate <= to) return true
			}
			if (filterValue.from && !filterValue.to) {
				if (from <= currentDate && currentDate <= new Date()) return true
			}
			if (!filterValue.from && filterValue.to) {
				if (currentDate <= to) return true
			}
			return false
		})
	}
}

export const yearFilter = (columns: string[]) => {
	return (rows: Row[], id: string, filterValue: number) => {
		if (!filterValue) {
			return rows
		}
		return rows.filter((row) => {
			const data = getData(columns, row)
			const year = new Date(data).getFullYear()
			if (filterValue == year) return true

			return false
		})
	}
}
