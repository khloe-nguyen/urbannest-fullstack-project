import axiosClient from "./axiosClient";
import { useQuery } from "@tanstack/react-query";

export const UserBadgeRequest = () => {
  const request = async () => {
    const response = await axiosClient.get("badgeCM/user_badge");
    return response.data;
  };

  return useQuery({
    queryKey: ["user_badge"],
    queryFn: request,
  });
};
