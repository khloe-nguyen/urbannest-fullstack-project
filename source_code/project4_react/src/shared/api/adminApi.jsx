import axiosAdmin from "./axiosAdmin";
import { useQuery } from "@tanstack/react-query";

export const AdminRequest = () => {
  const request = async () => {
    const response = await axiosAdmin.get("authAD");
    return response.data;
  };

  return useQuery({
    queryKey: ["admin"],
    queryFn: request,
    retry: 0,
  });
};
