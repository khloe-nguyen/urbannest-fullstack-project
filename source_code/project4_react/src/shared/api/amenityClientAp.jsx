import axiosClient from "./axiosClient";
import { useQuery } from "@tanstack/react-query";

export const AmenityRequest = () => {
  const request = async () => {
    const response = await axiosClient.get("amenityCM");
    return response.data;
  };

  return useQuery({
    queryKey: ["amenity"],
    queryFn: request,
  });
};
