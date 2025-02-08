import axiosClient from "@/shared/api/axiosClient";
import { useQuery } from "@tanstack/react-query";

export const GetHostListingsRequest = (pageNumber, pageSize, search, status) => {
  const request = async (pageNumber, pageSize) => {
    const response = await axiosClient.get("listingCM/get_host_listings", {
      params: { pageNumber, pageSize, search, status },
    });
    return response.data;
  };

  return useQuery({
    queryKey: ["host_listings", pageNumber, pageSize, search, status],
    queryFn: () => request(pageNumber, pageSize, search, status),
  });
};
