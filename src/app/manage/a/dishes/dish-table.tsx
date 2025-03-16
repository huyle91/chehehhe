"use client";

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
import { useDeleteDishMutation, useGetDish } from "@/queries/useDish";
import { DishItemsType, UpdateDishType } from "@/schemaValidations/dish.schema";
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
import DishAdd from "./add-dish";
import DishEdit from "./edit-dish";

const DishTableContext = createContext<{
  idUpdate: string;
  setIDUpdate: (value: string) => void;
  isDelete: boolean;
  setIsDelete: (value: boolean) => void;
  setDishEdit: (value: UpdateDishType) => void;
  dishEdit: UpdateDishType | undefined;
  dishDelete: DeleteType | undefined;
  setDishDelete: (value: DeleteType | undefined) => void;
}>({
  idUpdate: "",
  setIDUpdate: () => { },
  isDelete: false,
  setIsDelete: () => { },
  setDishEdit: () => { },
  dishEdit: undefined,
  dishDelete: undefined,
  setDishDelete: () => { },
});

export const columns: ColumnDef<DishItemsType>[] = [
  {
    accessorKey: "_id",
    header: "ID",
    cell: ({ row }) => <div>{row.original._id}</div>, // Display ID
  },
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
    accessorKey: "action",
    header: "Action",
    cell: function Actions({ row }) {
      const { setIDUpdate, setDishDelete, setDishEdit } =
        useContext(DishTableContext);

      const openEditDish = () => {
        setIDUpdate(row.original._id);
        const objectEditDish = {
          dishId: row.original._id,
          name: row.original.name,
          description: row.original.description,
          status: row.original.status,
          image: row.original.image,
          category: row.original.category,
        };
        // console.log("dish table",objectEditDish.category._id)
        setDishEdit(objectEditDish);
      };

      const openDeleteDish = () => {
        setDishDelete({
          id: row.original._id,
          name: row.original.name,
        });
      };

      return (
        <>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => openEditDish()}>
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => openDeleteDish()}
            >
              Delete
            </Button>
          </div>
        </>
      );
    },
  },
];

function AlertDialogDeleteDish({
  setIsDelete,
  DishDelete,
  setDishDelete,
}: {
  setIsDelete: (value: boolean) => void;
  DishDelete: DeleteType | undefined;
  setDishDelete: (value: DeleteType | undefined) => void;
}) {
  const deleteDish = useDeleteDishMutation();

  const handleDeleteCategory = async () => {
    try {
      const dishID = DishDelete?.id as string;
      const resDelete = await deleteDish.mutateAsync(dishID);
      // console.log("dataDelte", permissionDelete);
      if (resDelete && resDelete.payload) {
        setIsDelete(true);
        toast({
          description: "Dish is deleted",
          duration: 1200,

        });
      } else {
        toast({
          description: "delete is not successfull",
          duration: 1200,
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
      open={Boolean(DishDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setDishDelete(undefined);
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Dish</AlertDialogTitle>
          <AlertDialogDescription>
            Dish{" "}
            <span className="bg-foreground text-primary-foreground rounded px-1">
              {DishDelete?.name}
            </span>{" "}
            Is Dish will be permanently deleted.
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
export default function DishTable() {
  const router = useRouter();
  const searchParam = useSearchParams();
  const page = searchParam.get("page") ? Number(searchParam.get("page")) : 1;
  const sortParam = searchParam.get("sort");
  const filterParam = searchParam.get("filter");

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: page,
    pageSize: PAGE_SIZE,
  });
  const [DishUpdate, setDishUpdate] = useState<UpdateDishType | undefined>(
    undefined
  );

  const [DishDelete, setDishDelete] = useState<DeleteType | undefined>();
  const [idUpdate, setIDUpdate] = useState<string | undefined>();
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
  const { data, refetch, isLoading, isSuccess } = useGetDish(
    pagination.pageIndex,
    pagination.pageSize,
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

    router.push(`/manage/a/dishes?${params.toString()}`);
  }, [sorting, router, searchParam]);

  // Sử dụng useEffect để update URL và trigger API call
  useEffect(() => {
    const params = new URLSearchParams(searchParam.toString());
    if (debouncedSearchTerm) {
      params.set("filter", debouncedSearchTerm);
    } else {
      params.delete("filter");
    }
    router.push(`/manage/a/dishes?${params.toString()}`, { scroll: false });
  }, [debouncedSearchTerm]);

  // console.log('data',data)
  useEffect(() => {
    if (isCreate || isDelete || isUpdate) {
      setIsDelete(false);
      setIsCreate(false);
      setIsUpdate(false);
      refetch();
    }
  }, [isCreate, isDelete, isUpdate]);

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
      <DishTableContext.Provider
        value={{
          idUpdate: idUpdate as string,
          setIDUpdate,
          isDelete,
          setIsDelete,
          dishEdit: DishUpdate,
          setDishEdit: setDishUpdate,
          dishDelete: DishDelete,
          setDishDelete,
        }}
      >
        <div className="w-full">
          <DishEdit
            id={idUpdate}
            setID={setIDUpdate}
            objectToEdit={DishUpdate as UpdateDishType}
            isUpdate={setIsUpdate}
          />
          <AlertDialogDeleteDish
            setIsDelete={setIsDelete}
            DishDelete={DishDelete as DeleteType}
            setDishDelete={setDishDelete}
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
            <div className="ml-auto flex items-center gap-2">
              <DishAdd setCreate={setIsCreate} />
            </div>
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
              Show{" "}
              <strong>{table.getPaginationRowModel().rows.length}</strong> in{" "}
              <strong>{data?.meta.total ? data?.meta.total : 0}</strong> result
            </div>

            <div>
              <AutoPagination
                page={table.getState().pagination.pageIndex}
                limit={table.getPageCount()}
                pathname="/manage/a/dishes"
                tableNext={table.nextPage}
                tablePre={table.previousPage}
                paginateNumber={onClickPaginateNumber}
              />
            </div>
          </div>
        </div>
      </DishTableContext.Provider>
    </>
  );
}
