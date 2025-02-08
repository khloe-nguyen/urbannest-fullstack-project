import axiosAdmin from "./axiosAdmin";
import { useQuery } from "@tanstack/react-query";

export const RefundAdminRequest = () => {
  const request = async () => {
    const response = await axiosAdmin.get("PolicyAD/get_all");
    return response.data;
  };

  return useQuery({
    queryKey: ["refund_admin"],
    queryFn: request,
  });
};
