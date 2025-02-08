import axiosClient from "./axiosClient";
import { useQuery } from "@tanstack/react-query";

export const CategoriesRequest = () => {
  const request = async () => {
    const response = await axiosClient.get("categoryCM");
    return response.data;
  };

  return useQuery({
    queryKey: ["categories"],
    queryFn: request,
  });
};
