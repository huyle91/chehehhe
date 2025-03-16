
const urlBaseDishRestaurant = "v1/restaurant-dish";
import http from "@/lib/http";
import { CreateRestaurantDishType, DishRestaurantResType, ListItemDishRestaurantResType, UpdateRestaurantDishType } from "@/schemaValidations/dish_restaurant.schema";
const dishRestaurantApiRequest = {
    getAllDishRestaurant: (
      current: number,
      pageSize: number,
      option?: { filter: string; sort: string }
    ) => {
      // Build the base URL
      let url = `${urlBaseDishRestaurant}?current=${current}&limit=${pageSize}`;
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
        .get<ListItemDishRestaurantResType>(url)
        .then((response) => response.payload.data)
        .catch((error) => {
          console.error("API getAllDishRestaurant Error:", error);
          throw error;
        });
    },
    getRestaurantDishByID: (id: string) => {
      return http
        .get<DishRestaurantResType>(`${urlBaseDishRestaurant}/${id}`)
        .then((respone) => {
          return respone;
        })
        .catch((error) => console.log("error at get restaurant by id", error));
    },
  
    createDishRestaurant: (data: CreateRestaurantDishType) => {
      return http
        .post<DishRestaurantResType>(`${urlBaseDishRestaurant}`, data)
        .then((response) => {
          return response;
        })
        .catch((error) => console.log("error create dish restaurant", error));
    },
  
    updateDishRestaurant: (data: UpdateRestaurantDishType) => {
      return http
        .patch(`${urlBaseDishRestaurant}/${data.idResDish}`, data)
        .then((response) => {
          return response;
        })
        .catch((error) => console.log("error update dish restaurant", error));
    },
  
    deleteDishRestaurant: (id: string) => {
      return http
        .delete(`${urlBaseDishRestaurant}/${id}`)
        .then((response) => {
          return response;
        })
        .catch((error) => console.log("error delete dish restaurant", error));
    },
  };


export { dishRestaurantApiRequest };
