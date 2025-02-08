import axiosAdmin from "@/shared/api/axiosAdmin";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

export const GetCategoryListRequest = (pageNumber, pageSize, search, status) => {
  const request = async (pageNumber, pageSize, search, status) => {
    const response = await axiosAdmin.get("categoryAD", {
      params: { pageNumber, pageSize, search, status },
    });
    return response.data;
  };

  return useQuery({
    queryKey: ["admin_category", pageNumber, pageSize, search, status],
    queryFn: () => request(pageNumber, pageSize, search, status),
  });
};

export const UpdateCategoryStatusRequest = () => {
  const request = async (payload) => {
    const response = await axiosAdmin.put("categoryAD/change_category_status", payload);
    return response.data;
  };

  return useMutation({
    mutationFn: request,
  });
};
