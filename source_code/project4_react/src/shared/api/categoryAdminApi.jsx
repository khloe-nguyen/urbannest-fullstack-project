import axiosAdmin from "./axiosAdmin";
import { useQuery } from "@tanstack/react-query";

export const AdminCategoryRequest = () => {
  const request = async () => {
    const response = await axiosAdmin.get("categoryAD/get_all_categories");
    return response.data;
  };

  return useQuery({
    queryKey: ["admin_category"],
    queryFn: request,
  });
};
