"use client";
import AutoPagination from "@/components/auto-pagination";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { useGetListTable } from "@/queries/useTable";
import { TableItemType } from "@/schemaValidations/table.schema";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { PaginationState } from "@tanstack/react-table";
import { useRouter, useSearchParams } from "next/navigation";
import { createContext, useEffect, useState } from "react";
import AddTable from "./add-table";
import OptionTable from "./option-table";

const PAGE_SIZE = 20;
const TableContext = createContext<{
  isOpenOption: TableItemType | undefined;
  setIdOpenOption: (values: TableItemType) => void;
}>({
  isOpenOption: undefined,
  setIdOpenOption: () => {},
});
export default function TableManage() {
  const router = useRouter();
  const searchParam = useSearchParams();
  const page = searchParam.get("page") ? Number(searchParam.get("page")) : 1;
  const sortParam = searchParam.get("sort") ? searchParam.get("sort") : "";
  const filterParam = searchParam.get("filter")
    ? searchParam.get("filter")
    : "";
  const statusParam = searchParam.get("status")
    ? searchParam.get("status")
    : "";
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: page,
    pageSize: PAGE_SIZE,
  });

  const [isOpenOption, setIsOpenOption] = useState<TableItemType | undefined>();
  const [isCreate, setIsCreate] = useState<boolean>(false);

  const [sorting, setSorting] = useState<string>(sortParam || "");
  const [searchStatus, setSearchStatus] = useState(statusParam || "");
  const [searchTerm, setSearchTerm] = useState(filterParam || "");
  const debouncedSearchTerm = useDebounce(searchTerm);
  // Construct the filter query dynamically
  const getFilterQuery = () => {
    const filters: Record<string, any> = {};

    if (debouncedSearchTerm) {
      filters.table_number = { $eq: Number(debouncedSearchTerm) };
    }

    if (searchStatus) {
      filters.status = { $eq: searchStatus };
    }

    return Object.keys(filters).length > 0
      ? `filter=${encodeURIComponent(JSON.stringify(filters))}`
      : "";
  };

  const {
    data: tableList,
    refetch,
    isLoading,
  } = useGetListTable(pagination.pageIndex, pagination.pageSize, {
    // If Filtername is set, pass it as a filter query parameter
    filter: getFilterQuery(),

    // Dynamic sorting
    sort: sorting ? sorting : "table_number",
  });

  useEffect(() => {
    const params = new URLSearchParams(searchParam.toString());

    if (debouncedSearchTerm) {
      params.set("filter", debouncedSearchTerm);
    } else {
      params.delete("filter");
    }

    if (searchStatus) {
      params.set("status", searchStatus);
    } else {
      params.delete("status");
    }
    router.push(`/manage/m?${params.toString()}`, { scroll: false });
  }, [debouncedSearchTerm, searchStatus, router, searchParam]);

  useEffect(() => {
    const params = new URLSearchParams(searchParam.toString());

    if (sorting) {
      params.set("sort", sorting);
    } else {
      params.delete("sort");
    }
    router.push(`/manage/m?${params.toString()}`, { scroll: false });
  }, [sorting, router, searchParam]);

  useEffect(() => {
    if (isCreate) {
      setIsCreate(false);

      refetch();
    }
  }, [isCreate]);
  // const {data:dataTable} = useGetListTable()

  const onClickPaginateNumber = (pageNum: number) => {
    setPagination({
      pageIndex: pageNum,
      pageSize: PAGE_SIZE,
    });
  };

  const handleNextPage = () => {
    setPagination((prePage) => {
      return { ...prePage, pageIndex: prePage.pageIndex + 1 };
    });
  };

  const handlePrePage = () => {
    setPagination((afterPage) => {
      return { ...afterPage, pageIndex: afterPage.pageIndex - 1 };
    });
  };

  const handleFilterByStatus = (status: string) => {
    // If the clicked status is the same as the current searchStatus, reset it to empty
    if (searchStatus === status) {
      setSearchStatus("");
    } else {
      setSearchStatus(status);
    }
  };

  const handleTableClick = (table: TableItemType) => {
    // router.push(`/manage/m/table/${tableNumber}`);
    setIsOpenOption(table);
  };

  const handleSortByNumber = (field: string) => {
    setSorting((prevSorting) => {
      // Nếu đang sắp xếp giảm (-field), đổi thành tăng (field)
      if (prevSorting === `-${field}`) {
        return field;
      }
      // Nếu đang sắp xếp tăng (field), đổi thành giảm (-field)
      return `-${field}`;
    });
  };

  const handleGetAll = () => {
    setSearchStatus("")
  }
  if (isLoading) {
    return <div>Loading........</div>;
  }

  return (
    <>
      <TableContext.Provider
        value={{
          isOpenOption: isOpenOption,
          setIdOpenOption: setIsOpenOption,
        }}
      >
        <div className="p-4">
          {/* Table Management Section */}
          <div className="mb-6">
            {/* Search Bar */}
            <div className="mb-4 flex items-center py-4 gap-2 max-w">
              <div>
                <Input
                  type="number"
                  placeholder="Filter number..."
                  value={searchTerm}
                  onChange={(event) => {
                    setSearchTerm(event.target.value);
                  }}
                  className="max-w-sm"
                />
              </div>
              <Button
                variant={"outline"}
                onClick={() => handleSortByNumber("table_number")}
              >
                Sort number
                <CaretSortIcon className="ml-2 h-4 w-4" />
              </Button>
              <div className="ml-auto flex items-center gap-2">
                <AddTable setCreate={setIsCreate} />
              </div>
              <OptionTable
                table={isOpenOption as TableItemType}
                setTable={setIsOpenOption}
              />
            </div>

            {/* Status Filters */}
            <div className="flex gap-4 mb-6 flex-wrap">
              <Button
                variant={"outline"}
                onClick={() => handleGetAll()}
              >
                All
              </Button>
              <Button
                variant={"outline"}
                className={
                  searchStatus === "Available"
                    ? ""
                    : "px-4 py-2 bg-green-100 text-green-800 rounded-md"
                }
                onClick={() => handleFilterByStatus("Available")}
              >
                Available
              </Button>
              <Button
                variant={"outline"}
                className={
                  searchStatus === "Unavailable"
                    ? ""
                    : "px-4 py-2 bg-red-100 text-red-800 rounded-md"
                }
                onClick={() => handleFilterByStatus("Unavailable")}
              >
                Unavailable
              </Button>
              <Button
                variant={"outline"}
                className={
                  searchStatus === "Occupied"
                    ? ""
                    : "px-4 py-2 bg-yellow-100 text-yellow-800 rounded-md"
                }
                onClick={() => handleFilterByStatus("Occupied")}
              >
                Occupied
              </Button>
              <Button
                variant={"outline"}
                className={
                  searchStatus === "Occupied"
                    ? ""
                    : "px-4 py-2 bg-yellow-100 text-yellow-800 rounded-md"
                }
                onClick={() => handleFilterByStatus("Cleaning")}
              >
                Cleaning
              </Button>
            </div>

            {/* Table Grid */}
            <div className="grid lg:grid-cols-4 lg:gap-8 md:grid-cols-3 md:gap-4 sm:grid-cols-2 sm:gap-2 gap-2">
              {tableList?.result.map((table, index) => (
                <Card
                  key={index}
                  onClick={() => handleTableClick(table)}
                  className={`p-4 cursor-pointer hover:shadow-lg transition-all hover:scale-105
                ${
                  table.status === "Available"
                    ? "bg-green-100"
                    : table.status === "Unavailable"
                      ? "bg-red-100"
                      : table.status === "Occupied"
                        ? "bg-yellow-100"
                        : table.status === "Cleaning"
                          ? "bg-yellow-100"
                          : "bg-white"
                }`}
                >
                  <CardContent className="p-0">
                    <div className="flex flex-col space-y-3 text-gray-900">
                      <h3 className="font-semibold text-lg">
                        Table {table.table_number}
                      </h3>
                      <div className="flex flex-col items-center">
                        <div className="relative">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-12 w-12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <circle cx="12" cy="7" r="4" />
                            <path d="M3 19h18c0-6-4-8-9-8s-9 2-9 8z" />
                            <path d="M7 13.5V13h10v.5" />
                          </svg>
                          <div
                            className={`absolute -top-1 -right-1 w-3 h-3 rounded-full
                        ${
                          table.status === "Available"
                            ? "bg-green-500"
                            : table.status === "Unavailable"
                              ? "bg-red-500"
                              : table.status === "Occupied"
                                ? "bg-yellow-500"
                                : table.status === "Cleaning"
                                  ? "bg-yellow-500"
                                  : ""
                        }`}
                          />
                        </div>
                        <span
                          className={`text-sm capitalize
                      ${
                        table.status === "Available"
                          ? "text-green-800"
                          : table.status === "Unavailable"
                            ? "text-red-800"
                            : table.status === "Occupied"
                              ? "text-yellow-800"
                              : table.status === "Cleaning"
                                ? "text-yellow-800"
                                : ""
                      }`}
                        >
                          {table.status}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {!tableList?.result[0] ? (
              <div className="flex justify-center alight-center h-max w-100%">
                <h1 className="font-bold text-lg-bold h-24">No result</h1>
              </div>
            ) : null}
          </div>
          <div className="flex flex-wrap justify-end w-full">
            <div>
              <AutoPagination
                page={pagination.pageIndex}
                limit={tableList?.meta.pages ?? 0}
                pathname="/manage/m"
                tableNext={handleNextPage as () => void}
                tablePre={handlePrePage as () => void}
                paginateNumber={onClickPaginateNumber}
              />
            </div>
          </div>
        </div>
      </TableContext.Provider>
    </>
  );
}
