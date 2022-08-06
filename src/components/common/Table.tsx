// ui component
import {
	Box,
	Checkbox,
	HStack,
	NumberDecrementStepper,
	NumberIncrementStepper,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	Text,
	useColorMode,
	VStack,
} from '@chakra-ui/react'

// react
import { forwardRef, memo, useEffect, useRef, useState } from 'react'

// hooks and funcs of react-table
import {
	Row,
	Cell,
	useTable,
	useSortBy,
	useFilters,
	useRowSelect,
	useFlexLayout,
	usePagination,
	useResizeColumns,
} from 'react-table'

// icons
import {
	MdOutlineNavigateNext,
	MdOutlineNavigateBefore,
	MdOutlineArrowBack,
	MdOutlineArrowForward,
} from 'react-icons/md'
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa'

// button icon
import { ButtonIcon } from './ButtonIcon'
import { ITable, TUseTable } from 'type/tableTypes'
import { Loading } from './Loading'

// create timeout variable to await client stop click to set data select
let selectTimeOut: NodeJS.Timeout

// use checkbox to select all or select one
const IndeterminateCheckbox = forwardRef(
	({ indeterminate, checked, handleIsSelected, disableId, ...rest }: any, ref: any) => {
		const defaultRef = useRef()
		const resolvedRef = ref || defaultRef

		useEffect(() => {
			resolvedRef.current.indeterminate = indeterminate
		}, [resolvedRef, indeterminate])

		return (
			<Box
				onClick={() => {
					clearTimeout(selectTimeOut)
					selectTimeOut = setTimeout(() => {
						handleIsSelected()
					}, 0)
				}}
			>
				<Checkbox
					colorScheme={'teal'}
					ref={resolvedRef}
					isChecked={checked}
					isIndeterminate={indeterminate}
					{...rest}
				/>
			</Box>
		)
	}
)

