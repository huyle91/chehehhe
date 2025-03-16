import http from "@/lib/http";
import { MenuResponseType, DishDetailResponseType } from "@/schemaValidations/dish_restaurant.schema";

const prefix = "/v1/dish/restaurant";
const dishPrefix = "/v1/dish";

const menuByRestaurantApiRequest = {
  getDishesByRestaurant: (
    current: number,
    limit: number,
    restaurantId: string,
    option?: { sort: string; filter: string; category?: string }
  ) => {
    let url = `${prefix}/${restaurantId}?current=${current}&limit=${limit}&restaurantId=${restaurantId}`;

    if (option?.category) {
      url += `&qs=category%3D${option.category}`;
    }

    if (option?.filter) {
      url += `&filter=${encodeURIComponent(option.filter)}`;
    }

    if (option?.sort) {
      url += `&sort=${encodeURIComponent(option.sort)}`;
    }

    return http.get<MenuResponseType>(url);
  },

  getDishDetail: (dishId: string) => {
    const url = `${dishPrefix}/${dishId}`;
    return http.get<DishDetailResponseType>(url);
  },
};

export default menuByRestaurantApiRequest;