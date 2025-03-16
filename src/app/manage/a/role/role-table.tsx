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
import GetDatetime from "@/helper/GetDatetime";
import { useDebounce } from "@/hooks/useDebounce";
import { useDeleteMutation, useGetRole } from "@/queries/useRole";
import { DeleteType } from "@/schemaValidations/permission.schema";
import { RoleItemsType, RoleUpdateType } from "@/schemaValidations/role.schema";
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
import AddRole from "./addRole";
import EditRole from "./editRole";

const RoleTableContext = createContext<{
  isUpdate: boolean;
  setIsUpdate: (value: boolean) => void;
  setDeleteSuccess: (value: boolean) => void;
  DeleteSuccess: boolean | undefined;
  setRoleIdEdit: (value: string) => void;
  RoleIdEdit: string | "";
  RoleDelete: DeleteType | undefined;
  setroleDelete: (value: DeleteType | undefined) => void;
  ObjectRole: RoleUpdateType | undefined;
  setObjectRole: (value: RoleUpdateType) => void;
}>({
  isUpdate: false,
  setIsUpdate: () => { },
  setDeleteSuccess: () => { },
  DeleteSuccess: undefined,
  setRoleIdEdit: () => { },
  RoleIdEdit: "",
  RoleDelete: undefined,
  setroleDelete: () => { },
  ObjectRole: undefined,
  setObjectRole: () => { },
});

// name status creatAt updateAt
export const columns: ColumnDef<RoleItemsType>[] = [
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
    cell: ({ row }) => (
      <div className="lowercase">{GetDatetime(row.original.createdAt)}</div>
    ),
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
    cell: ({ row }) => (
      <div className="lowercase">{GetDatetime(row.original.createdAt)}</div>
    ),
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: function Actions({ row }) {
      const { setRoleIdEdit, setroleDelete } = useContext(RoleTableContext);
      const openEditRole = () => {
        setRoleIdEdit(row.original._id);
      };

      const openDeleteRole = () => {
        setroleDelete({
          name: row.original.name,
          id: row.original._id,
        });
      };
      return (
        <>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => openEditRole()}>
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => openDeleteRole()}
            >
              Delete
            </Button>
          </div>
        </>
      );
    },
  },
];

function AlertDialogDeleteRole({
  RoleDelete,
  setRouteDelete,
}: {
  RoleDelete: DeleteType | undefined;
  setRouteDelete: (value: DeleteType | undefined) => void;
}) {
  // if(IsDelete.status === 200){setRouteDelete
  //   toast({
  //     description: IsDelete.payload.message,
  //     duration: 1200,
  //     style:{background:"#49CC90"},
  //   })

  // }
  const { setDeleteSuccess } = useContext(RoleTableContext);
  const deleteRole = useDeleteMutation();
  const handleDelete = async () => {
    try {
      const deleteRoleID = RoleDelete?.id as string;
      const IsDelete = await deleteRole.mutateAsync(deleteRoleID);
      if (IsDelete.status === 200) {
        setDeleteSuccess(true);
        toast({
          description: "delete success",
          duration: 1200,

        });
      }
    } catch (error) {
      toast({
        description: "delete fail " + error,
        duration: 1200,
        style: { background: "#FF0000" },
      });
    }
  };
  return (
    <AlertDialog
      open={Boolean(RoleDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setRouteDelete(undefined);
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Staff?</AlertDialogTitle>
          <AlertDialogDescription>
            Account{" "}
            <span className="bg-foreground text-primary-foreground rounded px-1">
              {RoleDelete?.name}
            </span>{" "}
            Is deleted forever. Are you sure you want to delete it?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

const PAGE_SIZE = 10;
export default function RoleTable() {
  const router = useRouter();
  const searchParam = useSearchParams();
  const page = searchParam.get("page") ? Number(searchParam.get("page")) : 1;
  const sortParam = searchParam.get("sort");
  const filterParam = searchParam.get("filter");

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: page,
    pageSize: PAGE_SIZE,
  });
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [IsCreated, setIsCreated] = useState<boolean>();
  const [roleIdEdit, setRoleIdEdiT] = useState<string | undefined>();
  const [roleObject, setRoleObject] = useState<RoleUpdateType>();
  const [roleDelete, setRoleDelete] = useState<DeleteType | undefined>();
  const [isDelete, setIsDelete] = useState<boolean>(false);
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
  const { data, refetch, isLoading, error, isSuccess } = useGetRole(
    pagination.pageIndex,
    pagination.pageSize,
    {
      sort:
        sorting.length > 0
          ? sorting[0].desc
            ? `-${sorting[0].id}`
            : sorting[0].id
          : "createdAt",
      filter: filterParam
        ? `filter=${encodeURIComponent(JSON.stringify({ name: { $regex: filterParam, $options: "i" } }))}`
        : "",
    }
  );

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
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

    router.push(`/manage/a/role?${params.toString()}`);
  }, [sorting, router, searchParam]);

  // Sử dụng useEffect để update URL và trigger API call
  useEffect(() => {
    const params = new URLSearchParams(searchParam.toString());
    if (debouncedSearchTerm) {
      params.set("filter", debouncedSearchTerm);
    } else {
      params.delete("filter");
    }
    router.push(`/manage/a/role?${params.toString()}`, { scroll: false });
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (IsCreated || isDelete || isUpdate) {
      setIsDelete(false);
      setIsCreated(false);
      setIsUpdate(false);
      refetch();
    }
  }, [IsCreated, isDelete, isUpdate]);
  // console.log("sort",sorting)
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
  if (isLoading) return <div>loading.....</div>;
  if (error) return <div>Error</div>;
  return (
    <>
      <RoleTableContext.Provider
        value={{
          isUpdate,
          setIsUpdate,
          setDeleteSuccess: setIsDelete,
          DeleteSuccess: isDelete,
          setRoleIdEdit: setRoleIdEdiT,
          RoleIdEdit: roleIdEdit as string,
          RoleDelete: roleDelete,
          setroleDelete: setRoleDelete,
          ObjectRole: roleObject,
          setObjectRole: setRoleObject,
        }}
      >
        <div className="w-full">
          <EditRole
            isUpdateRole={setIsUpdate}
            id={roleIdEdit}
            setId={setRoleIdEdiT}
            onSubmitSuccess={() => { }}
          />
          <AlertDialogDeleteRole
            RoleDelete={roleDelete}
            setRouteDelete={setRoleDelete}
          />
          <div className="flex items-center py-4">
            <Input
              placeholder="Filter name..."
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
              }}
              className="max-w-sm"
            />
            <div className="ml-auto flex items-center gap-2">
              <AddRole setIsCreated={setIsCreated} />
            </div>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table &&
                  table.getHeaderGroups().map((headerGroup) => (
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
                {table && table.getRowModel().rows?.length ? (
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
              <strong>Show {table.getRowModel().rows.length} of </strong>
              <strong>{data?.meta.total ? data?.meta.total : 0} Rows</strong>
            </div>
            <div>
              <AutoPagination
                page={table.getState().pagination.pageIndex}
                limit={table.getPageCount()}
                pathname="/manage/a/role"
                tableNext={table.nextPage}
                tablePre={table.previousPage}
                paginateNumber={onClickPaginateNumber}
              />
            </div>
          </div>
        </div>
      </RoleTableContext.Provider>
    </>
  );
}
