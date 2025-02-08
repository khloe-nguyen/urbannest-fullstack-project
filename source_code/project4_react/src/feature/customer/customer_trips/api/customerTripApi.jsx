import axiosClient from "@/shared/api/axiosClient";
import { useQuery } from "@tanstack/react-query";
import qs from "qs";
import { useMutation } from "@tanstack/react-query";

export const GetUserTripsRequest = (
  pageNumber,
  pageSize,
  status,
  startDate,
  endDate,
  groupDate
) => {
  const request = async (pageNumber, pageSize, status, startDate, endDate, groupDate) => {
    const response = await axiosClient.get("bookingCM/get_user_booking", {
      params: { pageNumber, pageSize, status, startDate, endDate, groupDate },
      paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
    });
    return response.data;
  };

  return useQuery({
    queryKey: ["trips", pageNumber, pageSize, status, startDate, endDate, groupDate],
    queryFn: () => request(pageNumber, pageSize, status, startDate, endDate, groupDate),
  });
};

export const GetUserTripsCountRequest = (startDate, endDate) => {
  const request = async (startDate, endDate) => {
    const response = await axiosClient.get("bookingCM/get_tripping_count", {
      params: { startDate, endDate },
      paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
    });
    return response.data;
  };

  return useQuery({
    queryKey: ["trips_count", startDate, endDate],
    queryFn: () => request(startDate, endDate),
  });
};

export const RateByCustomerRequest = () => {
  const request = async (payload) => {
    const response = await axiosClient.post("reviewCM/review_by_customer", payload);
    return response.data;
  };

  return useMutation({
    mutationFn: request,
  });
};

export const GetUserReservationRequest = (pageNumber, pageSize, status, startDate, endDate) => {
  const request = async (pageNumber, pageSize, status, startDate, endDate) => {
    const response = await axiosClient.get("bookingCM/get_user_reservation", {
      params: { pageNumber, pageSize, status, startDate, endDate },
      paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
    });
    return response.data;
  };

  return useQuery({
    queryKey: ["trips_reserved", pageNumber, pageSize, status, startDate, endDate],
    queryFn: () => request(pageNumber, pageSize, status, startDate, endDate),
  });
};

export const GetUserReservedCountRequest = (startDate, endDate) => {
  const request = async (startDate, endDate) => {
    const response = await axiosClient.get("bookingCM/get_reserved_count", {
      params: { startDate, endDate },
      paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
    });
    return response.data;
  };

  return useQuery({
    queryKey: ["reserved_count", startDate, endDate],
    queryFn: () => request(startDate, endDate),
  });
};

export const GetUserReviewRequest = (pageNumber, pageSize, status) => {
  const request = async (pageNumber, pageSize, status) => {
    const response = await axiosClient.get("reviewCM/user_review", {
      params: { pageNumber, pageSize, status },
      paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
    });
    return response.data;
  };

  return useQuery({
    queryKey: ["review_trip", pageNumber, pageSize, status],
    queryFn: () => request(pageNumber, pageSize, status),
  });
};

export const ReportBookingRequest = () => {
  const request = async (payload) => {
    const response = await axiosClient.post("disputeCM/new_report", payload);
    return response.data;
  };

  return useMutation({
    mutationFn: request,
  });
};

export const UpdateRefundForBookingMutation = () => {
  const updateRefundForBookingMutation = useMutation({
    mutationFn: async (refundForBookingFormData) => {
      const response = await axiosClient.post(
        "bookingCM/updateRefundForBooking",
        refundForBookingFormData
      );
      return response.data;
    },
  });
  return updateRefundForBookingMutation;
};

export const GetUserRefundRequest = (pageNumber, pageSize, startDate, endDate) => {
  const request = async (pageNumber, pageSize, startDate, endDate) => {
    const response = await axiosClient.get("bookingCM/get_user_refund", {
      params: { pageNumber, pageSize, startDate, endDate },
      paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
    });
    return response.data;
  };

  return useQuery({
    queryKey: ["user_refund", pageNumber, pageSize, startDate, endDate],
    queryFn: () => request(pageNumber, pageSize, startDate, endDate),
  });
};

export const CancelReservationRequest = () => {
  const mutation = useMutation({
    mutationFn: async (payload) => {
      const response = await axiosClient.post("bookingCM/cancel_reservation", payload);
      return response.data;
    },
  });
  return mutation;
};
