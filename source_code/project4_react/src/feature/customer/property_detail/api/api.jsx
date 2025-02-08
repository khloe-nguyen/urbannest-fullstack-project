import axiosClient from "@/shared/api/axiosClient";
import { useMutation, useQuery } from "@tanstack/react-query";

export const BookingRequest = () => {
  const request = async (payload) => {
    const response = await axiosClient.post("bookingCM/add", payload);
    return response.data;
  };

  return useMutation({
    mutationFn: request,
  });
};

export const GetPropertyRequest = (id) => {
  const request = async (id) => {
    const response = await axiosClient.get(`listingCM?id=${id}`, {
      params: { id },
    });
    return response.data;
  };

  return useQuery({
    queryKey: ["property", id],
    queryFn: () => request(id),
  });
};

export const GetPolicies = () => {
  const request = async () => {
    const response = await axiosClient.get(`policyCM`);
    return response.data;
  };
  return useQuery({
    queryKey: ["policies"],
    queryFn: () => request(),
  });
};

export const CountByPropertyId = (propertyId) => {
  const request = async (propertyId) => {
    const response = await axiosClient.get(
      `reviewCM/get_all_reviews_of_property?propertyId=${propertyId}`,
      {
        params: { propertyId },
      }
    );

    return response.data;
  };
  return useQuery({
    queryKey: ["listReview", propertyId],
    queryFn: () => request(propertyId),
  });
};

export const GetAllReviewByPropertyId = (propertyId, pageNumber, pageSize) => {
  const request = async (propertyId, pageNumber, pageSize) => {
    const response = await axiosClient.get(
      `reviewCM/get_reviews_of_property?propertyId=${propertyId}&pageNumber${pageNumber}&pageSize=${pageSize}`,
      {
        params: { propertyId, pageNumber, pageSize },
      }
    );

    return response.data;
  };
  return useQuery({
    queryKey: ["listReview", propertyId, pageNumber, pageSize],
    queryFn: () => request(propertyId, pageNumber, pageSize),
  });
};
