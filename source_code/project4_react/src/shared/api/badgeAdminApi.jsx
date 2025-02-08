import axiosAdmin from "./axiosAdmin";
import { useQuery } from "@tanstack/react-query";

export const AdminBadgeRequest = () => {
  const request = async () => {
    const response = await axiosAdmin.get("badgeAD");
    return response.data;
  };

  return useQuery({
    queryKey: ["admin_badge"],
    queryFn: request,
  });
};
