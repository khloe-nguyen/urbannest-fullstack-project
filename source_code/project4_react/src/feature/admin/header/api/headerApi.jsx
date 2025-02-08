import axiosAdmin from "@/shared/api/axiosAdmin";
import { useMutation } from "@tanstack/react-query";

export const ChangePassswordRequest = () => {
  const request = async (payload) => {
    const response = await axiosAdmin.post("authAD/reset_password", payload);
    return response.data;
  };

  return useMutation({
    mutationFn: request,
  });
};
