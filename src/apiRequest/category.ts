import http from "@/lib/http";
import {
  CategoryCreateType,
  CategoryListResType,
  CategoryResType,
  CategoryUpdateType,
} from "@/schemaValidations/category.schema";

const categoryApiRequest = {
  getAllcategory: (
    current: number,
    pageSize: number,
    option?: { filter: string; sort: string }
  ) => {
    // Build the base URL
    let url = `v1/category?current=${current}&limit=${pageSize}`;
    // Add the filter as a query parameter if it exists
    if (option?.filter) {
      // If option.filter exists, we URL-encode the filter string.
      url += `&qs=${encodeURIComponent(option.filter)}`;
    }

    // Add the sort as a query parameter if it exists
    if (option?.sort) {
      // URL-encode the sort string
      url += `&sort=${encodeURIComponent(option.sort)}`;
    }

    // Send the GET request with the updated URL
    return http
      .get<CategoryListResType>(url)
      .then((response) => response.payload.data)
      .catch((error) => {
        console.error("API getAllCategory Error:", error);
        throw error;
      });
  },

  getCaregoryByID: (id: string) => {
    return http
      .get<CategoryResType>(`v1/category/${id}`)
      .then((response) => {
        if (!response) {
          throw new Error("Failed to fetch category");
        }
        return response;
      })
      .catch((error) => {
        console.error("Error getting category by ID:", error);
        throw error;
      });
  },

  createCategory: (data: CategoryCreateType) => {
    return http
      .post<CategoryResType>("v1/category", data)
      .then((response) => {
        if (!response) {
          throw new Error("Failed to create category");
        }
        return response;
      })
      .catch((error) => {
        console.error("Error creating category:", error);
        throw error;
      });
  },

  updateCategory: (data: CategoryUpdateType) => {
    return http
      .patch(`v1/category/${data.categoryId}`, data)
      .then((response) => {
        if (!response) {
          throw new Error("Failed to update category");
        }
        return response;
      })
      .catch((error) => {
        console.error("Error updating category:", error);
        throw error;
      });
  },

  deleteCategory: (id: string) => {
    return http
      .delete(`v1/category/${id}`)
      .then((response) => {
        if (!response) {
          throw new Error("Failed to delete category");
        }
        return response;
      })
      .catch((error) => {
        console.error("Error deleting category:", error);
        throw error;
      });
  },
};

export default categoryApiRequest;
