import axiosClient from "../../../../shared/api/axiosClient";
import { useMutation, useQuery } from "@tanstack/react-query";

export const FavouriteRequest = (userId) => {
  const request = async (userId) => {
    const response = await axiosClient.get("favouriteCM/getFavourites", {
      params: { userId },
    });
    return response.data;
  };

  return useQuery({
    queryKey: ["favourites", userId],
    queryFn: () => request(userId),
  });
};
export const PropertyFavouriteRequest = (collectionName) => {
  const request = async (collectionName) => {
    const response = await axiosClient.get("favouriteCM/getPropertiesInWishList", {
      params: { collectionName },
    });
    return response.data;
  };

  return useQuery({
    queryKey: ["propertiesFavourites", collectionName],
    queryFn: () => request(collectionName),
  });
};

export const CreateFavouriteMutation = () => {
  const request = async (payload) => {
    const response = await axiosClient.post("favouriteCM/createFavourite", payload);
    return response.data;
  };

  return useMutation({
    mutationFn: request,
  });
};
export const DeleteFavouriteMutation = () => {
  const request = async (payload) => {
    const response = await axiosClient.post("favouriteCM/deleteFavourites", payload);
    return response.data;
  };

  return useMutation({
    mutationFn: request,
  });
};
