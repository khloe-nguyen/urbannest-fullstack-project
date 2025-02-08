import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import axiosAdmin from "@/shared/api/axiosAdmin";

export const GetManagedCityRequest = (pageNumber, pageSize, cityName, status) => {
  const request = async (pageNumber, pageSize, cityName) => {
    const response = await axiosAdmin.get("cityAD", {
      params: { pageNumber, pageSize, cityName, status },
    });
    return response.data;
  };

  return useQuery({
    queryKey: ["city", pageNumber, pageSize, cityName, status],
    queryFn: () => request(pageNumber, pageSize, cityName, status),
  });
};

export const UpdateCityStatusRequest = () => {
  const request = async (payload) => {
    const response = await axiosAdmin.post("cityAD", payload);
    return response.data;
  };

  return useMutation({
    mutationFn: request,
  });
};
