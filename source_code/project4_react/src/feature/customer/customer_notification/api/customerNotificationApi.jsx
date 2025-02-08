import axiosClient from "@/shared/api/axiosClient";
import { useMutation, useQuery } from "@tanstack/react-query";

export const GetCustomerNotificationRequest = (pageNumber, pageSize, status) => {
  const request = async (pageNumber, pageSize, status) => {
    const response = await axiosClient.get(`notificationCM/get_notification`, {
      params: { pageNumber, pageSize, status }, // Pass bookingId as query param
    });
    return response.data;
  };

  return useQuery({
    queryKey: ["notifications_customer", pageNumber, pageSize, status], // Unique query key based on bookingId
    queryFn: () => request(pageNumber, pageSize, status),
  });
};

export const DeleteCustomerNotificationRequest = () => {
  const request = async (payload) => {
    const response = await axiosClient.post("notificationCM/delete_notification", payload);
    return response.data;
  };

  return useMutation({
    mutationFn: request,
  });
};

export const UpdateCustomerNotificationRequest = () => {
  const request = async (payload) => {
    const response = await axiosClient.post("notificationCM/update_notification", payload);
    return response.data;
  };

  return useMutation({
    mutationFn: request,
  });
};
