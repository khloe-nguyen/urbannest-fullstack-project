import axiosClient from "@/shared/api/axiosClient";
import { useMutation } from "@tanstack/react-query";

export const CreateDiscountRequest = () => {
  const createTransaction = async (payload) => {
    const response = await axiosClient.post("discountCM/create_dicount", payload);
    return response.data;
  };

  return useMutation({
    mutationFn: createTransaction,
  });
};
