import axiosClient from "@/shared/api/axiosClient";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

export const GetHostCalendarRequest = () => {
  const request = async () => {
    const response = await axiosClient.get("listingCM/get_host_calendar_list");
    return response.data;
  };

  return useQuery({
    queryKey: ["host_calendar"],
    queryFn: request,
  });
};

export const GetBookingOfPropertyRequest = (propertyId) => {
  const request = async (propertyId) => {
    const response = await axiosClient.get("bookingCM/property_booking", {
      params: { propertyId },
    });
    return response.data;
  };

  return useQuery({
    queryKey: ["property_booking", propertyId],
    queryFn: () => request(propertyId),
  });
};

export const UpdateNotAvailableDateRequest = () => {
  const request = async (payload) => {
    const response = await axiosClient.put("listingCM/update_not_available_date", payload);
    return response.data;
  };

  return useMutation({
    mutationFn: request,
  });
};

export const OpenNotAvailableDateRequest = () => {
  const request = async (payload) => {
    const response = await axiosClient.put("listingCM/open_not_available_date", payload);
    return response.data;
  };

  return useMutation({
    mutationFn: request,
  });
};

export const UpdateExceptionDateRequest = () => {
  const request = async (payload) => {
    const response = await axiosClient.put("listingCM/update_exception_date", payload);
    return response.data;
  };

  return useMutation({
    mutationFn: request,
  });
};
