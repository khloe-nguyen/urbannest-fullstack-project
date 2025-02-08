import axiosAdmin from "@/shared/api/axiosAdmin";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useInfiniteQuery } from "@tanstack/react-query";

export const GetAdminChatRoomRequest = (userId) => {
  const request = async (userId) => {
    const response = await axiosAdmin.get("/chat/get_chat_room", { params: { userId } });
    return response.data;
  };

  return useQuery({
    queryKey: ["room", userId],
    queryFn: () => request(userId),
  });
};

export const GetAdminRoomMessageRequest = (roomId) => {
  const request = async (roomId, pageNumber, pageSize) => {
    const response = await axiosAdmin.get("chat/get_room_messages", {
      params: {
        roomId,
        pageNumber,
        pageSize,
      },
    });
    return response.data;
  };

  return useInfiniteQuery({
    queryKey: ["messages", roomId],
    queryFn: ({ pageParam = 0 }) => {
      return request(roomId, pageParam, 10);
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

export const SearchAdminFriendRequest = (userId, search) => {
  const request = async () => {
    const response = await axiosAdmin.get("chat/search_new_frient", {
      params: { userId, search },
    });
    return response.data;
  };

  return useQuery({
    queryKey: ["friend_search", userId, search],
    queryFn: () => request(userId, search),
  });
};

export const AddAdminNewFriendRequest = () => {
  const request = async (payload) => {
    const response = await axiosAdmin.post("chat/add_new_friend", payload);
    return response.data;
  };

  return useMutation({
    mutationFn: request,
  });
};

export const SearchAdminGroupChatFriendRequest = (userId, search) => {
  const request = async () => {
    const response = await axiosAdmin.get("userCM/search_user_group_chat", {
      params: { userId, search },
    });
    return response.data;
  };

  return useQuery({
    queryKey: ["group_search", userId, search],
    queryFn: () => request(userId, search),
  });
};

export const AddAdminNewGroupRequest = () => {
  const request = async (payload) => {
    const response = await axiosAdmin.post("chat/add_new_group", payload);
    return response.data;
  };

  return useMutation({
    mutationFn: request,
  });
};

export const UploadAdminImageRequest = () => {
  const request = async (payload) => {
    const response = await axiosAdmin.post("test", payload);
    return response.data;
  };

  return useMutation({
    mutationFn: request,
  });
};
