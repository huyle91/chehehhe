import http from "@/lib/http";
import {
  CreateRestaurantBodyType,
  RestaurantListResType,
  RestaurantResType,
  UpdateRestaurantBodyType,
} from "./../schemaValidations/restaurant.schema";

const prefix = "/v1/restaurant";
const restaurantApiRequest = {
  list: (
    current: number,
    limit: number,
    option?: { filter: string; sort: string }
  ) => {
    let url = `${prefix}?current=${current}&limit=${limit}`;

    if (option?.filter) {
      url += `&qs=${encodeURIComponent(option.filter)}`;
    }

    if (option?.sort) {
      url += `&sort=${encodeURIComponent(option.sort)}`;
    }
    return http.get<RestaurantListResType>(url);
  },
  addRestaurant: (body: CreateRestaurantBodyType) =>
    http.post<RestaurantResType>(prefix, body),
  updateRestaurant: (body: UpdateRestaurantBodyType) =>
    http.patch<RestaurantResType>(`${prefix}/${body.restaurantsId}`, body),
  deleteRestaurant: (id: string) =>
    http.delete<RestaurantResType>(`${prefix}/${id}`),
};

export default restaurantApiRequest;
