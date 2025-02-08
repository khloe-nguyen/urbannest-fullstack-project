import { useEffect } from "react";
import Footer from "../footer/Footer";
import "./styles/account-setting.css";
import SettingOption from "./components/SettingOption";
import { FaRegAddressCard } from "react-icons/fa";
import { FiShield } from "react-icons/fi";
import { GoCreditCard } from "react-icons/go";
import { AiOutlineNotification } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { UserRequest } from "@/shared/api/userApi";
import { MdOutlinePermIdentity } from "react-icons/md";
import WaitingPopUp from "@/shared/components/PopUp/WaitingPopUp";
import ChatHeader from "../custome_header/ChatHeader";
import Cookies from "js-cookie";

export default function AccountSetting() {
  const title = "Personal ";
  const description = "Provide personal details and how we can reach you";
  const navigate = useNavigate();
  const user = UserRequest();

  useEffect(() => {
    console.log(user.data);
  }, [user.isSuccess]);

  if (user.isLoading) {
    return <WaitingPopUp />;
  }

  if (user.isError) {
    Cookies.remove("CLIENT_ACCESS_TOKEN");
    navigate("/");
  }

  if (user.isSuccess && user.data.status == 404) {
    navigate("/");
    return;
  }

  if (user.isSuccess && user.data.status == 200 && user.data.data.status == false) {
    Cookies.remove("CLIENT_ACCESS_TOKEN");
    user.refetch();
  }

  const accountSettingList = [
    {
      iconComponent: <FaRegAddressCard fontSize={30} />,
      title: "Personal",
      description: "Provide personal details and how we can reach you",
      url: "/account-settings/personal-info",
    },
    {
      iconComponent: <FiShield fontSize={30} />,
      title: "Login & Sercurity",
      description: "Update your password and secure your account",
      url: "/account-settings/login-and-sercurity",
    },
    {
      iconComponent: <AiOutlineNotification fontSize={30} />,
      title: "Notifications",
      description: "Choose notification preferences and how you want to be contacted",
      url: "/customer_notification",
    },
    {
      iconComponent: <MdOutlinePermIdentity fontSize={30} />,
      title: "Government",
      description: "Setting your Identity and Driver License",
      url: "/account-settings/personal-info/govermentSetting",
    },
  ];
  return (
    <div>
      <ChatHeader padding={"13rem"} />
      <div className="account-settings-container">
        <div className="title">
          <h1>Account</h1>
          <div>
            <p className="description">
              {user.data.data.firstName} {user.data.data.lastName}, {user.data.data.email}
            </p>
            <a
              style={{ color: "purple", cursor: "pointer", textDecoration: "underline" }}
              onClick={() => navigate("/user-profile")}
            >
              Go to profile
            </a>
          </div>
        </div>
        <div className="grid-container">
          {accountSettingList?.map((ac, index) => (
            <div key={index} onClick={() => navigate(ac.url)}>
              <SettingOption
                iconComponent={ac.iconComponent}
                title={ac.title}
                description={ac.description}
              />
            </div>
          ))}
        </div>
      </div>
      <Footer percent={"73%"} />
    </div>
  );
}
