import axiosAdmin from "@/shared/api/axiosAdmin";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

export const GetEmployeeByIdRequest = (employeeId) => {
  const request = async (id) => {
    const response = await axiosAdmin.get("employeeAD/get_employee_by_id", {
      params: { employeeId },
    });
    return response.data;
  };

  return useQuery({
    queryKey: ["employee", employeeId],
    queryFn: () => request(employeeId),
    retry: 0,
  });
};

export const UpdateEmployeeRequest = () => {
  const request = async (payload) => {
    const response = await axiosAdmin.put("employeeAD/update_employee", payload);
    return response.data;
  };

  return useMutation({
    mutationFn: request,
  });
};
