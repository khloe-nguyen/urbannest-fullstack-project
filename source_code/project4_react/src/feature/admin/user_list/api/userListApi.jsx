import axiosAdmin from "@/shared/api/axiosAdmin";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import qs from "qs";

export const GetUserListRequest = (pageNumber, pageSize, searchText, badges, userType) => {
  const request = async (pageNumber, pageSize, searchText, badges, userType) => {
    const response = await axiosAdmin.get("userAD/get_roles", {
      params: { pageNumber, pageSize, searchText, badges, userType },
      paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
    });
    return response.data;
  };

  return useQuery({
    queryKey: ["user_list", pageNumber, pageSize, searchText, badges, userType],
    queryFn: () => request(pageNumber, pageSize, searchText, badges, userType),
  });
};
