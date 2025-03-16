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
// import {
//   useDeletePermissionMutation,
//   useGetPermission,
// } from "@/queries/usePermission";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import GetDatetime from "@/helper/GetDatetime";
import {
  useDeletePermissionMutation,
  useGetPermission,
  useGetPermissionModule,
} from "@/queries/usePermission";
import {
  DeleteType,
  PermisionType,
  PermissionUpdateType,
} from "@/schemaValidations/permission.schema";
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
import { useTheme } from "next-themes";
import { useRouter, useSearchParams } from "next/navigation";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import AddPermission from "./addPermission";
import EditPermission from "./editPermission";
// type PermissionItem = PermissionListType["data"][0];

const PermissionTableContext = createContext<{
  idUpdate: string;
  setIDUpdate: (value: string) => void;
  isDelete: boolean;
  setIsDelete: (value: boolean) => void;
  setPermissionEdit: (value: PermissionUpdateType) => void;
  permissionEdit: PermissionUpdateType | undefined;
  permissionDelete: object | undefined;
  setPermissionDelete: (value: object | undefined) => void;
}>({
  idUpdate: "",
  setIDUpdate: () => { },
  isDelete: false,
  setIsDelete: () => { },
  setPermissionEdit: () => { },
  permissionEdit: undefined,
  permissionDelete: undefined,
  setPermissionDelete: () => { },
});

// const Theme = useTheme()

export const columns: ColumnDef<PermisionType>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div>{row.original._id}</div>, // Display ID
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div>{row.original.name}</div>, // Display name
  },
  {
    accessorKey: "api",
    header: "API",
    cell: ({ row }) => <div>{row.original.api_path}</div>, // Display API endpoint
  },
  {
    accessorKey: "method",
    header: "Method",
    cell: ({ row }) => {
      const getColor = () => {
        if (row.original.method === "GET") {
          return <div style={{ color: "#0E72FB" }}>{row.original.method}</div>;
        } else if (row.original.method === "POST") {
          return <div style={{ color: "#9FC19B" }}>{row.original.method}</div>;
        } else if (row.original.method === "PUT") {
          return <div style={{ color: "#FFD355" }}>{row.original.method}</div>;
        } else if (row.original.method === "DELETE") {
          return <div style={{ color: "#E0999A" }}>{row.original.method}</div>;
        } else if (row.original.method === "PATCH") {
          if (row.original.method === "PATCH") {
            function GetThemeColor() {
              const theme = useTheme(); // Correct usage inside a React function component
              if (theme.theme === "dark") {
                return (
                  <div style={{ color: "white" }}>{row.original.method}</div>
                );
              } else {
                return (
                  <div style={{ color: "black" }}>{row.original.method}</div>
                );
              }
            }
            return <>{GetThemeColor()}</>;
          }
        }
        return <div>{row.original.method}</div>; // Default case
      };

      return <>{getColor()}</>;
    }, // Display HTTP method (GET, POST, etc.)
  },
  {
    accessorKey: "module",
    header: "Module",
    cell: ({ row }) => <div>{row.original.module}</div>,
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
      const { setPermissionEdit, setPermissionDelete, setIDUpdate } =
        useContext(PermissionTableContext);
      const openEditPermission = () => {
        setIDUpdate(row.original._id);
        const objectPer = {
          _id: row.original._id,
          name: row.original.name,
          api_path: row.original.api_path,
          method: row.original.method as "GET" | "POST" | "PATCH" | "DELETE", // Ép kiểu
          module: row.original.module,
        };

        // console.log("objectPer", objectPer);
        setPermissionEdit(objectPer);
      };

      const openDeletePermission = () => {
        setPermissionDelete({
          id: row.original._id,
          name: row.original.name,
        });
      };
      return (
        <>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => openEditPermission()}
            >
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => openDeletePermission()}
            >
              Delete
            </Button>
          </div>
        </>
      );
    },
  },
];

