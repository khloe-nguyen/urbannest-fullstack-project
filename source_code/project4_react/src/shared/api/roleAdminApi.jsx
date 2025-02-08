import axiosAdmin from "./axiosAdmin";
import { useQuery } from "@tanstack/react-query";

export const RoleRequest = () => {
  const request = async () => {
    const response = await axiosAdmin.get("roleAD/get_roles");
    return response.data;
  };

  return useQuery({
    queryKey: ["roles"],
    queryFn: request,
  });
};
