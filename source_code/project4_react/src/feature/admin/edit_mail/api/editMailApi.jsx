import axiosAdmin from "@/shared/api/axiosAdmin";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

export const GetMailByIdRequest = (id) => {
  const request = async (id) => {
    const response = await axiosAdmin.get("mailAD/get_mail_by_id", {
      params: { id },
    });
    return response.data;
  };

  return useQuery({
    queryKey: ["mail_by_id", id],
    queryFn: () => request(id),
  });
};

export const EditScheduleEmailRequest = () => {
  const request = async (payload) => {
    const response = await axiosAdmin.post("mailAD/edit_schedule_mail", payload);
    return response.data;
  };

  return useMutation({
    mutationFn: request,
  });
};