function AlertDialogDeletePermission({
  setIsDelete,
  permissionDelete,
  setPermissionDelete,
}: {
  setIsDelete: (value: boolean) => void;
  permissionDelete: DeleteType | undefined;
  setPermissionDelete: (value: DeleteType | undefined) => void;
}) {
  const deletePermission = useDeletePermissionMutation();

  const handleDeletePermission = async () => {
    try {
      const permission = permissionDelete?.id as string;
      const resDelete = await deletePermission.mutateAsync(permission);
      // console.log("dataDelte", permissionDelete);
      if (resDelete && resDelete.payload) {
        setIsDelete(true);
        toast({
          description: "Permission is deleted",
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
      open={Boolean(permissionDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setPermissionDelete(undefined);
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete permission</AlertDialogTitle>
          <AlertDialogDescription>
            Permission{" "}
            <span className="bg-foreground text-primary-foreground rounded px-1">
              {permissionDelete?.name}
            </span>{" "}
            Is permission will be permanently deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeletePermission}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

const PAGE_SIZE = 10;

export default function PermissionTable() {
  const router = useRouter();
  const searchParam = useSearchParams();
  const page = searchParam.get("page") ? Number(searchParam.get("page")) : 1;
  const sortParam = searchParam.get("sort");


  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: page,
    pageSize: PAGE_SIZE,
  });
  const [permissionEdit, setPermissionEdit] = useState<
    PermissionUpdateType | undefined
  >(undefined);
  const { data: modulePers } = useGetPermissionModule();

  const [permissionDelete, setPermissionDelete] = useState<
    object | undefined
  >();
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
  // const [searchTerm, setSearchTerm] = useState(filterParam || "");
  // const debouncedSearchTerm = useDebounce(searchTerm);
  const [FilterModule, setFilterModule] = useState<string>("");
  const { data, refetch, isLoading, isSuccess } = useGetPermission(
    pagination.pageIndex,
    pagination.pageSize,
    {
      // If FilterModule is set, pass it as a filter query parameter
      filter: FilterModule ? `module=${encodeURIComponent(FilterModule)}` : "",

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
  // console.log("data", data);
  const table = useReactTable({
    data: data?.result ?? defaultData,
    columns,
    rowCount: data?.meta.total,
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

    router.push(`/manage/a/permissions?${params.toString()}`);
  }, [sorting, router, searchParam]);

  useEffect(() => {
    const params = new URLSearchParams(searchParam.toString());
    // Xử lý filter cho module (FilterModule)
    if (FilterModule) {
      params.set("module", FilterModule);
    } else {
      params.delete("module");
    }
    // Điều hướng tới URL mới với params
    router.push(`/manage/a/permissions?${params.toString()}`, {
      scroll: false,
    });
  }, [FilterModule, searchParam, router]);

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
  // console.log("sort", data);
  return (
    <>
      <PermissionTableContext.Provider
        value={{
          idUpdate: idUpdate as string,
          setIDUpdate,
          isDelete,
          setIsDelete,
          permissionEdit,
          setPermissionEdit,
          permissionDelete,
          setPermissionDelete,
        }}
      >
        <div className="w-full">
          <EditPermission
            id={idUpdate}
            setID={setIDUpdate}
            objectToEdit={permissionEdit as PermissionUpdateType}
            isUpdate={setIsUpdate}
          />
          <AlertDialogDeletePermission
            setIsDelete={setIsDelete}
            permissionDelete={permissionDelete as DeleteType}
            setPermissionDelete={setPermissionDelete}
          />
          <div className="flex items-center py-4 gap-2 max-w ">
            <span className="mr-2">Name</span>
            <Input
              placeholder="Filter name..."
              value={
                (table.getColumn("name")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("name")?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
            <div className="flex items-center">
              <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                <div className="col-span-3 w-full s pace-y-2">
                  <Select
                    value={String(FilterModule)}
                    onValueChange={(e) => setFilterModule(e)}

                  // defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filter Module" />
                    </SelectTrigger>
                    <SelectContent>
                      {modulePers &&
                        modulePers.map((module, index) => (
                          <SelectItem key={index} value={module.module}>
                            {module.module}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <AddPermission setCreate={setIsCreate} />
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
              <strong>{data?.meta.total ? data?.meta.total : 0}</strong> Result
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
      </PermissionTableContext.Provider>
    </>
  );
}
