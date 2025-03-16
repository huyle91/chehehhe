"use client";

import { useAppContext } from "@/components/app-provider";
import AutoPagination from "@/components/auto-pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { useDeleteDishRestaurantMutation } from "@/queries/useDishRestaurant";
import { DishFollowRestaurantItemsType } from "@/schemaValidations/dish.schema";
import { UpdateRestaurantDishType } from "@/schemaValidations/dish_restaurant.schema";
import { DeleteType } from "@/schemaValidations/permission.schema";
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
import PriceOfDishAdd from "./priceDishAdd";
import PriceOfDishUpdate from "./priceDishUpdate";
import { formatCurrency } from "@/lib/utils";

const PriceDishContext = createContext<{
  idUpdate: string;
  setIDUpdate: (value: string) => void;
  isDelete: boolean;
  setIsDelete: (value: boolean) => void;
  idDishAdd: string;
  setIdDishAdd: (value: string) => void;
  setPriceDishEdit: (value: UpdateRestaurantDishType) => void;
  priceDishEdit: UpdateRestaurantDishType | undefined;
  priceDishDelete: object | undefined;
  setPriceDishDelete: (value: object | undefined) => void;
}>({
  idUpdate: "",
  setIDUpdate: () => { },
  isDelete: false,
  setIsDelete: () => { },
  idDishAdd: "",
  setIdDishAdd: () => { },
  setPriceDishEdit: () => { },
  priceDishEdit: undefined,
  priceDishDelete: undefined,
  setPriceDishDelete: () => { },
});

export const columns: ColumnDef<DishFollowRestaurantItemsType>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
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
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.original.category.name}</div>,
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div>{row.original.price !== null ? formatCurrency(row.original.price) : "-"}</div>
    ),
  },
  {
    accessorKey: "isActived",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          In Stock
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div
        className={`px-1 py-1 rounded-lg text-sm ${row.original.isActived
          ? "bg-green-100 text-green-800"
          : "bg-red-100 text-red-800"
          }`}
      >
        {row.original.isActived ? "In Stock" : "Out of Stock"}
      </div>
    ),
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
          hour12: false,
        }
      );

      return <div className="lowercase">{getTimes}</div>;
    },
    enableHiding: true,
    meta: {
      hidden: true // This indicates to the table that this column should be hidden by default
    }
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
    enableHiding: true,
    meta: {
      hidden: true // This indicates to the table that this column should be hidden by default
    }
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: function Actions({ row }) {
      const { setIDUpdate, setPriceDishEdit, setPriceDishDelete, setIdDishAdd } =
        useContext(PriceDishContext);

      const openEditCategory = () => {
        setIDUpdate(row.original._id);
        const objectEditPrice = {
          idResDish: row.original.restaurantDishId,
          dish: row.original._id,
          price: row.original.price as number,
          isActived: row.original.isActived,
        };
        setPriceDishEdit(objectEditPrice);
      };

      const openDeleteCategory = () => {
        setPriceDishDelete({
          id: row.original.restaurantDishId,
          name: row.original.price,
        });
      };

      const openAddPrice = () => {
        setIdDishAdd(row.original._id);
      };

      return (
        <div className="flex gap-2">
          {row.original.restaurantDishId ? (
            // If dish has been added to restaurant (has price)
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => openEditCategory()}
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => openDeleteCategory()}
              >
                Delete
              </Button>
            </>
          ) : (
            // If dish hasn't been added to restaurant yet
            <Button
              variant="outline"
              size="sm"
              onClick={() => openAddPrice()}
            >
              Add to Menu
            </Button>
          )}
        </div>
      );
    },
  },
];

