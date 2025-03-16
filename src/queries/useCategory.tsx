import categoryApiRequest from "@/apiRequest/category";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetCategory = (
  current: number,
  pageSize: number,
  { sort, filter }: { sort: string; filter: string }
) => {
  return useQuery({
    queryKey: ["category", current, pageSize, sort, filter],
    queryFn: async () => {
      try {
        const data = await categoryApiRequest.getAllcategory(current, pageSize, {
          sort,
          filter,
        });
        if (!data) {
          throw new Error("Failed to fetch categories");
        }
        return data;
      } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
      }
    },
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useGetCategoryById = (id: string) => {
  return useQuery({
    queryKey: ["categorybyID", id],
    queryFn: async () => {
      const data = await categoryApiRequest.getCaregoryByID(id);
      if (!data) {
        console.log("wrong userGetCategoryById");
      } else {
        return data;
      }
    },
    enabled: !!id, // Chỉ thực thi query khi id có giá trị (khác null, undefined, hoặc chuỗi rỗng)
  });
};

export const useCreateCategoryMutation = () => {
  return useMutation({
    mutationFn: categoryApiRequest.createCategory,
  });
};

export const useUpdateCategoryMutation = () => {
  return useMutation({
    mutationFn: categoryApiRequest.updateCategory,
  });
};

export const useDeleteCategoryMutation = () => {
  return useMutation({
    mutationFn: categoryApiRequest.deleteCategory,
  });
};
