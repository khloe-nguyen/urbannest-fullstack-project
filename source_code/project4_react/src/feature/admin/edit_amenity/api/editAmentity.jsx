import axiosAdmin from "@/shared/api/axiosAdmin";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

export const GetAmenityByIdRequest = (id) => {
  const request = async (id) => {
    const respose = await axiosAdmin.get("amenityAD/find_by_id", { params: { id } });
    return respose.data;
  };

  return useQuery({
    queryKey: ["amenity_id", id],
    queryFn: () => request(id),
  });
};

export const UpdateAmenityRequest = () => {
  const request = async (payload) => {
    const respose = await axiosAdmin.put("amenityAD", payload);
    return respose.data;
  };

  return useMutation({
    mutationFn: request,
  });
};