function AlertDialogDeleteCategory({
  setIsDelete,
  priceDishDelete,
  setPriceDishDelete,
}: {
  setIsDelete: (value: boolean) => void;
  priceDishDelete: DeleteType | undefined;
  setPriceDishDelete: (value: DeleteType | undefined) => void;
}) {
  const deletePrice = useDeleteDishRestaurantMutation();

  const handleDeleteCategory = async () => {
    try {
      const priceDishResId = priceDishDelete?.id as string;
      const resDelete = await deletePrice.mutateAsync(priceDishResId);
      if (resDelete && resDelete.payload) {
        setIsDelete(true);
        toast({
          description: "Successfully removed dish from the menu",
          duration: 1000,
        });
      } else {
        toast({
          description: "Error: Unable to remove. Please try again.",
          duration: 1000,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log("error", error);
      toast({
        description: "error at delete is failed",
        duration: 1200,
        variant: "destructive",
      });
    }
  };
  return (
    <AlertDialog
      open={Boolean(priceDishDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setPriceDishDelete(undefined);
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove dish with <span className="bg-foreground text-primary-foreground rounded px-1">
              {formatCurrency(priceDishDelete?.name as unknown as number)}
            </span>{" "} from the menu!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteCategory}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

const PAGE_SIZE = 10;
export default function PriceOfDishTable() {
  const router = useRouter();
  const searchParam = useSearchParams();
  const page = searchParam.get("page") ? Number(searchParam.get("page")) : 1;
  const sortParam = searchParam.get("sort");
  const filterParam = searchParam.get("filter");

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: page,
    pageSize: PAGE_SIZE,
  });
  const [priceDishUpdate, setPriceDishUpdate] = useState<
    UpdateRestaurantDishType | undefined
  >(undefined);
  const { restaurant } = useAppContext();
  const [priceDishDelete, setPriceDishDelete] = useState<object | undefined>();
  const [idUpdate, setIDUpdate] = useState<string | undefined>();
  const [idDishAdd, setIdDishAdd] = useState<string | undefined>("");
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
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

  // Initialize column visibility state to hide createdAt and updatedAt
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    createdAt: false,
    updatedAt: false,
  });

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});

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

    router.push(`/manage/m/price-of-dish?${params.toString()}`);
  }, [sorting, router, searchParam]);

  // Sử dụng useEffect để update URL và trigger API call
  useEffect(() => {
    const params = new URLSearchParams(searchParam.toString());
    if (debouncedSearchTerm) {
      params.set("filter", debouncedSearchTerm);
    } else {
      params.delete("filter");
    }
    router.push(`/manage/m/price-of-dish?${params.toString()}`, {
      scroll: false,
    });
  }, [debouncedSearchTerm, router, searchParam]);

  useEffect(() => {
    if (isCreate || isDelete || isUpdate) {
      setIsDelete(false);
      setIsCreate(false);
      setIsUpdate(false);
      refetch();
    }
  }, [isCreate, isDelete, isUpdate, refetch]);

  useEffect(() => {
    if (isSuccess) {
      if (data?.result?.length === 0 && pagination.pageIndex > 1) {
        setPagination((prev) => ({
          ...prev,
          pageIndex: prev.pageIndex - 1,
        }));
      }
    }
  }, [data, pagination.pageIndex, isSuccess]);

  if (isLoading) {
    return <div>Loading....</div>;
  }

  return (
    <>
      <PriceDishContext.Provider
        value={{
          idUpdate: idUpdate as string,
          setIDUpdate,
          isDelete,
          setIsDelete,
          idDishAdd: idDishAdd as string,
          setIdDishAdd: setIdDishAdd,
          setPriceDishEdit: setPriceDishUpdate,
          priceDishEdit: priceDishUpdate,
          priceDishDelete,
          setPriceDishDelete,
        }}
      >
        <div className="w-full">
          <PriceOfDishAdd
            id={idDishAdd}
            setID={setIdDishAdd}
            setIsCreate={setIsCreate}
          />
          <PriceOfDishUpdate
            id={idUpdate}
            setID={setIDUpdate}
            objectToEdit={priceDishUpdate as UpdateRestaurantDishType}
            isUpdate={setIsUpdate}
          />
          <AlertDialogDeleteCategory
            setIsDelete={setIsDelete}
            priceDishDelete={priceDishDelete as DeleteType}
            setPriceDishDelete={setPriceDishDelete}
          />
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
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className={cell.column.id !== "action" && !row.original.isActived ? "opacity-50" : ""}
                        >
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
                pathname="/manage/m/price-of-dish"
                tableNext={table.nextPage}
                tablePre={table.previousPage}
                paginateNumber={onClickPaginateNumber}
              />
            </div>
          </div>
        </div>
      </PriceDishContext.Provider>
    </>
  );
}