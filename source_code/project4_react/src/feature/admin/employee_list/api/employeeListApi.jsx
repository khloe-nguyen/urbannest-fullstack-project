import axiosAdmin from "@/shared/api/axiosAdmin";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import qs from "qs";

export const GetEmployeeListRequest = (
  pageNumber,
  pageSize,
  searchText,
  status,
  cityFilter,
  roleFilter
) => {
  const request = async (pageNumber, pageSize, searchText, status, cityFilter, roleFilter) => {
    const response = await axiosAdmin.get("employeeAD/get_employees", {
      params: { pageNumber, pageSize, searchText, status, cityFilter, roleFilter },
      paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
    });
    return response.data;
  };

  return useQuery({
    queryKey: ["employees", pageNumber, pageSize, searchText, status, cityFilter, roleFilter],
    queryFn: () => request(pageNumber, pageSize, searchText, status, cityFilter, roleFilter),
  });
};

export const ChangeEmployeeStatusRequest = () => {
  const request = async (payload) => {
    const response = await axiosAdmin.put("employeeAD/change_status", payload);
    return response.data;
  };

  return useMutation({
    mutationFn: request,
  });
};

export const ChangeEmployeeManagedCityRequest = () => {
  const request = async (payload) => {
    const response = await axiosAdmin.put("cityAD/change_employee_managed_city", payload);
    return response.data;
  };

  return useMutation({
    mutationFn: request,
  });
};

export const ChangeEmployeeRoleRequest = () => {
  const request = async (payload) => {
    const response = await axiosAdmin.put("roleAD/change_employee_role", payload);
    return response.data;
  };

  return useMutation({
    mutationFn: request,
  });
};

export const ChangeEmployeePassswordRequest = () => {
  const request = async (payload) => {
    const response = await axiosAdmin.post("authAD/reset_employee_password", payload);
    return response.data;
  };

  return useMutation({
    mutationFn: request,
  });
};
