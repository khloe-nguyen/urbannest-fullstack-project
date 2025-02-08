import axiosClient from "@/shared/api/axiosClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

export const InitializeListingRequest = () => {
  const request = async () => {
    const response = await axiosClient.post("listingCM/initial");
    return response.data;
  };

  return useMutation({
    mutationFn: request,
  });
};

export const GetHostListingById = (id) => {
  const request = async (id) => {
    const response = await axiosClient.get("listingCM/get_host_listing_by_id", {
      params: { id },
    });

    return response.data;
  };

  return useQuery({
    queryKey: ["host_listing", id],
    queryFn: () => request(id),
    retry: 0,
  });
};

export const SearchAddressCoordinates = (address) => {
  const apiKey = "6a353276bf934c37a92289705744d800";

  const request = async (address) => {
    const response = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${apiKey}`
    );
    return response.data.results;
  };

  return request(address);
};

export const UpdatePropertyRequest = () => {
  const request = async (payload) => {
    const response = await axiosClient.post("listingCM/update_listing", payload);
    return response.data;
  };

  return useMutation({
    mutationFn: request,
  });
};

export const PublicListingRequest = () => {
  const request = async (payload) => {
    const response = await axiosClient.put("listingCM/public_request", payload);
    return response.data;
  };

  return useMutation({
    mutationFn: request,
  });
};

export const GetPropertyReviewRequest = (pageNumber, pageSize, status, propertyId) => {
  const request = async (pageNumber, pageSize, status, propertyId) => {
    const response = await axiosClient.get("reviewCM/property_review", {
      params: { pageNumber, pageSize, status, propertyId },
    });
    return response.data;
  };

  return useQuery({
    queryKey: ["property_review", pageNumber, pageSize, status, propertyId],
    queryFn: () => request(pageNumber, pageSize, status, propertyId),
  });
};
