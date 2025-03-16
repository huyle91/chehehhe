"use client";

import AutoPagination from "@/components/auto-pagination";

import { useAppContext } from "@/components/app-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { toast } from "@/components/ui/use-toast";
import GetDatetime from "@/helper/GetDatetime";
import { useDebounce } from "@/hooks/useDebounce";
import { useGetDishFollowRestaurant } from "@/queries/useDish";
import { useUpdateDishRestaurantMutation } from "@/queries/useDishRestaurant";
import { DishFollowRestaurantItemsType } from "@/schemaValidations/dish.schema";
import { CaretSortIcon } from "@radix-ui/react-icons";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { useRouter, useSearchParams } from "next/navigation";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CheffDishContext = createContext<{
  UpdateStock: boolean;
  setUpdateStock: (values: boolean) => void;
}>({
  UpdateStock: false,
  setUpdateStock: () => { },
});

export const columns: ColumnDef<DishFollowRestaurantItemsType>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div>{row.original.name}</div>, // Display name
  },
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => (
      <div>
        <Avatar className="aspect-square w-[100px] h-[100px] rounded-md object-cover">
          <AvatarImage src={row.getValue("image")} />
          <AvatarFallback className="rounded-none">
            {row.original.image}
          </AvatarFallback>
        </Avatar>
      </div>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => <div>{row.original.description}</div>,
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => <div>{row.original.category.name}</div>,
  },
  {
    accessorKey: "createdAt",
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
    cell: ({ row }) => {
      const getTimes = new Date(row.original.createdAt).toLocaleString(
        "vi-VN",
        {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false, // Định dạng 24h
        }
      );

      // console.log("getDate",getMinutes)
      return <div className="lowercase">{getTimes}</div>;
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          UpdateAt
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="lowercase">{GetDatetime(row.original.updatedAt)}</div>
      );
    },
  },
  {
    accessorKey: "isActived",
    header: "Is Stock",
    cell: function Actions({ row }) {
      const { setUpdateStock } = useContext(CheffDishContext);
      const { restaurant } = useAppContext();

      const updateStock = useUpdateDishRestaurantMutation()
      const handleChangeStock = async () => {
        try {
          const dataUpdateStock = {
            idResDish: row.original.restaurantDishId,
            restaurant: restaurant?._id,
            dish: row.original._id,
            price: row.original.price ?? 0,
            isActived: !row.original.isActived,
          };
          const resupdateStock = await updateStock.mutateAsync(dataUpdateStock);
          // console.log("dataDelte", permissionDelete);
          if (resupdateStock && resupdateStock.payload) {
            setUpdateStock(true);
            toast({
              description: "stock is updated",
              duration: 1200,

            });
          } else {
            toast({
              description: "Update stock is not successfull",
              duration: 1200,
              variant: "destructive",
            });
          }
        } catch (error) {
          console.log("error", error);
          toast({
            description: "error at Update Stock dish",
            duration: 1200,
            variant: "destructive",
          });
        }
      };

      return (
        <>
          <div className="flex gap-2">
            <Button
              variant={row.original.isActived ? "success" : "destructive"}
              size="sm"
              onClick={() => handleChangeStock()}
            >
              {row.original.isActived ? "In stock" : "Out of stock"}
            </Button>
          </div>
        </>
      );
    },
  },
];

const PAGE_SIZE = 10;
export default function RawMaterialTable() {
  const router = useRouter();
  const searchParam = useSearchParams();
  const page = searchParam.get("page") ? Number(searchParam.get("page")) : 1;
  const sortParam = searchParam.get("sort");
  const filterParam = searchParam.get("filter");

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: page,
    pageSize: PAGE_SIZE,
  });

  const [isUpdateStock, setIsUpdateStock] = useState<boolean>(false);
  const { restaurant } = useAppContext();
  const defaultData = useMemo(() => [], []);
  const [sorting, setSorting] = useState<SortingState>(
    sortParam
      ? [
        {
          id: sortParam.startsWith("-") ? sortParam.slice(1) : sortParam,
          desc: sortParam.startsWith("-"),
        },
      ]
      : []
  );

  const [searchTerm, setSearchTerm] = useState(filterParam || "");
  const debouncedSearchTerm = useDebounce(searchTerm);

  const { data, refetch, isLoading, isSuccess } = useGetDishFollowRestaurant(
    pagination.pageIndex,
    pagination.pageSize,
    restaurant?._id,
    {
      // If Filtername is set, pass it as a filter query parameter
      filter: filterParam
        ? `filter=${encodeURIComponent(JSON.stringify({ name: { $regex: filterParam, $options: "i" } }))}`
        : "",

      // Dynamic sorting
      sort:
        sorting.length > 0
          ? sorting[0].desc
            ? `-${sorting[0].id}`
            : sorting[0].id
          : "createdAt", // Default sort by createdAt if no sorting is applied
    }
  );

  // console.log('data',data?.result[0].isActived)
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: data?.result ?? defaultData,
    columns,
    rowCount: data?.meta.total ?? 0,
    state: {
      pagination,
      rowSelection,
      sorting,
      columnFilters,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    manualPagination: true,
    debugTable: true,
  });

  const onClickPaginateNumber = (pageNum: number) => {
    setPagination({
      pageIndex: pageNum,
      pageSize: PAGE_SIZE,
    });
  };

  // Update URL when sorting changes
  useEffect(() => {
    const params = new URLSearchParams(searchParam.toString());
    if (sorting.length > 0) {
      const sortString = sorting[0].desc ? `-${sorting[0].id}` : sorting[0].id;
      params.set("sort", sortString);
    } else {
      params.delete("sort");
    }

    router.push(`/manage/c/manage-raw-material?${params.toString()}`);
  }, [sorting, router, searchParam]);

  // Sử dụng useEffect để update URL và trigger API call
  useEffect(() => {
    const params = new URLSearchParams(searchParam.toString());
    if (debouncedSearchTerm) {
      params.set("filter", debouncedSearchTerm);
    } else {
      params.delete("filter");
    }
    router.push(`/manage/c/manage-raw-material?${params.toString()}`, {
      scroll: false,
    });
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (isUpdateStock) {
      setIsUpdateStock(false);
      refetch();
    }
  }, [isUpdateStock]);

  useEffect(() => {
    if (isSuccess) {
      if (data?.result?.length === 0 && pagination.pageIndex > 1) {
        setPagination((prev) => ({
          ...prev,
          pageIndex: prev.pageIndex - 1,
        }));
      }
    }
  }, [data, pagination.pageIndex]);

  if (isLoading) {
    return <div>Loading....</div>;
  }

  return (
    <>
      <CheffDishContext.Provider
        value={{
          UpdateStock: isUpdateStock,
          setUpdateStock: setIsUpdateStock,
        }}
      >
        <div className="w-full">
          <div className="flex items-center py-4 gap-2 max-w ">
            <Input
              placeholder="Filter name..."
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
              }}
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
                      {row.original.price &&
                        row
                          .getVisibleCells()
                          .map((cell) => (
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
              Show <strong>{table.getPaginationRowModel().rows.length}</strong>{" "}
              in <strong>{data?.meta.total ? data?.meta.total : 0} </strong>
              result
            </div>

            <div>
              <AutoPagination
                page={table.getState().pagination.pageIndex}
                limit={table.getPageCount()}
                pathname="/manage/c/manage-raw-material"
                tableNext={table.nextPage}
                tablePre={table.previousPage}
                paginateNumber={onClickPaginateNumber}
              />
            </div>
          </div>
        </div>
      </CheffDishContext.Provider>
    </>
  );
}
