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
import { CaretSortIcon } from "@radix-ui/react-icons";
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

const DishesContext = createContext<{
  setStateTakeOut: (value: string) => void;
  stateTakeOut: string;
  setStateDelivered: (value: string) => void;
  stateDelivered: string;
}>({
  setStateTakeOut: () => {}, // Placeholder function
  stateTakeOut: "", // Default boolean value
  setStateDelivered: () => {}, // Placeholder function
  stateDelivered: "", // Default boolean value
});

export const columns: ColumnDef<DishesType>[] = [
  {
    accessorKey: "iD",
    header: "ID",
    cell: ({ row }) => <div>{row.original.id}</div>, // Display ID
  },
  {
    accessorKey: "dishes",
    header: "Dishes",
    cell: ({ row }) => <div>{row.original.nameFood}</div>,
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ row }) => <div>{row.original.quantity}</div>,
  },
  {
    accessorKey: "tableNumber",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          TableNumber
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="flex justify-center">{row.getValue("tableNumber")}</div>
    ),
  },
  {
    accessorKey: "nameCustomer",
    header: "NameCustomer",
    cell: ({ row }) => <div>{row.original.nameCustomer}</div>,
  },
  {
    accessorKey: "foodDetail",
    header: "FoodDetail",
    cell: ({ row }) => <div>{row.original.foodDetail}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: function Status({ row }) {
      const StateFood = row.original.status;
      return StateFood && StateFood === "pending" ? (
        <div style={{ color: "#ECA20E" }}>{StateFood}</div>
      ) : (
        <div style={{ color: "#52D017" }}>{StateFood}</div>
      );
    },
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: function Actions({ row }) {
      const {
        setStateTakeOut,
        setStateDelivered,
        stateTakeOut,
        stateDelivered,
      } = useContext(DishesContext);
      //check id hien tai co bang id trong state
      const isTakeOut = stateTakeOut === row.original.id;
      const isDelivered = stateDelivered === row.original.id;
      const onClickTakeOut = () => {
        setStateTakeOut(row.original.id);
        alert("yeah lay r nhe");
      };
      const onClickDelievery = () => {
        setStateDelivered(row.original.id);
        alert("yeah Giao r nhe");
      };
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div onClick={!isTakeOut ? onClickTakeOut : undefined}>
            <Button
              variant="outline"
              disabled={isTakeOut}
              className={isTakeOut ? "opacity-70" : ""}
            >
              Take-out
            </Button>
          </div>
          <div onClick={!isDelivered ? onClickDelievery : undefined}>
            <Button
              variant="outline"
              disabled={isDelivered}
              className={isDelivered ? "opacity-70" : ""}
            >
              Delivered
            </Button>
          </div>
        </div>
      );
    },
  },
];

const PAGE_SIZE = 10;
export default function StaffTrackingDishes() {
  const DishTest = [
    {
      id: "1",
      nameFood: "Phở bò",
      quantity: 2,
      nameCustomer: "Nguyễn Văn A",
      tableNumber: 5,
      foodDetail: "Ít cay, thêm hành",
      status: "ordered",
    },
    {
      id: "2",
      nameFood: "Bún chả",
      quantity: 1,
      nameCustomer: "Trần Thị B",
      tableNumber: 3,
      foodDetail: "Nước mắm chua ngọt",
      status: "delivered",
    },
    {
      id: "3",
      nameFood: "Cơm tấm",
      quantity: 3,
      nameCustomer: "Lê Văn C",
      tableNumber: 1,
      foodDetail: "Thêm trứng ốp la",
      status: "preparing",
    },
    {
      id: "4",
      nameFood: "Bánh mì",
      quantity: 2,
      nameCustomer: "Phạm Thị D",
      tableNumber: 7,
      foodDetail: "Thêm pate và rau sống",
      status: "ordered",
    },
    {
      id: "5",
      nameFood: "Gỏi cuốn",
      quantity: 4,
      nameCustomer: "Đỗ Văn E",
      tableNumber: 2,
      foodDetail: "Chấm với nước mắm",
      status: "delivered",
    },
    {
      id: "6",
      nameFood: "Chả giò",
      quantity: 6,
      nameCustomer: "Hoàng Thị F",
      tableNumber: 8,
      foodDetail: "Giòn rụm, thơm ngon",
      status: "preparing",
    },
    {
      id: "7",
      nameFood: "Bánh cuốn",
      quantity: 3,
      nameCustomer: "Trịnh Văn G",
      tableNumber: 4,
      foodDetail: "Thêm chả lụa và rau thơm",
      status: "ordered",
    },
    {
      id: "8",
      nameFood: "Hủ tiếu",
      quantity: 1,
      nameCustomer: "Vũ Thị H",
      tableNumber: 6,
      foodDetail: "Không quá cay",
      status: "cancelled",
    },
    {
      id: "9",
      nameFood: "Bún bò Huế",
      quantity: 2,
      nameCustomer: "Nguyễn Thị I",
      tableNumber: 9,
      foodDetail: "Chua cay vừa phải",
      status: "delivered",
    },
    {
      id: "10",
      nameFood: "Mì Quảng",
      quantity: 5,
      nameCustomer: "Lê Thị J",
      tableNumber: 10,
      foodDetail: "Thêm đậu phộng và rau sống",
      status: "ordered",
    },
  ];

  const [stateTakeOut, setStateTakeOut] = useState<string>("");
  const [stateDelivered, setStateDelivered] = useState<string>("");
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
    data: DishTest, // Pass data here
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

  useEffect(() => {
    table.setPagination({
      pageIndex,
      pageSize: PAGE_SIZE,
    });
  }, [pageIndex, table]);

  const onClickPaginateNumber = (pageNum: number) => {
    setPagination({
      pageIndex: pageNum,
      pageSize: PAGE_SIZE,
    });
  };
  return (
    <>
      <DishesContext.Provider
        value={{
          setStateTakeOut,
          stateTakeOut: stateTakeOut,
          setStateDelivered,
          stateDelivered: stateDelivered,
        }}
      >
        <div className="w-full">
          <div className="flex items-center py-4">
            <Input
              placeholder="Filter Dishes..."
              value={
                (table.getColumn("dishes")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("dishes")?.setFilterValue(event.target.value)
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
              <strong>{DishTest.length}</strong> kết quả
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
      </DishesContext.Provider>
    </>
  );
}
