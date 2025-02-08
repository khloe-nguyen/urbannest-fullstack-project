import { useQuery } from "@tanstack/react-query";
import axiosAdmin from "./axiosAdmin";

export const AmenityAdminRequest = () => {
  const request = async () => {
    const response = await axiosAdmin.get("amenityAD/get_all_amenity");
    return response.data;
  };

  return useQuery({
    queryKey: ["amenity_admin"],
    queryFn: request,
  });
};
