import {
	Box,
	HStack,
	Input,
	NumberDecrementStepper,
	NumberIncrementStepper,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
} from '@chakra-ui/react'
import { AuthContext } from 'contexts/AuthContext'
import { useContext, useEffect, useMemo } from 'react'
import {
	useTable,
	useFlexLayout,
	useResizeColumns,
	Cell,
	Row,
	usePagination,
	UsePaginationInstanceProps,
	useSortBy,
	UseSortByInstanceProps,
	Column,
	UseSortByOptions,
	UsePaginationOptions,
	useFilters,
	UseFiltersInstanceProps,
	UseFiltersOptions,
} from 'react-table'
import {
	MdOutlineNavigateNext,
	MdOutlineNavigateBefore,
	MdOutlineArrowBack,
	MdOutlineArrowForward,
} from 'react-icons/md'
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa'
import ButtonIcon from 'components/ButtonIcon'

export default function table() {
	const { isAuthenticated, handleLoading } = useContext(AuthContext)

	const data = useMemo(
		() => [
			{
				col1: 'Hellđo3',
				col2: '1',
				col3: 'hello',
				col4: 'hello2',
			},
			{
				col1: 'hello3',
				col2: '3',
				col3: 'hello',
				col4: 'hello2',
			},
			{
				col1: 'hello4',
				col2: '2',
				col3: 'hello',
				col4: 'hello2',
			},
		],
		[]
	)

	const columns = useMemo<
		(Column<any> & UseSortByOptions<any> & UsePaginationOptions<any> & UseFiltersOptions<any>)[]
	>(
		() => [
			{
				Header: 'Table 1',
				columns: [
					{
						Header: 'Username',
						accessor: 'col1',
						disableSortBy: true,
						minWidth: 100,
					},
					{
						Header: 'Password',
						accessor: 'col2',
					},
					{
						Header: 'Username',
						accessor: 'col3',
					},
					{
						Header: 'Password',
						accessor: 'col4',
					},
				],
			},
		],
		[]
	)

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
		columns: dd,
	}: any &
		Partial<UsePaginationInstanceProps<any>> &
		Partial<UseSortByInstanceProps<any> & Partial<UseFiltersInstanceProps<any>>> = useTable(
		{ columns, data },
		useFlexLayout,
		useResizeColumns,
		useFilters,
		useSortBy,
		usePagination
	)

	useEffect(() => {
		if (isAuthenticated) {
			handleLoading(false)
		}
	}, [isAuthenticated])

	return (

			<Box userSelect={'none'} as="div" {...getTableProps()}>
				<Box background={'white'} position={'sticky'} top="0" as="div">
					{headerGroups.map((headerGroup: any) => (
						<Box
							as="div"
							borderBottomWidth={1}
							borderColor="hu-Green.light"
							alignItems={'center'}
							paddingBlock={'15px'}
							{...headerGroup.getHeaderGroupProps()}
						>
							{headerGroup.headers.map((column: any) => (
								<Box
									fontSize={'md'}
									color="hu-GreenN.darkH"
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

										{column.isSorted ? (
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
				<Box as="div" {...getTableBodyProps()}>
					{(page as Row<any>[]).map((row: Row) => {
						prepareRow(row)
						return (
							<Box
								borderBottomWidth={1}
								borderColor="hu-Green.light"
								alignItems={'center'}
								paddingBlock={'15px'}
								as="div"
								{...row.getRowProps()}
							>
								{row.cells.map((cell: Cell) => (
									<Box paddingInline={'4'} as="div" {...cell.getCellProps()}>
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
					borderColor="hu-Green.light"
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
			</Box>
	)
}
