import axiosAdmin from "@/shared/api/axiosAdmin";
import { useQuery } from "@tanstack/react-query";

export const GetListingByIdRequest = (id) => {
  const request = async (id) => {
    const response = await axiosAdmin.get("listingAD/read_property_by_id", { params: { id } });
    return response.data;
  };

  return useQuery({
    queryKey: ["admin_listing", id],
    queryFn: () => request(id),
  });
};

export const GetAdminPropertyReviewRequest = (propertyId, pageNumber, pageSize, search, status) => {
  const request = async (propertyId, pageNumber, pageSize, search, status) => {
    const response = await axiosAdmin.get("reviewAD/get_property_review", {
      params: { propertyId, pageNumber, pageSize, search, status },
    });
    return response.data;
  };

  return useQuery({
    queryKey: ["property_review", propertyId, pageNumber, pageSize, search, status],
    queryFn: () => request(propertyId, pageNumber, pageSize, search, status),
  });
};
