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
import { TypeOrderCheffSchema } from "@/schemaValidations/orders.chema";
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
import { useRouter, useSearchParams } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

const DoOrderStatus = createContext<{
  OrderStatus: string;
  SetOrderStatus: (value: string) => void;
  ListOrderDishes: Array<DishesType>;
  SetListOrderDishes: (value: Array<DishesType>) => void;
}>({
  OrderStatus: "",
  SetOrderStatus: () => {},
  ListOrderDishes: [],
  SetListOrderDishes: () => [],
});

export const columns: ColumnDef<TypeOrderCheffSchema>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div>{row.original.id}</div>, // Display ID
  },
  {
    accessorKey: "customerName",
    header: "CustomerName",
    cell: ({ row }) => <div>{row.original.customerName}</div>,
  },
  {
    accessorKey: "ofTable",
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
      <div className="lowercase">{row.getValue("ofTable")}</div>
    ),
  },
  {
    accessorKey: "createAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          CreateAt
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("createAt")}</div>
    ),
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: function Actions({ row }) {
      const router = useRouter();
      const { OrderStatus, SetOrderStatus } = useContext(DoOrderStatus);
      //check id hien tai co bang id trong state
      const isTakeOut = OrderStatus === row.original.id;
      const onClickFished = () => {
        SetOrderStatus(row.original.id);
      };

      const onClickViewOrderDetail = () => {
        router.push("order-control-detail");
      };

      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div onClick={onClickViewOrderDetail}>
            <Button variant="outline">Detail</Button>
          </div>
          <div onClick={!isTakeOut ? onClickFished : undefined}>
            <Button
              variant="outline"
              disabled={isTakeOut}
              className={isTakeOut ? "opacity-50 text-[#0FA501]" : ""}
            >
              Finished
            </Button>
          </div>
        </div>
      );
    },
  },
];

