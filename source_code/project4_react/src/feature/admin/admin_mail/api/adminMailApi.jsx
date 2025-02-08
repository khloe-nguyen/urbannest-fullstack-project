import axiosAdmin from "@/shared/api/axiosAdmin";
import { useMutation, useQuery } from "@tanstack/react-query";

export const GetUserMailListRequest = () => {
  const request = async () => {
    const response = await axiosAdmin.get("mailAD/user_list");
    return response.data;
  };

  return useQuery({
    queryKey: ["mail_users"],
    queryFn: request,
  });
};

export const CreateNewEmailRequest = () => {
  const request = async (payload) => {
    const response = await axiosAdmin.post("mailAD/create_new_mail", payload);
    return response.data;
  };

  return useMutation({
    mutationFn: request,
  });
};
