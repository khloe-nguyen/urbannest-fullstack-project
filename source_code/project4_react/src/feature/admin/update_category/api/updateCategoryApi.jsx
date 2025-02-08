import axiosAdmin from "@/shared/api/axiosAdmin";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

export const GetCategoryByIdRequest = (id) => {
  const request = async (id) => {
    const respose = await axiosAdmin.get("categoryAD/find_by_id", { params: { id } });
    return respose.data;
  };

  return useQuery({
    queryKey: ["category_id", id],
    queryFn: () => request(id),
  });
};

export const UpdateCategoryRequest = () => {
  const request = async (payload) => {
    const respose = await axiosAdmin.put("categoryAD", payload);
    return respose.data;
  };

  return useMutation({
    mutationFn: request,
  });
};
