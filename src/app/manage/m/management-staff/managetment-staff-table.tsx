"use client";

import { useAppContext } from "@/components/app-provider";
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
import { useDebounce } from "@/hooks/useDebounce";
import { useGetAccounts } from "@/queries/useAccount";
import { AccountType } from "@/schemaValidations/account.schema";
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
import { createContext, useEffect, useState } from "react";

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
];

const PAGE_SIZE = 10;

export default function ManagementAccountTable() {
  const router = useRouter();
  const searchParam = useSearchParams();
  const page = searchParam.get("page") ? Number(searchParam.get("page")) : 1;
  const sortParam = searchParam.get("sort");
  const filterParam = searchParam.get("filter");

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: page,
    pageSize: PAGE_SIZE,
  });

  const { restaurant } = useAppContext();
  //Admin role id is a hard value to avoid error case admin is not exit on our system lead to error call api
  //

  const restaurantIdParam = restaurant?._id || "";

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

    router.push(`/manage/m/management-staff?${params.toString()}`);
  }, [sorting, router, searchParam]);

  // Sử dụng useEffect để update URL và trigger API call
  useEffect(() => {
    const params = new URLSearchParams(searchParam.toString());
    if (debouncedSearchTerm) {
      params.set("filter", debouncedSearchTerm);
    } else {
      params.delete("filter");
    }
    router.push(`/manage/m/management-staff?${params.toString()}`, {
      scroll: false,
    });
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
              { restaurant: { $eq: `${restaurantIdParam}` } },
            ],
          })
        )}`
        : `filter=${encodeURIComponent(
          JSON.stringify({
            $and: [{ restaurant: { $eq: `${restaurantIdParam}` } }],
          })
        )}`,
    }
  );
  //tesst
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
  //hello
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
                table.getRowModel().rows.map((row) => {
                  if (
                    row.original.role.name === "Chef" ||
                    row.original.role.name === "Staff"
                  ) {
                    return (
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
                    );
                  }
                })
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
          <div>
            <AutoPagination
              page={table.getState().pagination.pageIndex}
              limit={table.getPageCount()}
              pathname="/manage/m/management-staff"
              tableNext={table.nextPage}
              tablePre={table.previousPage}
              paginateNumber={onClickPaginateNumber}
            />
          </div>
        </div>
      </div>
    </AccountTableContext.Provider>
  );
}
