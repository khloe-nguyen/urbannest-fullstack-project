import WaitingPopUp from "@/shared/components/PopUp/WaitingPopUp";
import HostMessages from "../host_messages/HostMessages";
import { UserRequest } from "@/shared/api/userApi";
import PropertyHeader from "../custome_header/PropertyHeader";
import ChatHeader from "../custome_header/ChatHeader";
import { useNavigate } from "react-router-dom";

export default function CustomerMessages() {
  const user = UserRequest();
  const navigate = useNavigate();

  if (user.isLoading) {
    return <WaitingPopUp />;
  }

  if (user.isError || user.data.data == null) {
    navigate("/");
    return;
  }

  return (
    <div>
      <ChatHeader />
      <HostMessages />
    </div>
  );
}
