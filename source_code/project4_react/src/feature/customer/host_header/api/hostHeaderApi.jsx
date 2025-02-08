import axiosClient from "@/shared/api/axiosClient";
import { useQuery } from "@tanstack/react-query";

export const GetUserNotificationPopUpRequest = () => {
  const request = async () => {
    const response = await axiosClient.get("notificationCM/get_notification_popup");
    return response.data;
  };

  return useQuery({
    queryKey: ["notification_popup"],
    queryFn: () => request(),
  });
};
