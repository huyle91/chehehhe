import http from "@/lib/http";
import {
  CreateDishType,
  DishItemsResType,
  DishListResType,
  ListDishFollowRestaurantItemsResType,
  UpdateDishFormType
} from "@/schemaValidations/dish.schema";

const urlBaseDish = "v1/dish";

const dishApiRequest = {
  getAllDish: (
    current: number,
    pageSize: number,
    option?: { filter: string; sort: string }
  ) => {
    // Build the base URL
    let url = `${urlBaseDish}?current=${current}&limit=${pageSize}`;
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
      .get<DishListResType>(url)
      .then((response) => response.payload.data)
      .catch((error) => {
        console.error("API getAllDish Error:", error);
        throw error;
      });
  },
  
  getAllDishFollowRestaurant: (
    current: number,
    pageSize: number,
    restaurantId:string|undefined,
    option?: { filter: string; sort: string }
  ) => {
    // Build the base URL
    let url = `${urlBaseDish}/restaurant/{restaurantId}?current=${current}&limit=${pageSize}&restaurantId=${restaurantId}`;
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
      .get<ListDishFollowRestaurantItemsResType>(url)
      .then((response) => response.payload.data)
      .catch((error) => {
        console.error("API getAllDishFollowRestaurant Error:", error);
        throw error;
      });
  },
  getDishByID: (id: string) => {
    return http
      .get<DishItemsResType>(`${urlBaseDish}/${id}`)
      .then((response) => {
        return response;
      })
      .catch((error) => console.log("error get dish ID", error));
  },
  createDish: (data: CreateDishType) => {
    return http
      .post<DishItemsResType>(`${urlBaseDish}`, data)
      .then((response) => {
        return response;
      })
      .catch((error) => console.log("error create dish", error));
  },

  updateDish: (data: UpdateDishFormType) => {
    return http
      .patch(`${urlBaseDish}/${data.dishId}`, data)
      .then((response) => {
        return response;
      })
      .catch((error) => console.log("error update dish", error));
  },

  deleteDish: (id: string) => {
    return http
      .delete(`${urlBaseDish}/${id}`)
      .then((response) => {
        return response;
      })
      .catch((error) => console.log("error delete dish", error));
  },
};


export { dishApiRequest };