export const Table = memo(
	({
		columns,
		data,
		filter,
		isSelect = false,
		selectByColumn,
		setSelect,
		disableRows,
		isLoading = true,
		disableColumns,
		isResetFilter = false,
	}: ITable) => {
		const [isSelected, setIsSelected] = useState(false)

		// darkMode
		const { colorMode } = useColorMode()

		// use table hook of react table
		const {
			getTableBodyProps,
			getTableProps,
			headerGroups,
			prepareRow,
			page,
			state,
			gotoPage,
			canNextPage,
			canPreviousPage,
			nextPage,
			previousPage,
			pageCount,
			setPageSize,
			setFilter,
			selectedFlatRows,
			toggleAllPageRowsSelected,
			setAllFilters,
		}: TUseTable = useTable(
			{
				columns,
				data,
				initialState: {
					hiddenColumns: disableColumns ? disableColumns : [],
				},
			},
			useFlexLayout,
			useResizeColumns,
			useFilters,
			useSortBy,
			usePagination,
			useRowSelect,

			(hooks) => {
				if (isSelect) {
					hooks.visibleColumns.push((columns) => [
						{
							id: 'selection',
							disableResizing: true,
							width: 50,
							Header: ({ getToggleAllPageRowsSelectedProps }: any) => (
								<IndeterminateCheckbox
									{...getToggleAllPageRowsSelectedProps()}
									handleIsSelected={() => {
										setIsSelected(true)
									}}
								/>
							),
							Cell: ({ row }: any) => {
								if (disableRows?.values.includes(row.values[disableRows.column])) {
									return <Checkbox disabled />
								}
								return (
									<IndeterminateCheckbox
										{...row.getToggleRowSelectedProps()}
										handleIsSelected={() => setIsSelected(true)}
									/>
								)
							},
						},
						...columns,
					])
				} else {
					hooks.visibleColumns.push((columns) => columns)
				}
			}
		)

		// useEffect -------------------------------------
		// set filter
		useEffect(() => {
			if (filter?.columnId) {
				setFilter(filter.columnId, filter.filterValue)
			}
		}, [filter])

		// get all data when select
		useEffect(() => {
			if (isSelected) {
				let dataSelect = selectedFlatRows.filter((row: Row) => {
					if (!disableRows?.values?.includes(row.values[disableRows.column])) {
						return true
					}
					return false
				})

				dataSelect = dataSelect.map((row: Row) => {
					return row.values[String(selectByColumn)]
				})
				console.log(dataSelect)

				if (setSelect) setSelect(dataSelect)

				setIsSelected(false)
			}
		}, [isSelected])

		// when data reset
		useEffect(() => {
			toggleAllPageRowsSelected(false)
			// setIsSelected(true)
		}, [data])

		// reset filter
		useEffect(() => {
			if (isResetFilter) {
				setAllFilters([])
			}
		}, [isResetFilter])

		return (
			<Box overflow={'auto'} pos="relative">
				<Box userSelect={'none'} as="div" {...getTableProps()}>
					<Box position={'sticky'} top="0" as="div">
						{headerGroups.map((headerGroup: any) => (
							<Box
								as="div"
								borderBottomWidth={1}
								borderColor={colorMode == 'light' ? 'hu-Green.light' : 'gray.400'}
								alignItems={'center'}
								paddingBlock={'15px'}
								{...headerGroup.getHeaderGroupProps()}
							>
								{headerGroup.headers.map((column: any) => (
									<Box
										fontSize={'md'}
										color={
											colorMode == 'light' ? 'hu-GreenN.darkH' : '#FFFFFF90'
										}
										fontFamily={'"Montserrat", sans-serif'}
										fontWeight={'semibold'}
										as="div"
										pos={'relative'}
										paddingInline={'4'}
										{...column.getHeaderProps(column.getSortByToggleProps())}
									>
										<Box
											display={'flex'}
											alignItems={'center'}
											justifyContent={'space-between'}
										>
											{column.render('Header')}

											{column.canSort ? (
												column.isSorted ? (
													column.isSortedDesc ? (
														<FaSortDown />
													) : (
														<FaSortUp />
													)
												) : (
													<FaSort color="#83838350" />
												)
											) : (
												''
											)}
										</Box>
										{column.canResize && (
											<Box
												_hover={{
													background: 'hu-Green.normalH',
												}}
												_active={{
													background: 'hu-Green.normalA',
												}}
												borderRadius={'4'}
												pos={'absolute'}
												top="0"
												right={'0'}
												h="full"
												w={'5px'}
												background="hu-Green.normal"
												{...column.getResizerProps()}
											/>
										)}
									</Box>
								))}
							</Box>
						))}
					</Box>
					{data && data.length > 0 ? (
						<>
							<Box as="div" {...getTableBodyProps()}>
								{(page as Row<any>[]).map((row: Row) => {
									prepareRow(row)
									return (
										<Box
											borderBottomWidth={1}
											borderColor={
												colorMode == 'light' ? 'hu-Green.light' : 'gray.400'
											}
											alignItems={'center'}
											paddingBlock={'15px'}
											as="div"
											{...row.getRowProps()}
										>
											{row.cells.map((cell: Cell) => (
												<Box
													paddingInline={'4'}
													as="div"
													{...cell.getCellProps()}
												>
													{cell.render('Cell')}
												</Box>
											))}
										</Box>
									)
								})}
							</Box>
							<HStack
								paddingBlock={'15px'}
								borderBottomWidth={1}
								borderColor={colorMode == 'light' ? 'hu-Green.light' : 'gray.400'}
								paddingInline={'4'}
								justifyContent={'flex-end'}
								alignItems={'center'}
								spacing={5}
							>
								<Box as="span">
									Page{' '}
									<Box
										as="span"
										fontWeight={'semibold'}
										color={'hu-Green.normal'}
										fontSize={'xl'}
										paddingInline={'2'}
									>
										{state.pageIndex + 1}
									</Box>{' '}
									of {pageCount}
								</Box>
								<NumberInput
									onChange={(value) => {
										if (Number(value) == 0) return setPageSize(1)
										setPageSize(Number(value))
									}}
									defaultValue={10}
									min={5}
									step={5}
									max={50}
									maxW={'70px'}
								>
									<NumberInputField readOnly />
									<NumberInputStepper>
										<NumberIncrementStepper />
										<NumberDecrementStepper />
									</NumberInputStepper>
								</NumberInput>
							</HStack>

							<HStack
								paddingBlock={'15px'}
								paddingInline={'4'}
								justifyContent={'flex-end'}
								alignItems={'center'}
								spacing={5}
							>
								<ButtonIcon
									isDisabled={!canPreviousPage}
									handle={() => gotoPage(0)}
									ariaLabel={'first page'}
									icon={<MdOutlineArrowBack />}
								/>
								<ButtonIcon
									isDisabled={!canPreviousPage}
									handle={() => previousPage()}
									ariaLabel={'previous page'}
									icon={<MdOutlineNavigateBefore />}
								/>
								<ButtonIcon
									isDisabled={!canNextPage}
									handle={() => nextPage()}
									ariaLabel={'next page'}
									icon={<MdOutlineNavigateNext />}
								/>
								<ButtonIcon
									isDisabled={!canNextPage}
									handle={() => gotoPage(pageCount - 1)}
									ariaLabel={'last page'}
									icon={<MdOutlineArrowForward />}
								/>

								<NumberInput
									onChange={(value) => {
										if (Number(value) == 0) return gotoPage(0)
										gotoPage(Number(value) - 1)
									}}
									defaultValue={1}
									min={1}
									max={pageCount}
									maxW={'70px'}
								>
									<NumberInputField />
									<NumberInputStepper>
										<NumberIncrementStepper />
										<NumberDecrementStepper />
									</NumberInputStepper>
								</NumberInput>
							</HStack>
						</>
					) : (
						<Box>
							<iframe
								src="/assets/illustrators/empty.svg"
								style={{
									width: '100%',
									height: '300px',
									opacity: 0.5,
								}}
							></iframe>
							<VStack spacing={1} mt={'-40px'}>
								<Text fontWeight={'bold'} fontSize={'28px'} textAlign={'center'}>
									There's no any information
								</Text>
								<Text color={'gray'} textAlign={'center'}>
									Please, add new item or reload this page!
								</Text>
							</VStack>
						</Box>
					)}
				</Box>
				{isLoading && <Loading />}
			</Box>
		)
	}
)
