import menuByRestaurantApiRequest from "@/apiRequest/menuByRestaurant";
import { useQuery } from "@tanstack/react-query";

export const useGetMenuByRestaurant = (
  current: number,
  limit: number,
  restaurantId: string,
  option?: { sort: string; filter: string; category?: string }
) => {
  return useQuery({
    queryKey: ["menu", current, limit, restaurantId, option?.sort, option?.filter, option?.category],
    queryFn: async () => {
      const data = await menuByRestaurantApiRequest.getDishesByRestaurant(
        current,
        limit,
        restaurantId,
        option
      );
      if (!data) {
        console.log("wrong useGetMenuByRestaurant");
      }
      return data;
    },
  });
};

export const useGetDishDetail = (dishId: string) => {
    return useQuery({
      queryKey: ["dish", dishId],
      queryFn: async () => {
        const data = await menuByRestaurantApiRequest.getDishDetail(dishId);
        return data;
      },
      enabled: !!dishId,
    });
  };