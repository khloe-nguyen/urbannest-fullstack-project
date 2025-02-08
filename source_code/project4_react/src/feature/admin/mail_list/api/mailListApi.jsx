import axiosAdmin from "@/shared/api/axiosAdmin";
import { useQuery } from "@tanstack/react-query";

export const GetMailListRequest = (pageNumber, pageSize, searchHeader, status) => {
  const request = async (pageNumber, pageSize, searchHeader, status) => {
    const response = await axiosAdmin.get("mailAD/get_mail_list", {
      params: { pageNumber, pageSize, searchHeader, status },
    });
    return response.data;
  };

  return useQuery({
    queryKey: ["mail_list", pageNumber, pageSize, searchHeader, status],
    queryFn: () => request(pageNumber, pageSize, searchHeader, status),
  });
};
