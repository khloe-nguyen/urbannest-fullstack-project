import { Outlet } from "react-router-dom";
import styled from "styled-components";
import { useEffect } from "react";
import WebFont from "webfontloader";
import HostHeader from "@/feature/customer/host_header/HostHeader";
import { UserRequest } from "../api/userApi";
import Cookies from "js-cookie";
import WaitingPopUp from "../components/PopUp/WaitingPopUp";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  min-height: 100vh;
`;

const OutletContainer = styled.div``;

export default function HostLayout() {
  const user = UserRequest();
  const navigate = useNavigate();

  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Nunito"],
      },
    });
  }, []);

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
    <Container>
      <HostHeader />
      <OutletContainer>
        <Outlet />
      </OutletContainer>
    </Container>
  );
}
