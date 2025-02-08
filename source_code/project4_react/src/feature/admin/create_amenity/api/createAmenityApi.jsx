import axiosAdmin from "@/shared/api/axiosAdmin";
import { useMutation } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

export const GetAmenityTypeRequest = () => {
  const request = async () => {
    const response = await axiosAdmin.get("amenityAD/type");
    return response.data;
  };

  return useQuery({
    queryKey: ["amenity_type"],
    queryFn: request,
  });
};

export const CreateNewAmenityRequest = () => {
  const request = async (payload) => {
    const response = await axiosAdmin.post("amenityAD", payload);
    return response.data;
  };

  return useMutation({
    mutationFn: request,
  });
};
