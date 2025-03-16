import { dishApiRequest } from "@/apiRequest/dish";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetDish = (
  current: number,
  pageSize: number,
  { sort, filter }: { sort: string; filter: string }
) => {
  return useQuery({
    queryKey: ["dish", current, pageSize, sort, filter],
    queryFn: async () => {
      try {
        const data = await dishApiRequest.getAllDish(current, pageSize, {
          sort,
          filter,
        });
        if (!data) {
          throw new Error("Failed to fetch dishes");
        }
        return data;
      } catch (error) {
        console.error("Error fetching dishes:", error);
        throw error;
      }
    },
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};


export const useGetDishFollowRestaurant = (
  current: number,
  pageSize: number,
  restaurantId:string|undefined,
  { sort, filter }: { sort: string; filter: string }
) => {
  return useQuery({
    queryKey: ["dish-follow-restaurant", restaurantId, current, pageSize, sort, filter],
    queryFn: async () => {
      const data = await dishApiRequest.getAllDishFollowRestaurant(current, pageSize, restaurantId,{
        sort,
        filter,
      });
      if (!data) {
        console.log("wrong useGetDishFollowRestaurant");
      } else {
        return data;
      }
    },
    enabled:!!restaurantId,
  });
};


export const useCreateDishMutation = () => {
  return useMutation({
    mutationFn: dishApiRequest.createDish,
  });
};

export const useUpdateDishMutation = () => {
  return useMutation({
    mutationFn: dishApiRequest.updateDish,
  });
};

export const useDeleteDishMutation = () => {
  return useMutation({
    mutationFn: dishApiRequest.deleteDish,
  });
};

