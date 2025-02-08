import axiosClient from "./axiosClient";
import { useQuery } from "@tanstack/react-query";

export const UserRequest = () => {
  const request = async () => {
    const response = await axiosClient.get("authCM");
    return response.data;
  };

  return useQuery({
    queryKey: ["user"],
    queryFn: request,
    retry: 0,
  });
};
