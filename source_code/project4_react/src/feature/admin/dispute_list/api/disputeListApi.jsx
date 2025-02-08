import { useQuery } from "@tanstack/react-query";
import axiosAdmin from "@/shared/api/axiosAdmin";
import qs from "qs";

export const GetDisputeListRequest = (
  pageNumber,
  pageSize,
  status,
  hostSearch,
  customerSearch,
  locationIds,
  propertySearch
) => {
  const request = async (
    pageNumber,
    pageSize,
    status,
    hostSearch,
    customerSearch,
    locationIds,
    propertySearch
  ) => {
    const response = await axiosAdmin.get("disputeAD/get_dispute_list", {
      params: {
        pageNumber,
        pageSize,
        status,
        hostSearch,
        customerSearch,
        locationIds,
        propertySearch,
      },
      paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
    });
    return response.data;
  };

  return useQuery({
    queryKey: [
      "dispute_list_admin",
      pageNumber,
      pageSize,
      status,
      hostSearch,
      customerSearch,
      locationIds,
      propertySearch,
    ],
    queryFn: () =>
      request(
        pageNumber,
        pageSize,
        status,
        hostSearch,
        customerSearch,
        locationIds,
        propertySearch
      ),
  });
};
