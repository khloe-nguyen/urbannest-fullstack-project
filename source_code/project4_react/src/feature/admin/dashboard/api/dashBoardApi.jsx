import axiosAdmin from "@/shared/api/axiosAdmin";
import { useQuery } from "@tanstack/react-query";

export const GetCountChartRequest = (startDate, endDate) => {
  const request = async (startDate, endDate) => {
    const response = await axiosAdmin.get("chartAD/count", { params: { startDate, endDate } });
    return response.data;
  };

  return useQuery({
    queryKey: ["chart_count", startDate, endDate],
    queryFn: () => request(startDate, endDate),
  });
};

export const GetBookingChartRequest = (startDate, endDate) => {
  const request = async (startDate, endDate) => {
    const response = await axiosAdmin.get("chartAD/list_booking", {
      params: { startDate, endDate },
    });
    return response.data;
  };

  return useQuery({
    queryKey: ["chart_booking_list", startDate, endDate],
    queryFn: () => request(startDate, endDate),
  });
};

export const GetBestHost = () => {
  const request = async () => {
    const response = await axiosAdmin.get("chartAD/list_best_host");
    return response.data;
  };

  return useQuery({
    queryKey: ["best_host"],
    queryFn: () => request(),
  });
};
