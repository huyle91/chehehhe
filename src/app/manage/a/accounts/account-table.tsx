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
import { useDebounce } from "@/hooks/useDebounce";
import {
  useCreateMeMutation,
  useDeleteMutation,
  useGetAccounts,
  useUpdateMeMutation,
} from "@/queries/useAccount";
import { useGetListRestaurant } from "@/queries/useRestaurant";
import { useGetRole } from "@/queries/useRole";
import {
  AccountType,
  CreateEmployeeAccountBodyType,
  UpdateEmployeeAccountBodyType,
} from "@/schemaValidations/account.schema";
import { CaretSortIcon } from "@radix-ui/react-icons";
import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useRouter, useSearchParams } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import AddEmployee from "./add-employee";
import EditEmployee from "./edit-employee";

interface AccountTableContextType {
  isUpdate: boolean;
  setIsUpdate: (value: boolean) => void;
  setDeleteSuccess: (value: boolean) => void;
  DeleteSuccess: boolean | undefined;
  setAccountIdEdit: (value: string | undefined) => void;
  AccountIdEdit: string | undefined;
  AccountDelete: AccountType | null;
  setAccountDelete: (value: AccountType | null) => void;
}

const AccountTableContext = createContext<AccountTableContextType>({
  isUpdate: false,
  setIsUpdate: () => { },
  setDeleteSuccess: () => { },
  DeleteSuccess: undefined,
  setAccountIdEdit: () => { },
  AccountIdEdit: undefined,
  AccountDelete: null,
  setAccountDelete: () => { },
});

export const columns: ColumnDef<AccountType>[] = [
  {
    accessorKey: "_id",
    header: "ID",
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "username",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Username
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "role.name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Role
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "restaurant.name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Restaurant
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const account = row.original;
      const { setAccountIdEdit, setAccountDelete } =
        useContext(AccountTableContext);

      return (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAccountIdEdit(account._id)}
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setAccountDelete(account)}
          >
            Delete
          </Button>
        </div>
      );
    },
  },
];

