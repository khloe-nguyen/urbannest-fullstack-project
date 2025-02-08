import axiosAdmin from "@/shared/api/axiosAdmin";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import qs from "qs";

export const GetListingListRequest = (
  pageNumber,
  pageSize,
  status,
  propertySearchText,
  searchHost,
  bookType,
  locationsIds,
  amenityIds,
  categoryIds
) => {
  const request = async (
    pageNumber,
    pageSize,
    status,
    propertySearchText,
    searchHost,
    bookType,
    locationsIds,
    amenityIds,
    categoryIds
  ) => {
    const response = await axiosAdmin.get("listingAD/get_listing", {
      params: {
        pageNumber,
        pageSize,
        status,
        propertySearchText,
        searchHost,
        bookType,
        locationsIds,
        amenityIds,
        categoryIds,
      },
      paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
    });
    return response.data;
  };

  return useQuery({
    queryKey: [
      "listing_list",
      pageNumber,
      pageSize,
      status,
      propertySearchText,
      searchHost,
      bookType,
      locationsIds,
      amenityIds,
      categoryIds,
    ],
    queryFn: () =>
      request(
        pageNumber,
        pageSize,
        status,
        propertySearchText,
        searchHost,
        bookType,
        locationsIds,
        amenityIds,
        categoryIds
      ),
  });
};

export const ChangeListingStatusRequest = () => {
  const request = async (payload) => {
    const response = await axiosAdmin.post("listingAD/change_status", payload);
    return response.data;
  };

  return useMutation({
    mutationFn: request,
  });
};
