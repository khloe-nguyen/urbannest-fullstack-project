import axiosClient from "./axiosClient";
import { useQuery } from "@tanstack/react-query";

export const PolicyRequest = () => {
  const request = async () => {
    const response = await axiosClient.get("policyCM");
    return response.data;
  };

  return useQuery({
    queryKey: ["policy"],
    queryFn: request,
  });
};
