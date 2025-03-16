import http from "@/lib/http";
import {
  TableItemsCreateType,
  TableItemsResType,
  TableItemsUdpateType,
  TableListItemsResType,
} from "@/schemaValidations/table.schema";

const baseURLTable = "v1/table";
const TablesAPIRequest = {
  getAllTable: (
    current: number,
    pageSize: number,
    option?: { filter: string; sort: string }
  ) => {
    // Build the base URL
    let url = `${baseURLTable}?current=${current}&limit=${pageSize}`;
    // Add the filter as a query parameter if it exists
    if (option?.filter) {
      // If option.filter exists, we URL-encode the filter string.
      url += `&qs=${encodeURIComponent(option.filter)}`;
    }

    if (option?.sort) {
      const sortQuery = `sort=${option.sort}`;
      // Nếu đã có qs từ filter thêm giá trị, nếu kh thêm qss mới
      url = option?.filter
        ? `${url}&${encodeURIComponent(sortQuery)}`
        : `${url}&qs=${encodeURIComponent(sortQuery)}`;
    }
    // Send the GET request with the updated URL
    return http
      .get<TableListItemsResType>(url)
      .then((response) => response.payload.data)
      .catch((error) => {
        console.error("API getAllTable Error:", error);
        throw error;
      });
  },

  createTable: (data: TableItemsCreateType) => {
    return http
      .post<TableItemsResType>(`${baseURLTable}`, data)
      .then((response) => {
        return response;
      })
      .catch((error) => console.log("error create createTable", error));
  },
  UdpateTable: (data: TableItemsUdpateType) => {
    return http
      .patch<TableItemsResType>(`${baseURLTable}/${data.tableId}`, data)
      .then((response) => {
        return response;
      })
      .catch((error) => console.log("error create UdpateTable", error));
  },

  DeleteTable: (data: string) => {
    return http
      .delete<TableItemsResType>(`${baseURLTable}/${data}`)
      .then((response) => {
        return response;
      })
      .catch((error) => console.log("error create DeleteTable", error));
  },
};

export { TablesAPIRequest };

