import { dishRestaurantApiRequest } from "@/apiRequest/dish_restaurant";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetDishRestaurant = (
  current: number,
  pageSize: number,
  { sort, filter }: { sort: string; filter: string },
  restaurantId: string
) => {
  return useQuery({
    queryKey: ["dish", current, pageSize, sort, filter, restaurantId],
    queryFn: async () => {
      const data = await dishRestaurantApiRequest.getAllDishRestaurant(
        current,
        pageSize,
        {
          sort,
          filter,
          
        },
       
      );
      if (!data) {
        console.log("wrong useGetDishRestaurant");
      } else {
        return data;
      }
    },
  });
};




export const useCreateDishRestaurantMutation = () => {
  return useMutation({
    mutationFn: dishRestaurantApiRequest.createDishRestaurant,
  });
};

export const useUpdateDishRestaurantMutation = () => {
  return useMutation({
    mutationFn: dishRestaurantApiRequest.updateDishRestaurant,
  });
};

export const useDeleteDishRestaurantMutation = () => {
  return useMutation({
    mutationFn: dishRestaurantApiRequest.deleteDishRestaurant,
  });
};
