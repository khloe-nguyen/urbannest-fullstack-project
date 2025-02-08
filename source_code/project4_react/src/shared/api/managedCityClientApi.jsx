import axiosClient from "./axiosClient";
import { useQuery } from "@tanstack/react-query";

export const ManagedCityRequest = () => {
  const request = async () => {
    const response = await axiosClient.get("managedCityCM");
    return response.data;
  };

  return useQuery({
    queryKey: ["managedCity"],
    queryFn: request,
  });
};
