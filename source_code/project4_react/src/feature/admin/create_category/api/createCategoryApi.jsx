import axiosAdmin from "@/shared/api/axiosAdmin";
import { useMutation } from "@tanstack/react-query";

export const CreateNewCategoryRequest = () => {
  const request = async (payload) => {
    const response = await axiosAdmin.post("categoryAD", payload);
    return response.data;
  };

  return useMutation({
    mutationFn: request,
  });
};
