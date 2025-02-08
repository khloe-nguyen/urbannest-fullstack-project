import axiosAdmin from "@/shared/api/axiosAdmin";
import { useMutation, useQuery } from "@tanstack/react-query";

export const GetDisputeDetailRequest = (disputeId) => {
  const request = async (disputeId) => {
    const response = await axiosAdmin.get("disputeAD/get_dispute_detail", {
      params: { disputeId },
    });
    return response.data;
  };

  return useQuery({
    queryKey: ["dispute_detail", disputeId],
    queryFn: () => request(disputeId),
  });
};

export const ChangeDisputeStatusRequest = () => {
  const request = async (payload) => {
    const response = await axiosAdmin.post("disputeAD/change_dispute_status", payload);
    return response.data;
  };

  return useMutation({
    mutationFn: request,
  });
};

export const AddDisputeDetailRequest = () => {
  const request = async (payload) => {
    const response = await axiosAdmin.post("disputeAD/add_dispute_detail", payload);
    return response.data;
  };

  return useMutation({
    mutationFn: request,
  });
};