const PAGE_SIZE = 10;
export default function ChefOrderControl() {
  const DataTest = [
    {
      id: "13d38207-da82-4b7d-9673-58b65ecb3449",
      customerName: "Gail Baker",
      ofTable: 45,
      createAt: "2025-01-10T22:12:51",
      listDishes: [
        {
          id: "dish-1",
          nameFood: "Pizza Margherita",
          quantity: 1,
          nameCustomer: "Gail Baker",
          tableNumber: 45,
          foodDetail: "Tomato, mozzarella, basil",
          status: "Ordered",
        },
        {
          id: "dish-2",
          nameFood: "Caesar Salad",
          quantity: 1,
          nameCustomer: "Gail Baker",
          tableNumber: 45,
          foodDetail: "Lettuce, croutons, Caesar dressing",
          status: "Prepared",
        },
      ],
    },
    {
      id: "f5357ddd-ae0a-4f47-87ec-480384a7d9fc",
      customerName: "Tiffany Edwards",
      ofTable: 10,
      createAt: "2025-01-14T21:37:08",
      listDishes: [
        {
          id: "dish-3",
          nameFood: "Spaghetti Carbonara",
          quantity: 1,
          nameCustomer: "Tiffany Edwards",
          tableNumber: 10,
          foodDetail: "Pasta, eggs, pancetta, parmesan",
          status: "In Progress",
        },
      ],
    },
    {
      id: "8249ac18-e606-4c05-b23b-c34c3a45cfde",
      customerName: "Laura Webb",
      ofTable: 23,
      createAt: "2025-01-22T05:55:12",
      listDishes: [
        {
          id: "dish-4",
          nameFood: "Grilled Chicken",
          quantity: 1,
          nameCustomer: "Laura Webb",
          tableNumber: 23,
          foodDetail: "Chicken breast, grilled vegetables",
          status: "Served",
        },
        {
          id: "dish-5",
          nameFood: "French Fries",
          quantity: 1,
          nameCustomer: "Laura Webb",
          tableNumber: 23,
          foodDetail: "Potatoes, fried",
          status: "Served",
        },
      ],
    },
    {
      id: "2b9c5e29-2f97-4c69-b1b2-3308f6c61a23",
      customerName: "Emily Rodriguez",
      ofTable: 12,
      createAt: "2025-02-01T08:25:30",
      listDishes: [
        {
          id: "dish-6",
          nameFood: "Burger and Fries",
          quantity: 1,
          nameCustomer: "Emily Rodriguez",
          tableNumber: 12,
          foodDetail: "Beef patty, lettuce, tomato, fries",
          status: "Ordered",
        },
        {
          id: "dish-7",
          nameFood: "Coke",
          quantity: 1,
          nameCustomer: "Emily Rodriguez",
          tableNumber: 12,
          foodDetail: "Carbonated drink",
          status: "In Progress",
        },
      ],
    },
    {
      id: "5abf4b7e-d2f2-431b-b0db-cf343b907812",
      customerName: "John Smith",
      ofTable: 8,
      createAt: "2025-02-03T18:14:55",
      listDishes: [
        {
          id: "dish-8",
          nameFood: "Chicken Caesar Salad",
          quantity: 1,
          nameCustomer: "John Smith",
          tableNumber: 8,
          foodDetail: "Chicken, lettuce, Caesar dressing",
          status: "Served",
        },
      ],
    },
    {
      id: "953b8e8e-10da-4677-86ac-97e2c0f2cf4a",
      customerName: "James Lee",
      ofTable: 16,
      createAt: "2025-01-15T14:30:45",
      listDishes: [
        {
          id: "dish-9",
          nameFood: "Pasta Alfredo",
          quantity: 1,
          nameCustomer: "James Lee",
          tableNumber: 16,
          foodDetail: "Creamy sauce, pasta",
          status: "Prepared",
        },
        {
          id: "dish-10",
          nameFood: "Garlic Bread",
          quantity: 1,
          nameCustomer: "James Lee",
          tableNumber: 16,
          foodDetail: "Bread with garlic butter",
          status: "In Progress",
        },
      ],
    },
    {
      id: "aa3b5e0a-c20d-4ad3-b1b3-e94b7428ed5f",
      customerName: "Sara Watson",
      ofTable: 28,
      createAt: "2025-02-05T19:01:25",
      listDishes: [
        {
          id: "dish-11",
          nameFood: "Fish and Chips",
          quantity: 1,
          nameCustomer: "Sara Watson",
          tableNumber: 28,
          foodDetail: "Fish fillet, fried potatoes",
          status: "Served",
        },
      ],
    },
    {
      id: "a77d8c7d-9f23-47d4-8281-3f1b9b53f5ba",
      customerName: "Sophia Johnson",
      ofTable: 5,
      createAt: "2025-02-02T11:25:12",
      listDishes: [
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
      ],
    },
    {
      id: "b98f8e2f-c697-44e6-90d7-459f91bb9b2f",
      customerName: "Michael Brown",
      ofTable: 18,
      createAt: "2025-01-25T16:44:09",
      listDishes: [
        {
          id: "dish-14",
          nameFood: "Tacos",
          quantity: 1,
          nameCustomer: "Michael Brown",
          tableNumber: 18,
          foodDetail: "Ground beef, lettuce, cheese, salsa",
          status: "Ordered",
        },
        {
          id: "dish-15",
          nameFood: "Margarita",
          quantity: 1,
          nameCustomer: "Michael Brown",
          tableNumber: 18,
          foodDetail: "Lime, tequila, salt",
          status: "Served",
        },
      ],
    },
  ];

  const [ListOrderDishes, SetListOrderDishes] = useState<Array<DishesType>>([]);
  const [DataTable, setDataTable] =
    useState<Array<TypeOrderCheffSchema>>(DataTest);
  const [OrderStatus, setStateOrder] = useState<string>("");
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
    data: DataTable, // Pass data here
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

  useEffect(() => {
    const onClickFished = () => {
      const dataFilter = DataTest.filter((data) => data.id !== OrderStatus);
      console.log("data", dataFilter);
      setDataTable(dataFilter);
    };
    onClickFished;
  }, [OrderStatus]);

  const handleViewDetail = (listDishes: Array<DishesType>) => {
    // console.log("data",listDishes)
    SetListOrderDishes(listDishes);
    // router.push(`/cheff/order-control-detail`);
  };

  return (
    <>
      <DoOrderStatus.Provider
        value={{
          OrderStatus,
          SetOrderStatus: setStateOrder,
          ListOrderDishes,
          SetListOrderDishes: SetListOrderDishes,
        }}
      >
        <div className="w-full">
          <div className="flex items-center py-4">
            <Input
              placeholder="Filter Name..."
              value={
                (table.getColumn("customerName")?.getFilterValue() as string) ??
                ""
              }
              onChange={(event) =>
                table
                  .getColumn("customerName")
                  ?.setFilterValue(event.target.value)
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
                      onClick={() => handleViewDetail(row.original.listDishes)}
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
              <strong>{DataTest.length}</strong> kết quả
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
      </DoOrderStatus.Provider>
    </>
  );
}
