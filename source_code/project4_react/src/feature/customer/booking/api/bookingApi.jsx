import axiosClient from "@/shared/api/axiosClient";
import { useMutation, useQuery } from "@tanstack/react-query";

export const GetBooking = (bookingId) => {
  const fetchBooking = async () => {
    const response = await axiosClient.get(`bookingCM/getBookingById`, {
      params: { bookingId }, // Pass bookingId as query param
    });
    return response.data;
  };

  return useQuery({
    queryKey: ["booking", bookingId], // Unique query key based on bookingId
    queryFn: fetchBooking, // Call fetchBooking function
  });
};
export const TransactionRequest = () => {
  const createTransaction = async (payload) => {
    const response = await axiosClient.post("transaction/booking_escrow", payload);
    return response.data;
  };
  return useMutation({
    mutationFn: createTransaction,
  });
};
