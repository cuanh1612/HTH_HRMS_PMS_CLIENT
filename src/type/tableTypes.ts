import {
	Column,
	UseFiltersInstanceProps,
	UseFiltersOptions,
	UsePaginationInstanceProps,
	UsePaginationOptions,
	UseRowSelectInstanceProps,
	UseRowSelectOptions,
	UseSortByInstanceProps,
	UseSortByOptions,
} from 'react-table'

export type TColumn = Column<any> &
	UseSortByOptions<any> &
	UsePaginationOptions<any> &
	UseFiltersOptions<any> &
	UseRowSelectOptions<any> & {
		[index: string]: any
	}

export interface IHeaderTb {
	title: string
	data: TColumn[]
}

export type TUseTable = Partial<
	UseSortByInstanceProps<any> &
		UseFiltersInstanceProps<any> &
		UseRowSelectInstanceProps<any> &
		UsePaginationInstanceProps<any>
> & any

export interface IFilter {
    columnId: string,
    filterValue: any
}

export interface ITable {
	columns: TColumn[]
	data: Array<any>
    filter?: IFilter
	isSelect?: boolean
	selectByColumn?: string
	setSelect?: any
	disableIds?: number[] | null
	isLoading?: boolean
	disableColumns?: string[]
	isResetFilter?: boolean
}