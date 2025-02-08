import axiosAdmin from "@/shared/api/axiosAdmin";
import { useMutation, useQuery } from "@tanstack/react-query";

export const GetNotificationRequest = (pageNumber, pageSize, status) => {
  const request = async (pageNumber, pageSize, status) => {
    const response = await axiosAdmin.get(`notificationAD/get_notification`, {
      params: { pageNumber, pageSize, status }, // Pass bookingId as query param
    });
    return response.data;
  };

  return useQuery({
    queryKey: ["notifications", pageNumber, pageSize, status], // Unique query key based on bookingId
    queryFn: () => request(pageNumber, pageSize, status),
  });
};

export const DeleteNotificationRequest = () => {
  const request = async (payload) => {
    const response = await axiosAdmin.post("notificationAD/delete_notification", payload);
    return response.data;
  };

  return useMutation({
    mutationFn: request,
  });
};

export const UpdateNotificationRequest = () => {
  const request = async (payload) => {
    const response = await axiosAdmin.post("notificationAD/update_notification", payload);
    return response.data;
  };

  return useMutation({
    mutationFn: request,
  });
};
