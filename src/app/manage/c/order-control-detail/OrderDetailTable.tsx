"use client";
import AutoPagination from "@/components/auto-pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DishesType } from "@/schemaValidations/dishes.schema";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { useSearchParams } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

const TableOrderDetail = createContext<{
  TableOrderDetailStatus: string;
  SetTableOrderDetailStatus: (value: string) => void;
}>({
  TableOrderDetailStatus: "",
  SetTableOrderDetailStatus: () => {},
});

export const columns: ColumnDef<DishesType>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div>{row.original.id}</div>, // Display ID
  },
  {
    accessorKey: "nameFood",
    header: "NameFood",
    cell: ({ row }) => <div>{row.original.nameFood}</div>,
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ row }) => <div>{row.original.quantity}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <div>{row.original.status}</div>,
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: function Actions({ row }) {
      const { TableOrderDetailStatus, SetTableOrderDetailStatus } =
        useContext(TableOrderDetail);
      //check id hien tai co bang id trong state
      const isTakeOut = TableOrderDetailStatus === row.original.id;
      const onClickFished = () => {
        SetTableOrderDetailStatus(row.original.id);
      };

      return (
        <div onClick={!isTakeOut ? onClickFished : undefined}>
          <Button
            variant="outline"
            disabled={isTakeOut}
            className={isTakeOut ? "opacity-50 text-[#0FA501]" : ""}
          >
            Finished
          </Button>
        </div>
      );
    },
  },
];

const PAGE_SIZE = 10;
export default function OrderDetailTable() {
  const dataTest = [
    {
      id: "dish-12",
      nameFood: "Vegetable Stir Fry",
      quantity: 1,
      nameCustomer: "Sophia Johnson",
      tableNumber: 5,
      foodDetail: "Vegetables stir fried with soy sauce",
      status: "Prepared",
    },
    {
      id: "dish-13",
      nameFood: "Spring Rolls",
      quantity: 1,
      nameCustomer: "Sophia Johnson",
      tableNumber: 5,
      foodDetail: "Vegetables wrapped in rice paper",
      status: "In Progress",
    },
    {
      id: "dish-14",
      nameFood: "Chicken Alfredo",
      quantity: 2,
      nameCustomer: "James Smith",
      tableNumber: 8,
      foodDetail: "Creamy Alfredo pasta with grilled chicken",
      status: "Prepared",
    },
    {
      id: "dish-15",
      nameFood: "Beef Tacos",
      quantity: 3,
      nameCustomer: "Maria Garcia",
      tableNumber: 2,
      foodDetail: "Beef, lettuce, and cheese in soft taco shells",
      status: "In Progress",
    },
    {
      id: "dish-16",
      nameFood: "Grilled Salmon",
      quantity: 1,
      nameCustomer: "David Lee",
      tableNumber: 7,
      foodDetail: "Salmon fillet grilled with lemon and herbs",
      status: "Pending",
    },
    {
      id: "dish-17",
      nameFood: "Cheese Pizza",
      quantity: 4,
      nameCustomer: "Anna Brown",
      tableNumber: 3,
      foodDetail: "Pizza topped with mozzarella cheese and marinara sauce",
      status: "Prepared",
    },
    {
      id: "dish-18",
      nameFood: "Pasta Primavera",
      quantity: 2,
      nameCustomer: "Michael Clark",
      tableNumber: 10,
      foodDetail: "Pasta with a mix of fresh vegetables",
      status: "Prepared",
    },
    {
      id: "dish-19",
      nameFood: "Lobster Roll",
      quantity: 1,
      nameCustomer: "Ella White",
      tableNumber: 6,
      foodDetail: "Lobster meat with mayo in a soft bun",
      status: "In Progress",
    },
    {
      id: "dish-20",
      nameFood: "Buffalo Wings",
      quantity: 5,
      nameCustomer: "Chris Wilson",
      tableNumber: 4,
      foodDetail: "Spicy buffalo chicken wings with dipping sauce",
      status: "Prepared",
    },
    {
      id: "dish-21",
      nameFood: "Eggplant Parmesan",
      quantity: 2,
      nameCustomer: "Olivia Davis",
      tableNumber: 9,
      foodDetail: "Breaded eggplant with marinara and mozzarella cheese",
      status: "Pending",
    },
  ];

  const [TableOrderDetailStatus, SetTableOrderDetailStatus] =
    useState<string>("");
  const searchParam = useSearchParams();
  const page = searchParam.get("page") ? Number(searchParam.get("page")) : 1;
  const pageIndex = page - 1;
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex,
    pageSize: PAGE_SIZE,
  });

  const table = useReactTable({
    data: dataTest, // Pass data here
    columns,

    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    autoResetPageIndex: false,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });
  const onClickPaginateNumber = (pageNum: number) => {
    setPagination({
      pageIndex: pageNum,
      pageSize: PAGE_SIZE,
    });
  };

  useEffect(() => {
    table.setPagination({
      pageIndex,
      pageSize: PAGE_SIZE,
    });
  }, [pageIndex, table]);

  return (
    <>
      <TableOrderDetail.Provider
        value={{
          TableOrderDetailStatus,
          SetTableOrderDetailStatus: SetTableOrderDetailStatus,
        }}
      >
        <div className="w-full">
          <div className="flex items-center py-4">
            <Input
              placeholder="Filter Name..."
              value={
                (table.getColumn("nameFood")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("nameFood")?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="text-xs text-muted-foreground py-4 flex-1 ">
              Hiển thị{" "}
              <strong>{table.getPaginationRowModel().rows.length}</strong> trong{" "}
              <strong>{dataTest.length}</strong> kết quả
            </div>
            <div>
              <AutoPagination
                page={table.getState().pagination.pageIndex}
                limit={table.getPageCount()}
                pathname="/manage/a/permissions"
                tableNext={table.nextPage}
                tablePre={table.previousPage}
                paginateNumber={onClickPaginateNumber}
              />
            </div>
          </div>
        </div>
      </TableOrderDetail.Provider>
    </>
  );
}
