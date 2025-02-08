import axiosClient from "@/shared/api/axiosClient";
import { useMutation } from "@tanstack/react-query";

const API_URL = "http://localhost:8080/userCM/legalName";

export const UseLegalNameMutation = useMutation({
    mutationFn: (legalNameRequest) =>{
        return axiosClient.put(API_URL,legalNameRequest);
    },
})
