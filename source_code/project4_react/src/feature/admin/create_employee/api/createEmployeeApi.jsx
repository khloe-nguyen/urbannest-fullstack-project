import axiosAdmin from "@/shared/api/axiosAdmin";
import { useMutation } from "@tanstack/react-query";

export const CreateNewEmployeeRequest = () => {
  const request = async (payload) => {
    const response = await axiosAdmin.post("employeeAD/create_employee", payload);
    return response.data;
  };

  return useMutation({
    mutationFn: request,
  });
};
