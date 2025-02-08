import React, { useEffect } from "react";
import styled from "styled-components";
import TitleHeader from "../components/common/TitleHeader";
import CustomerHeader from "../../custome_header/CustomerHeader";
import Footer from "../../footer/Footer";
import Login from "./login_and_security_component/Login";
import { UserRequest } from "@/shared/api/userApi";
import { useNavigate } from "react-router-dom";
import WaitingPopUp from "@/shared/components/PopUp/WaitingPopUp";
import ChatHeader from "../../custome_header/ChatHeader";

const Container = styled.div`
  width: 1080px;
  min-height: 500px;
  margin: 2rem auto;
  display: flex;
`;

const Left = styled.div`
  flex: 2;
`;
const Right = styled.div`
  flex: 1;
`;
export default function LoginAndSecurity() {
  const user = UserRequest();
  const navigate = useNavigate();
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

  return (
    <>
      <ChatHeader padding={"13rem"} />
      <Container>
        <Left>
          <TitleHeader name="Login & security" />
          <Login />
        </Left>
        <Right></Right>
      </Container>
      <Footer percent={"72%"} />
    </>
  );
}
