import axiosAdmin from "./axiosAdmin";
import { useQuery } from "@tanstack/react-query";

export const ManagedCityAdminRequest = () => {
  const request = async () => {
    const response = await axiosAdmin.get("cityAD/all_cities");
    return response.data;
  };

  return useQuery({
    queryKey: ["all_cities"],
    queryFn: request,
  });
};
