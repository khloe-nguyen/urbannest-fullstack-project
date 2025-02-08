import axiosAdmin from "@/shared/api/axiosAdmin";
import { useMutation } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
export const GetUserDocumentImageQuery = (pageNumber, pageSize, statusId, fromDateTime, toDateTime) => {
    const fetchBooking = async () => {
        const response = await axiosAdmin.get(`userCM/userDocuments`, {
            params: { pageNumber, pageSize, statusId, fromDateTime, toDateTime }, // Pass bookingId as query param
        });
        return response.data;
    };

    return useQuery({
        queryKey: ["userDocumentImage", pageNumber, pageSize, statusId,fromDateTime,toDateTime], // Unique query key based on bookingId
        queryFn: () => fetchBooking(pageNumber, pageSize, statusId, fromDateTime, toDateTime), // Call fetchBooking function
    });
};