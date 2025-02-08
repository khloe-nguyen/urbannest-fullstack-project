import axiosClient from "@/shared/api/axiosClient";
import { useMutation, useQuery } from "@tanstack/react-query";

export const GetHostBookingRequest = (status, pageNumber, pageSize, groupDate) => {
  const request = async (status, pageNumber, pageSize, groupDate) => {
    const response = await axiosClient.get("bookingCM/bookings", {
      params: { status, pageNumber, pageSize, groupDate },
    });
    return response.data;
  };

  return useQuery({
    queryKey: ["bookings", status, pageNumber, pageSize, groupDate],
    queryFn: () => request(status, pageNumber, pageSize, groupDate),
  });
};

export const GetHostBookingCountRequest = () => {
  const request = async () => {
    const response = await axiosClient.get("bookingCM/booking_count");
    return response.data;
  };

  return useQuery({
    queryKey: ["booking_count"],
    queryFn: () => request(),
  });
};

export const RateByHostRequest = () => {
  const request = async (payload) => {
    const response = await axiosClient.post("reviewCM/review_by_host", payload);
    return response.data;
  };

  return useMutation({
    mutationFn: request,
  });
};

export const ChangeBookingInstructionRequest = () => {
  const request = async (payload) => {
    const response = await axiosClient.post("bookingCM/change_booking_instruction", payload);
    return response.data;
  };

  return useMutation({
    mutationFn: request,
  });
};

export const ChangeBasePriceRequest = () => {
  const request = async (payload) => {
    const response = await axiosClient.put("listingCM/change_base_price", payload);
    return response.data;
  };

  return useMutation({
    mutationFn: request,
  });
};

export const ChangeWeeklyDiscountRequest = () => {
  const request = async (payload) => {
    const response = await axiosClient.put("listingCM/change_weekly_discount", payload);
    return response.data;
  };

  return useMutation({
    mutationFn: request,
  });
};

export const ChangeMonthlyDiscountRequest = () => {
  const request = async (payload) => {
    const response = await axiosClient.put("listingCM/change_monthly_discount", payload);
    return response.data;
  };

  return useMutation({
    mutationFn: request,
  });
};
