import axiosClient from "../../../../shared/api/axiosClient";
import { useQuery } from "@tanstack/react-query";
import { useInfiniteQuery } from "@tanstack/react-query";
import qs from "qs";

// export const PropertiesRequest = (
//   pageNumber,
//   pageSize,
//   categoryId,
//   propertyType,
//   amenities,
//   isInstant,
//   isSelfCheckin,
//   isPetAllow,
//   priceRange,
//   room,
//   bed,
//   bathRoom
// ) => {
//   const request = async (
//     pageNumber,
//     pageSize,
//     categoryId,
//     propertyType,
//     amenities,
//     isInstant,
//     isSelfCheckin,
//     isPetAllow,
//     priceRange,
//     room,
//     bed,
//     bathRoom
//   ) => {
//     const response = await axiosClient.get("listingCM/propertyCM", {
//       params: {
//         pageNumber,
//         pageSize,
//         categoryId,
//         propertyType,
//         amenities,
//         isInstant,
//         isSelfCheckin,
//         isPetAllow,
//         priceRange,
//         room,
//         bed,
//         bathRoom,
//       },
//       paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
//     });
//     return response.data;
//   };

//   return useQuery({
//     queryKey: [
//       "properties",
//       pageNumber,
//       pageSize,
//       categoryId,
//       propertyType,
//       amenities,
//       isInstant,
//       isSelfCheckin,
//       isPetAllow,
//       priceRange,
//       room,
//       bed,
//       bathRoom,
//     ],
//     queryFn: () =>
//       request(
//         pageNumber,
//         pageSize,
//         categoryId,
//         propertyType,
//         amenities,
//         isInstant,
//         isSelfCheckin,
//         isPetAllow,
//         priceRange,
//         room,
//         bed,
//         bathRoom
//       ),
//   });
// };

export const PropertiesRequest = (
  categoryId,
  propertyType,
  amenities,
  isInstant,
  isSelfCheckIn,
  isPetAllowed,
  priceRange,
  room,
  bed,
  bathRoom,
  guest,
  province,
  district,
  ward,
  startDate,
  endDate,
  name
) => {
  const request = async (
    pageNumber,
    pageSize,
    categoryId,
    propertyType,
    amenities,
    isInstant,
    isSelfCheckIn,
    isPetAllowed,
    priceRange,
    room,
    bed,
    bathRoom,
    guest,
    province,
    district,
    ward,
    startDate,
    endDate,
    name
  ) => {
    const response = await axiosClient.get("listingCM/propertyCM", {
      params: {
        pageNumber,
        pageSize,
        categoryId,
        propertyType,
        amenities,
        isInstant,
        isSelfCheckIn,
        isPetAllowed,
        priceRange,
        room,
        bed,
        bathRoom,
        guest,
        province,
        district,
        ward,
        startDate,
        endDate,
        name,
      },
      paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
    });
    return response.data;
  };

  return useInfiniteQuery({
    queryKey: [
      "properties",
      categoryId,
      propertyType,
      amenities,
      isInstant,
      isSelfCheckIn,
      isPetAllowed,
      priceRange,
      room,
      bed,
      bathRoom,
      guest,
      province,
      district,
      ward,
      startDate,
      endDate,
      name,
    ],
    queryFn: ({ pageParam = 0 }) => {
      return request(
        pageParam,
        20,
        categoryId,
        propertyType,
        amenities,
        isInstant,
        isSelfCheckIn,
        isPetAllowed,
        priceRange,
        room,
        bed,
        bathRoom,
        guest,
        province,
        district,
        ward,
        startDate,
        endDate,
        name
      );
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (lastPage.hasNext == true) {
        return lastPage.currentPage + 1;
      } else {
        return null;
      }
    },
    refetchOnWindowFocus: false,
  });
};
