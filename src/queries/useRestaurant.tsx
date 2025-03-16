import restaurantApiRequest from "@/apiRequest/restaurant";
import { useMutation, useQuery } from "@tanstack/react-query";

//add
export const useAddRestaurantMutation = () => {
  return useMutation({
    mutationFn: restaurantApiRequest.addRestaurant,
  });
};

//add
export const useUpdateRestaurantMutation = () => {
  return useMutation({
    mutationFn: restaurantApiRequest.updateRestaurant,
  });
};

//add
export const useDeleteRestaurantMutation = () => {
  return useMutation({
    mutationFn: restaurantApiRequest.deleteRestaurant,
  });
};

//get all
export const useGetListRestaurant = (
  current: number,
  pageSize: number,
  { sort, filter }: { sort: string; filter: string }
) => {
  return useQuery({
    queryKey: ["restaurant", current, pageSize, sort, filter],
    queryFn: async () => {
      const data = await restaurantApiRequest.list(current, pageSize, {
        sort,
        filter,
      });
      if (!data) {
        console.log("wrong useGetListRestaurant");
      } else {
        return data;
      }
    },
  });
};

//get by id
export const useGetRestaurantById = (id: string) => {
  return useQuery({
    queryKey: ["restaurant", id],
    queryFn: async () => {
      const data = await restaurantApiRequest.list(1, 1, {
        sort: "",
        filter: `filter=${encodeURIComponent(JSON.stringify({ _id: id }))}`
      });
      if (!data || !data.payload.data.result.length) {
        console.log("wrong useGetRestaurantById");
        return null;
      }
      return {
        payload: {
          data: data.payload.data.result[0]
        }
      };
    },
  });
};
