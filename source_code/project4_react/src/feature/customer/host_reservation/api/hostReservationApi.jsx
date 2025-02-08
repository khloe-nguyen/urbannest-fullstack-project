import axiosClient from "@/shared/api/axiosClient";
import { useMutation, useQuery } from "@tanstack/react-query";

export const GetHostReservationRequest = (
  pageNumber,
  pageSize,
  status,
  propertyId,
  startDate,
  endDate
) => {
  const request = async (pageNumber, pageSize, status) => {
    const response = await axiosClient.get("bookingCM/get_host_reserved_booking", {
      params: { pageNumber, pageSize, status, propertyId, startDate, endDate },
    });

    return response.data;
  };

  return useQuery({
    queryKey: ["reserved", pageNumber, pageSize, status, propertyId, startDate, endDate],
    queryFn: () => request(pageNumber, pageSize, status, propertyId, startDate, endDate),
  });
};

export const GetBookingConflictList = (bookingId) => {
  const request = async (bookingId) => {
    const response = await axiosClient.get("bookingCM/get_booking_conflict_list", {
      params: { bookingId },
    });

    return response.data;
  };

  return useQuery({
    queryKey: ["conflict", bookingId],
    queryFn: () => request(bookingId),
  });
};

export const AcceptReservationRequest = () => {
  const request = async (payload) => {
    const response = await axiosClient.put("bookingCM/accept_reservation", payload);
    return response.data;
  };

  return useMutation({
    mutationFn: request,
  });
};

export const DenyReservationRequest = () => {
  const request = async (payload) => {
    const response = await axiosClient.put("bookingCM/deny_reservation", payload);
    return response.data;
  };

  return useMutation({
    mutationFn: request,
  });
};