function AlertDialogDeleteAccount({
  accountDelete,
  setAccountDelete,
}: {
  accountDelete: AccountType | null;
  setAccountDelete: (value: AccountType | null) => void;
}) {
  const { setDeleteSuccess } = useContext(AccountTableContext);
  const deleteAccount = useDeleteMutation();

  const handleDelete = async () => {
    try {
      const response = await deleteAccount.mutateAsync(
        accountDelete?._id as string
      );
      if (response.status === 200) {
        setDeleteSuccess(true);
        toast({
          description: "Delete account successfully",
          duration: 1200,

        });
        setAccountDelete(null);
      }
    } catch (error) {
      toast({
        description: "Delete failed " + error,
        duration: 1200,
        style: { background: "#FF0000" },
      });
    }
  };

  return (
    <AlertDialog
      open={Boolean(accountDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setAccountDelete(null);
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Account?</AlertDialogTitle>
          <AlertDialogDescription>
            Account{" "}
            <span className="bg-foreground text-primary-foreground rounded px-1">
              {accountDelete?.username}
            </span>{" "}
            will be permanently deleted. Are you sure?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

const PAGE_SIZE = 10;

export default function AccountTable() {
  const router = useRouter();
  const searchParam = useSearchParams();
  const page = searchParam.get("page") ? Number(searchParam.get("page")) : 1;
  const sortParam = searchParam.get("sort");
  const filterParam = searchParam.get("filter");

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: page,
    pageSize: PAGE_SIZE,
  });

  const { role } = useAppContext();

  //Admin role id is a hard value to avoid error case admin is not exit on our system lead to error call api
  //

  const roleIdParam = role?._id || "";

  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [isCreated, setIsCreated] = useState<boolean>();
  const [accountIdEdit, setAccountIdEdit] = useState<string>();
  const [accountDelete, setAccountDelete] = useState<AccountType | null>(null);
  const [isDelete, setIsDelete] = useState<boolean>(false);

  // const defaultData = useMemo(() => [], []);
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

  const createAccountMutation = useCreateMeMutation();
  const updateAccountMutation = useUpdateMeMutation();

  const [searchTerm, setSearchTerm] = useState(filterParam || "");
  const debouncedSearchTerm = useDebounce(searchTerm);

  // Update URL when sorting changes
  useEffect(() => {
    const params = new URLSearchParams(searchParam.toString());
    if (sorting.length > 0) {
      const sortString = sorting[0].desc ? `-${sorting[0].id}` : sorting[0].id;
      params.set("sort", sortString);
    } else {
      params.delete("sort");
    }

    router.push(`/manage/a/accounts?${params.toString()}`);
  }, [sorting, router, searchParam]);

  // Sử dụng useEffect để update URL và trigger API call
  useEffect(() => {
    const params = new URLSearchParams(searchParam.toString());
    if (debouncedSearchTerm) {
      params.set("filter", debouncedSearchTerm);
    } else {
      params.delete("filter");
    }
    router.push(`/manage/a/accounts?${params.toString()}`, { scroll: false });
  }, [debouncedSearchTerm]);

  const { data, refetch, isLoading, error, isSuccess } = useGetAccounts(
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
        ? `filter=${encodeURIComponent(
          JSON.stringify({
            $and: [
              { username: { $regex: filterParam, $options: "i" } },
              { role: { $ne: `${roleIdParam}` } },
            ],
          })
        )}`
        : `filter=${encodeURIComponent(
          JSON.stringify({
            role: { $ne: `${roleIdParam}` },
          })
        )}`,
    }
  );




  useEffect(() => {
    if (isSuccess) {
      if (table.getRowModel().rows.length === 0 && pagination.pageIndex > 1) {
        setPagination((prev) => ({
          ...prev,
          pageIndex: prev.pageIndex - 1,
        }));
      }
    }
  }, [data, pagination.pageIndex]);

  const {
    data: restaurantData,
    refetch: restaurantRefetch,
    isLoading: restaurantLoading,
    error: restaurantError,
  } = useGetListRestaurant(pagination.pageIndex, pagination.pageSize, {
    sort:
      sorting.length > 0
        ? sorting[0].desc
          ? `-${sorting[0].id}`
          : sorting[0].id
        : "createdAt",
    filter: "",
  });
  const {
    data: roleData,
    refetch: roleRefetch,
    isLoading: roleLoading,
    error: roleError,
  } = useGetRole(pagination.pageIndex, pagination.pageSize, {
    sort:
      sorting.length > 0
        ? sorting[0].desc
          ? `-${sorting[0].id}`
          : sorting[0].id
        : "createdAt",
    filter: "",
  });

  const addEmployeeProps = {
    roleData: roleData?.result || [],
    restaurantData: restaurantData?.payload?.data?.result || [],
  };

  const editEmployeeProps = {
    roleData: roleData?.result || [],
    restaurantData: restaurantData?.payload?.data?.result || [],
  };

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: data?.result || [],
    columns,
    rowCount: data?.meta.total || 0,
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
  });

  const handleCreateAccount = async (data: CreateEmployeeAccountBodyType) => {
    try {
      const dataCreate = data;

      const resCreate = await createAccountMutation.mutateAsync(dataCreate);
      // console.log("data",resCreate)
      if (resCreate.payload) {
        setIsCreated(true);
        toast({
          title: "Success",
          description: "Create account successfully",
          duration: 1200,
        });
      }
    } catch (error: any) {
      console.log("error", error);
      toast({
        title: "Error",
        description: "Create account failed email was exit",
        duration: 1200,
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleEditAccount = async (
    data: UpdateEmployeeAccountBodyType & { id: string }
  ) => {
    try {
      // console.log("data-edit", data);
      await updateAccountMutation.mutateAsync(data);

      toast({
        title: "Success",
        description: "Cập nhật tài khoản thành công",
        duration: 1200,
      });
      setIsUpdate(true);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Có lỗi xảy ra",
        duration: 1200,
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    if (isCreated || isDelete || isUpdate) {
      setIsDelete(false);
      setIsCreated(false);
      setIsUpdate(false);
      refetch();
    }
  }, [isCreated, isDelete, isUpdate, refetch]);

  const onClickPaginateNumber = (pageNum: number): void => {
    setPagination({
      pageIndex: pageNum,
      pageSize: PAGE_SIZE,
    });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading accounts</div>;

  return (
    <AccountTableContext.Provider
      value={{
        isUpdate,
        setIsUpdate,
        setDeleteSuccess: setIsDelete,
        DeleteSuccess: isDelete,
        setAccountIdEdit,
        AccountIdEdit: accountIdEdit,
        AccountDelete: accountDelete,
        setAccountDelete,
      }}
    >
      <div className="w-full">
        <AlertDialogDeleteAccount
          accountDelete={accountDelete}
          setAccountDelete={setAccountDelete}
        />
        <EditEmployee
          id={accountIdEdit}
          onSubmitSuccess={handleEditAccount}
          employeeProps={editEmployeeProps}
        />

        <div className="flex items-center py-4 gap-4">
          <Input
            placeholder="Filter username..."
            value={searchTerm}
            onChange={(event) => {
              setSearchTerm(event.target.value);
              table.getColumn("username")?.setFilterValue(event.target.value);
            }}
            className="max-w-sm"
          />

          <div className="ml-auto">
            <AddEmployee
              onSubmitSuccess={handleCreateAccount}
              addEmployeeProps={addEmployeeProps}
            />
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  ))}
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

        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="text-sm text-muted-foreground">
            Showing {table.getRowModel().rows.length} of{" "}
            {data?.meta?.total || 0} results
          </div>
          <div><AutoPagination
            page={table.getState().pagination.pageIndex}
            limit={table.getPageCount()}
            pathname="/manage/a/accounts"
            tableNext={table.nextPage}
            tablePre={table.previousPage}
            paginateNumber={onClickPaginateNumber}
          /></div>

        </div>
      </div>
    </AccountTableContext.Provider>
  );
}
